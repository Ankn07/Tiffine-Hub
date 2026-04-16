/**
 * Serverless Cleanup Utility
 * Permanently deletes records soft-deleted more than 3 days ago.
 * Called by the Vercel Cron endpoint POST /api/cron/cleanup
 */

const mongoose = require("mongoose");

const MODELS_WITH_SOFT_DELETE = [
  "Operator",
  "AuthorizedPerson",
  "Zone",
  "StoreCategory",
  "Store",
  "StoreUser",
  "ProductCategory",
  "Product",
  "ProductVariant",
  "Coupon",
  "Review",
  "Order",
];

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const runCleanup = async () => {
  const cutoff = new Date(Date.now() - THREE_DAYS_MS);
  const results = {};

  for (const modelName of MODELS_WITH_SOFT_DELETE) {
    try {
      const Model = mongoose.model(modelName);
      const res = await Model.deleteMany({
        is_deleted: true,
        deleted_at: { $lt: cutoff },
      });
      results[modelName] = res.deletedCount;
    } catch {
      results[modelName] = "error";
    }
  }

  return results;
};

module.exports = { runCleanup };
