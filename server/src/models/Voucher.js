import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema(
  {
    voucherNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    voucherDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expenseDate: {
      type: Date,
      required: [true, 'Expense date is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is mandatory'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Expense title is mandatory'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: [
        'Travel & Conveyance',
        'Meals & Entertainment',
        'Office Supplies',
        'Software & Subscriptions',
        'Hardware & Equipment',
        'Training & Certification',
        'Client Meeting',
        'Medical & Health',
        'Utilities',
        'Other',
      ],
      default: 'Other',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is mandatory'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
      default: 'Draft',
    },
    // Employee details
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    employeeSignatureKey: {
      type: String, // S3 key or local storage relative path
      default: null,
    },
    // Director / Approval details
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    directorName: {
      type: String,
      trim: true,
      default: null,
    },
    directorSignatureKey: {
      type: String, // S3 key or local storage relative path
      default: null,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying, filtering and sorting
voucherSchema.index({ employee: 1 });
voucherSchema.index({ status: 1 });
voucherSchema.index({ department: 1 });
voucherSchema.index({ category: 1 });
voucherSchema.index({ expenseDate: -1 });

export const Voucher = mongoose.model('Voucher', voucherSchema);
