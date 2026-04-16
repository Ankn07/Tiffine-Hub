const mongoose = require("mongoose");

const authorizedPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    operator_id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["MANAGER", "STAFF", "SUPPORT", "DELIVERY"],
      required: true,
    },
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otp_expires_at: {
      type: Date,
      default: null,
      select: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    created_by: {
      type: String,
      default: null,
    },
    updated_by: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("AuthorizedPerson", authorizedPersonSchema);
