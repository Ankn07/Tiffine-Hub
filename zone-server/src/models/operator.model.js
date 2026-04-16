const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    business_type: {
      type: String,
      required: true,
      trim: true,
    },
    upi_id: {
      type: String,
      trim: true,
      default: null,
    },
    zone_id: {
      type: String,
      default: null,
    },
    authorized_person_id: {
      type: String,
      default: null,
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

operatorSchema.index({ name: 1, email: 1 });

module.exports = mongoose.model("Operator", operatorSchema);
