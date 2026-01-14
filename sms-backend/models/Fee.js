import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    totalFees: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    pendingAmount: {
        type: Number,
        default: 0
    },
    paymentDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

// Calculate pending amount and status before saving
feeSchema.pre('save', function (next) {
    this.pendingAmount = this.totalFees - this.paidAmount;

    if (this.paidAmount === 0) {
        this.status = 'Pending';
    } else if (this.paidAmount >= this.totalFees) {
        this.status = 'Paid';
        this.pendingAmount = 0; // Handle overpayment if necessary
    } else {
        this.status = 'Partial';
    }

    next();
});

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;
