const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: true,
      trim: true,
    },
    zone_name: {
      type: String,
      required: true,
      trim: true,
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
    operator_id: {
      type: String,
      required: true,
      default: null,
    },
    zone: [
      {
        post_office: {
          type: String,
          required: true,
          trim: true,
        },
        pin_code: {
          type: Number,
          required: true,
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

module.exports = mongoose.model("Zone", zoneSchema);
