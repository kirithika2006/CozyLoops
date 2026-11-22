const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  fulfillmentType: { type: String, enum: ['READY_TO_SHIP', 'MADE_TO_ORDER'], default: 'READY_TO_SHIP' },
  preparationTime: { type: String, default: '' },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderHistorySchema = new mongoose.Schema({
  action: { type: String, required: true },
  fromStatus: { type: String, default: null },
  toStatus: { type: String, default: null },
  note: { type: String, default: '' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  adminName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const adminNoteSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 2000 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  adminName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  accessTokenHash: { type: String, required: true, unique: true, select: false },
  customer: {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 100 },
    pinCode: { type: String, required: true, trim: true, maxlength: 12 }
  },
  items: { type: [orderItemSchema], required: true, validate: value => value.length > 0 },
  customerNotes: { type: String, default: '', maxlength: 2000 },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryCharge: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Pending Payment', 'Confirmed', 'Processing', 'Ready for Dispatch', 'Dispatched', 'Completed', 'Cancelled'],
    default: 'Pending Payment',
    index: true
  },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid', index: true },
  paymentVerifiedAt: { type: Date, default: null },
  paymentVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  stockRestoredAt: { type: Date, default: null },
  statusHistory: { type: [orderHistorySchema], default: [] },
  adminNotes: { type: [adminNoteSchema], default: [] }
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.email': 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
