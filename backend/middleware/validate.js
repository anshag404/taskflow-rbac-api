const ApiError = require('../utils/ApiError');

/**
 * Zod Validation Middleware
 * Validates request body against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors,
        });
      }

      // Replace body with parsed/sanitized data
      req.body = result.data;
      next();
    } catch (error) {
      next(ApiError.internal('Validation error'));
    }
  };
};

module.exports = validate;
