// import
const express = require('express');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { productCreateSchema, productUpdateSchema } = require('../schema/productSchema');
const productController = require('../controller/product');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getSingleProduct);
router.post('/', authenticateUser, authorizeRoles(['admin', 'staff']), upload.array('productImages', 10), handleCloudinaryUpload, formatFilePaths, validate(productCreateSchema), productController.createProduct);
router.put('/:id', authenticateUser, authorizeRoles(['admin', 'staff']), upload.array('productImages', 10), handleCloudinaryUpload, formatFilePaths, validate(productUpdateSchema), productController.updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles(['admin', 'staff']), productController.deleteProduct);

module.exports = router;