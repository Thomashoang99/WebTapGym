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
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    }
}, { timestamps: true });

PurchaseSchema.index({ user: 1, program: 1 }, { unique: true });

const Purchase = model('Purchase', PurchaseSchema);
module.exports = Purchase;