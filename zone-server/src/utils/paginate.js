/**
 * Generic pagination helper for Mongoose models
 * @param {Model} Model - Mongoose model
 * @param {Object} filter - MongoDB filter query
 * @param {Object} options - { page, limit, sort, select, populate }
 */
const paginate = async (Model, filter = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 10));
  const skip = (page - 1) * limit;
  const sort = options.sort || { created_at: -1 };

  let query = Model.find(filter).sort(sort).skip(skip).limit(limit);

  if (options.select) query = query.select(options.select);
  if (options.populate) query = query.populate(options.populate);

  const [data, total] = await Promise.all([query.lean(), Model.countDocuments(filter)]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

module.exports = { paginate };
