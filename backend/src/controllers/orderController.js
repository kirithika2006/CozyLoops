const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const OrderCounter = require('../models/OrderCounter');
const Product = require('../models/Product');
const InventoryMovement = require('../models/InventoryMovement');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const statuses = ['Pending Payment', 'Confirmed', 'Processing', 'Ready for Dispatch', 'Dispatched', 'Completed', 'Cancelled'];
const transitions = {
  'Pending Payment': ['Confirmed', 'Processing', 'Cancelled'], Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Ready for Dispatch', 'Cancelled'], 'Ready for Dispatch': ['Dispatched', 'Cancelled'],
  Dispatched: ['Completed'], Completed: [], Cancelled: []
};
const sanitize = order => {
  const obj = order.toObject ? order.toObject() : order;
  delete obj.accessTokenHash; delete obj.adminNotes;
  obj.statusHistory = (obj.statusHistory || []).map(({ action, fromStatus, toStatus, note, createdAt }) => ({ action, fromStatus, toStatus, note, createdAt }));
  return obj;
};
const priceOf = product => Math.round(product.price * (1 - (product.discount || 0) / 100) * 100) / 100;
const validateCustomer = customer => {
  const fields = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pinCode'];
  if (!customer || fields.some(key => typeof customer[key] !== 'string' || !customer[key].trim())) throw new AppError('Please complete all required delivery details.', 400);
  const limits = { fullName: 120, phone: 20, email: 254, address: 500, city: 100, state: 100, pinCode: 12 };
  if (fields.some(key => customer[key].trim().length > limits[key])) throw new AppError('One or more delivery fields exceed the allowed length.', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) throw new AppError('Enter a valid email address.', 400);
  if (!/^[0-9+()\-\s]{8,20}$/.test(customer.phone.trim())) throw new AppError('Enter a valid mobile number.', 400);
  if (!/^[0-9A-Za-z\- ]{4,12}$/.test(customer.pinCode.trim())) throw new AppError('Enter a valid PIN code.', 400);
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { customer, items, customerNotes = '' } = req.body || {};
  validateCustomer(customer);
  if (!Array.isArray(items) || !items.length || items.length > 30) return next(new AppError('Your cart is empty or contains too many items.', 400));
  if (typeof customerNotes !== 'string' || customerNotes.length > 2000) return next(new AppError('Order notes are too long.', 400));
  const token = req.get('X-Order-Access-Token');
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return next(new AppError('A valid order access token is required.', 400));
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  let session;
  try {
    session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      const existing = await Order.findOne({ accessTokenHash: tokenHash }).select('+accessTokenHash').session(session);
      if (existing) { result = existing; return; }
      const quantities = new Map();
      for (const item of items) {
        if (!item || !mongoose.isValidObjectId(item.productId) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new AppError('Cart contains an invalid product or quantity.', 400);
        quantities.set(String(item.productId), (quantities.get(String(item.productId)) || 0) + item.quantity);
      }
      if ([...quantities.values()].some(q => q > 100)) throw new AppError('Requested quantity is too large.', 400);
      const products = await Product.find({ _id: { $in: [...quantities.keys()] } }).session(session);
      if (products.length !== quantities.size) throw new AppError('A product in your cart is no longer available.', 409);
      const lines = [];
      let subtotal = 0;
      for (const p of products) {
        const quantity = quantities.get(String(p._id));
        if (!p.isAvailable) throw new AppError(`${p.name} is currently unavailable.`, 409);
        if ((p.fulfillmentType || 'READY_TO_SHIP') === 'READY_TO_SHIP' && p.stock < quantity) throw new AppError(`Only ${p.stock} unit(s) of ${p.name} are currently available.`, 409);
        const unitPrice = priceOf(p), lineTotal = Math.round(unitPrice * quantity * 100) / 100;
        subtotal += lineTotal;
        lines.push({ productId: p._id, name: p.name, sku: p.sku || 'N/A', imageUrl: p.images?.[0]?.url || '', fulfillmentType: p.fulfillmentType || 'READY_TO_SHIP', preparationTime: p.preparationTime || '', unitPrice, quantity, lineTotal });
      }
      subtotal = Math.round(subtotal * 100) / 100;
      for (const line of lines.filter(item => item.fulfillmentType === 'READY_TO_SHIP')) {
        const p = products.find(product => String(product._id) === String(line.productId));
        const updated = await Product.findOneAndUpdate({ _id: p._id, $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }], stock: { $gte: line.quantity } }, { $inc: { stock: -line.quantity } }, { new: true, session });
        if (!updated) throw new AppError(`Stock changed for ${line.name}. Please review your cart.`, 409);
        line._stockBefore = updated.stock + line.quantity;
      }
      const year = new Date().getUTCFullYear();
      const counter = await OrderCounter.findOneAndUpdate({ _id: String(year) }, { $inc: { sequence: 1 } }, { upsert: true, new: true, session, setDefaultsOnInsert: false });
      const orderId = `CL-${year}-${String(counter.sequence).padStart(4, '0')}`;
      result = new Order({ orderId, accessTokenHash: tokenHash, customer: Object.fromEntries(Object.entries(customer).map(([k,v]) => [k, typeof v === 'string' ? v.trim() : v])), customerNotes: customerNotes.trim(), items: lines, subtotal, deliveryCharge: 0, total: subtotal, statusHistory: [{ action: 'Order placed', toStatus: 'Pending Payment', note: 'Customer placed an order' }] });
      await result.save({ session });
      const movements = lines.filter(line => line.fulfillmentType === 'READY_TO_SHIP').map(line => ({ productId: line.productId, sku: line.sku, orderId: result._id, orderNumber: orderId, reason: 'order_reserved', quantityChange: -line.quantity, stockBefore: line._stockBefore, stockAfter: line._stockBefore - line.quantity, note: 'Stock reserved for order' }));
      for (const movement of movements) await new InventoryMovement(movement).save({ session });
    });
    res.status(201).json({ success: true, order: sanitize(result), orderAccessToken: token });
  } catch (error) {
    // Keep the backend log useful without logging customer/order contents.
    console.error('Order creation failed:', { name: error.name, code: error.code, codeName: error.codeName, message: error.message });
    if (error.code === 11000) {
      const duplicate = await Order.findOne({ accessTokenHash: tokenHash }).select('+accessTokenHash');
      if (duplicate) return res.status(200).json({ success: true, order: sanitize(duplicate), orderAccessToken: token });
    }
    throw error;
  } finally { if (session) await session.endSession(); }
});

