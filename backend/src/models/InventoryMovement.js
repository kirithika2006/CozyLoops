const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  sku: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null, index: true },
  orderNumber: { type: String, default: '' },
  reason: {
    type: String,
    enum: ['order_reserved', 'order_cancelled', 'admin_adjustment', 'initial_stock'],
    required: true
  },
  quantityChange: { type: Number, required: true },
  stockBefore: { type: Number, required: true, min: 0 },
  stockAfter: { type: Number, required: true, min: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  adminName: { type: String, default: '' },
  note: { type: String, default: '', maxlength: 1000 }
}, { timestamps: true });

inventoryMovementSchema.index({ orderId: 1, productId: 1, reason: 1 }, { unique: true, partialFilterExpression: { orderId: { $type: 'objectId' } } });
inventoryMovementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
