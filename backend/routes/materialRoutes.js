const express = require('express');
const { createMaterial, getMaterials, deleteMaterial } = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMaterials)
  .post(authorize('admin', 'staff'), createMaterial);

router.route('/:id')
  .delete(authorize('admin', 'staff'), deleteMaterial);

module.exports = router;
