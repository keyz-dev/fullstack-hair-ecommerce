const Service = require('../models/service');
const Category = require('../models/category');
const User = require('../models/user');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { convertCurrency } = require('../utils/currencyUtils');
const { formatImageUrl } = require('../utils/imageUtils');
const { cleanUpFileImages, cleanUpInstanceImages } = require('../utils/imageCleanup');

// Create a new service
exports.createService = async (req, res, next) => {
  try {
    // Validate category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new BadRequestError('Category not found'));
    }

    // Validate staff members if provided
    if (req.body.staff && req.body.staff.length > 0) {
      const staffMembers = await User.find({
        _id: { $in: req.body.staff },
        role: 'staff',
        isActive: true
      });
      
      if (staffMembers.length !== req.body.staff.length) {
        return next(new BadRequestError('Some staff members are invalid or inactive'));
      }
    }

    // Handle image upload
    let image = req.file ? req.file.path : null;

    // Prepare service data
    const serviceData = {
      ...req.body,
      image,
      // Convert tags array if it's a string
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : undefined,
      // Parse pricing if it's a JSON string
      pricing: req.body.pricing ? (typeof req.body.pricing === 'string' ? JSON.parse(req.body.pricing) : req.body.pricing) : undefined,
      // Set default currency if not provided
      currency: req.body.currency || 'XAF'
    };

    const service = await Service.create(serviceData);
    
    // Populate references for response
    await service.populate(['category', 'staff']);
    
    // Format image URL for response
    const serviceObj = service.toObject();
    serviceObj.image = formatImageUrl(service.image);
    
    res.status(201).json({ 
      success: true, 
      service: serviceObj,
      message: 'Service created successfully'
    });
  } catch (err) {
    await cleanUpFileImages(req);
    next(err);
  }
};

// Get all services with pagination, filtering, and search
exports.getAllServices = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
      requiresStaff = '',
      minPrice = '',
      maxPrice = '',
      minDuration = '',
      maxDuration = '',
      staff = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Staff requirement filter
    if (requiresStaff !== '') {
      query.requiresStaff = requiresStaff === 'true';
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }

    // Duration range filter
    if (minDuration || maxDuration) {
      query.duration = {};
      if (minDuration) query.duration.$gte = parseInt(minDuration);
      if (maxDuration) query.duration.$lte = parseInt(maxDuration);
    }

    // Staff filter
    if (staff) {
      query.staff = staff;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [services, total] = await Promise.all([
      Service.find(query)
        .populate(['category', 'staff'])
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Service.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    // Format image URLs for response
    const formattedServices = services.map(service => {
      const serviceObj = service.toObject();
      serviceObj.image = formatImageUrl(service.image);
      return serviceObj;
    });

    res.json({
      success: true,
      services: formattedServices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get active services for public display
exports.getActiveServices = async (req, res, next) => {
  try {
    const { category = '', currency = 'XAF' } = req.query;

    const query = { status: 'active' };

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query)
      .populate(['category', 'staff'])
      .sort({ createdAt: -1 });

    // Add price in requested currency and format image URLs
    const servicesWithPricing = services.map(service => {
      const serviceObj = service.toObject();
      serviceObj.price = service.getPrice(currency);
      serviceObj.currency = currency;
      serviceObj.image = formatImageUrl(service.image);
      return serviceObj;
    });

    res.json({
      success: true,
      services: servicesWithPricing
    });
  } catch (err) {
    next(err);
  }
};

// Get a single service
exports.getService = async (req, res, next) => {
  try {
    const { currency = 'XAF' } = req.query;
    
    const service = await Service.findById(req.params.id)
      .populate(['category', 'staff']);
      
    if (!service) {
      return next(new NotFoundError('Service not found'));
    }

    // Add price in requested currency and format image URL
    const serviceObj = service.toObject();
    serviceObj.price = service.getPrice(currency);
    serviceObj.currency = currency;
    serviceObj.image = formatImageUrl(service.image);

    res.json({ 
      success: true, 
      service: serviceObj 
    });
  } catch (err) {
    next(err);
  }
};

// Update a service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new NotFoundError('Service not found'));
    }

    // Validate category if being updated
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return next(new BadRequestError('Category not found'));
      }
    }

    // Validate staff members if being updated
    if (req.body.staff && req.body.staff.length > 0) {
      const staffMembers = await User.find({
        _id: { $in: req.body.staff },
        role: 'staff',
        isActive: true
      });
      
      if (staffMembers.length !== req.body.staff.length) {
        return next(new BadRequestError('Some staff members are invalid or inactive'));
      }
    }

    // Handle image upload
    if (req.file) {
      service.image = req.file.path;
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'image') { // image is handled separately
        service[key] = req.body[key];
      }
    });

    await service.save();
    await service.populate(['category', 'staff']);

    // Format image URL for response
    const serviceObj = service.toObject();
    serviceObj.image = formatImageUrl(service.image);

    res.json({ 
      success: true, 
      service: serviceObj,
      message: 'Service updated successfully'
    });
  } catch (err) {
    await cleanUpFileImages(req);
    next(err);
  }
};

// Delete a service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new NotFoundError('Service not found'));
    }

    // Clean up image files
    await cleanUpInstanceImages(service);
    
    await Service.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Service deleted successfully' 
    });
  } catch (err) {
    next(err);
  }
};

// Get service statistics
exports.getServiceStats = async (req, res, next) => {
  try {
    const [
      totalServices,
      activeServices,
      draftServices,
      inactiveServices,
      servicesWithStaff,
      servicesWithoutStaff,
      categoryStats
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ status: 'active' }),
      Service.countDocuments({ status: 'draft' }),
      Service.countDocuments({ status: 'inactive' }),
      Service.countDocuments({ staff: { $exists: true, $ne: [] } }),
      Service.countDocuments({ staff: { $exists: true, $size: 0 } }),
      Service.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo'
          }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            categoryName: { $first: '$categoryInfo.name' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        total: totalServices,
        active: activeServices,
        draft: draftServices,
        inactive: inactiveServices,
        withStaff: servicesWithStaff,
        withoutStaff: servicesWithoutStaff,
        byCategory: categoryStats
      }
    });
  } catch (err) {
    next(err);
  }
};

// Assign staff to service
exports.assignStaff = async (req, res, next) => {
  try {
    const { staffIds } = req.body;
    
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new NotFoundError('Service not found'));
    }

    // Validate staff members
    if (staffIds && staffIds.length > 0) {
      const staffMembers = await User.find({
        _id: { $in: staffIds },
        role: 'staff',
        isActive: true
      });
      
      if (staffMembers.length !== staffIds.length) {
        return next(new BadRequestError('Some staff members are invalid or inactive'));
      }
    }

    // Assign staff
    service.staff = staffIds || [];
    await service.save();

    // Populate staff for response
    await service.populate('staff');

    res.json({
      success: true,
      service,
      message: 'Staff assigned successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Activate service
exports.activateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new NotFoundError('Service not found'));
    }

    await service.activate();
    await service.populate(['category', 'staff']);

    res.json({
      success: true,
      service,
      message: 'Service activated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Deactivate service
exports.deactivateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new NotFoundError('Service not found'));
    }

    await service.deactivate();
    await service.populate(['category', 'staff']);

    res.json({
      success: true,
      service,
      message: 'Service deactivated successfully'
    });
  } catch (err) {
    next(err);
  }
}; 