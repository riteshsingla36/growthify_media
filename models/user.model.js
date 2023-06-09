const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    userId: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    phoneNo: {
      type: Number,
      max: 9999999999,
      trim: true
    },
    userType: {
      type: String,
      trim: true,
      enum: ['Employee', 'Client'],
      required: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ['ACTIVE', 'INACTIVE'],
    },
    role: {
      type: String,
      trim: true,
    },
    projects: [{
      type: String,
      trim: true,
    }],
    billingAddress: {
      type: String,
      trim: true,
    },
    GSTIN: {
      type: String,
      trim: true,
    },
    billingPhoneNo: {
      type: String,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
    },
    stateCode: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    slackChannelName: {
      type: String,
      trim: true
    },
    slackUserId: {
      type: String,
      trim: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = User;
