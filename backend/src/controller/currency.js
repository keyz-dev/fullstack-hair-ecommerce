const Currency = require('../models/currency');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { currencyCreateSchema, currencyUpdateSchema } = require('../schema/currencySchema');

// Get all currencies
const getAllCurrencies = async (req, res, next) => {
  try {
    const currencies = await Currency.find().sort({ isBase: -1, code: 1 });
    res.status(200).json({ success: true, currencies });
  } catch (err) {
    next(err);
  }
};

// Get active currencies
const getActiveCurrencies = async (req, res, next) => {
  try {
    const currencies = await Currency.find({ isActive: true }).sort({ isBase: -1, code: 1 });
    res.status(200).json({ success: true, currencies });
  } catch (err) {
    next(err);
  }
};

// Get currency by ID
const getCurrencyById = async (req, res, next) => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      return next(new NotFoundError('Currency not found'));
    }
    res.status(200).json({ success: true, currency });
  } catch (err) {
    next(err);
  }
};

// Create new currency
const createCurrency = async (req, res, next) => {
  try {
    const { error } = currencyCreateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    // Check if currency code already exists
    const existingCurrency = await Currency.findOne({ code: req.body.code });
    if (existingCurrency) {
      return next(new BadRequestError('Currency code already exists'));
    }

    const currency = await Currency.create(req.body);
    res.status(201).json({ success: true, currency });
  } catch (err) {
    next(err);
  }
};

// Update currency
const updateCurrency = async (req, res, next) => {
  try {
    const { error } = currencyUpdateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      return next(new NotFoundError('Currency not found'));
    }

    // Check if currency code already exists (if updating code)
    if (req.body.code && req.body.code !== currency.code) {
      const existingCurrency = await Currency.findOne({ code: req.body.code });
      if (existingCurrency) {
        return next(new BadRequestError('Currency code already exists'));
      }
    }

    Object.assign(currency, req.body);
    await currency.save();
    res.status(200).json({ success: true, currency });
  } catch (err) {
    next(err);
  }
};

// Delete currency
const deleteCurrency = async (req, res, next) => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      return next(new NotFoundError('Currency not found'));
    }

    // Prevent deletion of base currency
    if (currency.isBase) {
      return next(new BadRequestError('Cannot delete base currency'));
    }

    await Currency.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Currency deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Set base currency
const setBaseCurrency = async (req, res, next) => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      return next(new NotFoundError('Currency not found'));
    }

    currency.isBase = true;
    currency.exchangeRate = 1.0;
    await currency.save();
    res.status(200).json({ success: true, currency });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCurrencies,
  getActiveCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  setBaseCurrency,
}; 