const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    store_url: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
      index: true,
    },
    pin_code: {
      type: Number,
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    category_id: {
      type: String,
      required: true,
    },
    upi_id: {
      type: String,
      trim: true,
      default: null,
    },
    gstin: {
      type: String,
      trim: true,
      default: null,
    },
    is_doordrop: {
      type: Boolean,
      default: false,
    },
    is_refund: {
      type: Boolean,
      default: false,
    },
    logo_url: {
      type: String,
      default: null,
    },
    banner_url: {
      type: String,
      default: null,
    },
    working_hours: [
      {
        day: {
          type: String,
          required: true,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          trim: true,
        },
        open_time: {
          type: String,
          required: true,
          trim: true,
        },
        close_time: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
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

module.exports = mongoose.model("Store", storeSchema);
