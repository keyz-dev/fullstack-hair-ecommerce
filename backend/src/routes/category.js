const express = require('express');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { categoryCreateSchema, categoryUpdateSchema } = require('../schema/categorySchema');
const categoryController = require('../controller/category');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.readSingleCategory);
router.post('/', authenticateUser, authorizeRoles(['admin']), upload.single('categoryImage'), handleCloudinaryUpload, formatFilePaths, validate(categoryCreateSchema), categoryController.addCategory);
router.put('/:id', authenticateUser, authorizeRoles(['admin']), upload.single('categoryImage'), handleCloudinaryUpload, formatFilePaths, validate(categoryUpdateSchema), categoryController.updateCategory);
router.delete('/:id', authenticateUser, authorizeRoles(['admin']), categoryController.deleteCategory);

module.exports = router;