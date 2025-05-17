const { Schema, model } = require('mongoose');

const PurchaseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    itemPrice: {
        type: Number,
        required: true,
        min: 0
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
}, { timestamps: true });

PurchaseSchema.index({ user: 1, program: 1 }, { unique: true });

const Purchase = model('Purchase', PurchaseSchema);
module.exports = Purchase;