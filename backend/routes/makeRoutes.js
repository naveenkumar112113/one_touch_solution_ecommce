const express = require('express');
const router = express.Router();
const {
    getMakes,
    getMakeBySlug,
    getMakesByCategory,
    createMake,
    updateMake,
    deleteMake,
} = require('../controllers/makeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMakes)
    .post(protect, admin, createMake);

router.route('/category/:categoryId')
    .get(getMakesByCategory);

router.route('/:slug')
    .get(getMakeBySlug);

router.route('/id/:id')
    .put(protect, admin, updateMake)
    .delete(protect, admin, deleteMake);

module.exports = router;