exports.trackOrder = catchAsync(async (req, res, next) => {
  const token = req.get('X-Order-Access-Token');
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return next(new AppError('Order access token is invalid.', 401));
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const order = await Order.findOne({ orderId: req.params.orderId, accessTokenHash: hash });
  if (!order) return next(new AppError('Order not found.', 404));
  res.json({ success: true, order: sanitize(order) });
});

exports.listOrders = catchAsync(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const filter = {};
  if (statuses.includes(req.query.status)) filter.status = req.query.status;
  if (['Unpaid', 'Paid', 'Refunded'].includes(req.query.paymentStatus)) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.search) { const term = String(req.query.search).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); filter.$or = [{ orderId: new RegExp(term, 'i') }, { 'customer.fullName': new RegExp(term, 'i') }, { 'customer.phone': new RegExp(term, 'i') }]; }
  const [orders, total] = await Promise.all([Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Order.countDocuments(filter)]);
  res.json({ success: true, orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
exports.orderSummary = catchAsync(async (_req, res) => {
  const [total, pendingPayment, newOrders, paid, processing, dispatched, completed, cancelled, latest] = await Promise.all([
    Order.countDocuments(), Order.countDocuments({ paymentStatus: 'Unpaid' }), Order.countDocuments({ status: 'Pending Payment' }), Order.countDocuments({ paymentStatus: 'Paid' }),
    Order.countDocuments({ status: 'Processing' }), Order.countDocuments({ status: 'Dispatched' }), Order.countDocuments({ status: 'Completed' }), Order.countDocuments({ status: 'Cancelled' }),
    Order.findOne().sort({ createdAt: -1 }).select('orderId createdAt')
  ]);
  res.json({ success: true, summary: { total, pendingPayment, newOrders, paid, processing, dispatched, completed, cancelled, latest } });
});
exports.getOrder = catchAsync(async (req, res, next) => { const o = await Order.findById(req.params.id); if (!o) return next(new AppError('Order not found.', 404)); res.json({ success: true, order: o }); });
exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status, reason = '' } = req.body || {};
  if (!statuses.includes(status)) return next(new AppError('Invalid order status.', 400));
  const session = await mongoose.startSession();
  try {
    let order;
    await session.withTransaction(async () => {
      order = await Order.findById(req.params.id).session(session);
      if (!order) throw new AppError('Order not found.', 404);
      if (!transitions[order.status].includes(status)) throw new AppError(`Cannot change ${order.status} to ${status}.`, 409);
      if (status === 'Cancelled') {
        if (!String(reason).trim() || reason.length > 500) throw new AppError('A cancellation reason is required.', 400);
        if (order.paymentStatus === 'Paid') throw new AppError('Refund the verified payment before cancelling this order.', 409);
        if (!order.stockRestoredAt) {
          for (const line of order.items.filter(item => item.fulfillmentType === 'READY_TO_SHIP')) {
            const p = await Product.findByIdAndUpdate(line.productId, { $inc: { stock: line.quantity } }, { new: true, session });
            if (!p) throw new AppError('Cannot restore stock because a product record is missing.', 409);
            await new InventoryMovement({ productId: p._id, sku: line.sku, orderId: order._id, orderNumber: order.orderId, reason: 'order_cancelled', quantityChange: line.quantity, stockBefore: p.stock - line.quantity, stockAfter: p.stock, adminId: req.admin._id, adminName: req.admin.username || '', note: String(reason).trim() }).save({ session });
          }
          order.stockRestoredAt = new Date();
        }
      }
      order.statusHistory.push({ action: 'Status updated', fromStatus: order.status, toStatus: status, note: status === 'Cancelled' ? String(reason).trim() : '', adminId: req.admin._id, adminName: req.admin.username || '' });
      order.status = status; await order.save({ session });
    });
    res.json({ success: true, order });
  } finally { await session.endSession(); }
});
exports.updatePayment = catchAsync(async (req, res, next) => {
  const { paymentStatus } = req.body || {};
  if (!['Paid', 'Refunded'].includes(paymentStatus)) return next(new AppError('Payment status must be Paid or Refunded.', 400));
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found.', 404));
  if (paymentStatus === 'Paid' && (order.paymentStatus !== 'Unpaid' || order.status === 'Cancelled')) return next(new AppError('This order cannot be marked paid.', 409));
  if (paymentStatus === 'Refunded' && order.paymentStatus !== 'Paid') return next(new AppError('Only a paid order can be refunded.', 409));
  order.paymentStatus = paymentStatus;
  if (paymentStatus === 'Paid') { order.paymentVerifiedAt = new Date(); order.paymentVerifiedBy = req.admin._id; }
  order.statusHistory.push({ action: `Payment marked ${paymentStatus}`, note: 'Updated after manual verification', adminId: req.admin._id, adminName: req.admin.username || '' });
  await order.save(); res.json({ success: true, order });
});
exports.addNote = catchAsync(async (req, res, next) => { const text = req.body?.text; if (typeof text !== 'string' || !text.trim() || text.length > 2000) return next(new AppError('Enter an internal note up to 2000 characters.', 400)); const o = await Order.findById(req.params.id); if (!o) return next(new AppError('Order not found.', 404)); o.adminNotes.push({ text: text.trim(), adminId: req.admin._id, adminName: req.admin.username || '' }); await o.save(); res.json({ success: true, order: o }); });
