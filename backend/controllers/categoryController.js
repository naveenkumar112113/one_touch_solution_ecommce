const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).populate('subcategories');
    res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('subcategories');

    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Get subcategories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
const getSubcategories = asyncHandler(async (req, res) => {
    const subcategories = await Category.find({ parent: req.params.id });
    res.json(subcategories);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image, parent, isActive } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    // If parent is provided, verify it exists
    if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
            res.status(400);
            throw new Error('Parent category not found');
        }
    }

    const category = await Category.create({
        name,
        description,
        image,
        parent: parent || null,
        isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, description, image, isActive, parent } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        // Check if new name conflicts with existing category (excluding current)
        if (name && name !== category.name) {
            const nameExists = await Category.findOne({ name });
            if (nameExists) {
                res.status(400);
                throw new Error('Category name already exists');
            }
        }

        // Prevent setting parent to self or creating circular reference
        if (parent && parent === req.params.id) {
            res.status(400);
            throw new Error('Category cannot be its own parent');
        }

        category.name = name || category.name;
        category.description = description !== undefined ? description : category.description;
        category.image = image !== undefined ? image : category.image;
        category.isActive = isActive !== undefined ? isActive : category.isActive;
        category.parent = parent !== undefined ? parent : category.parent;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // Check if category has subcategories
        const subcategories = await Category.find({ parent: req.params.id });
        if (subcategories.length > 0) {
            res.status(400);
            throw new Error('Cannot delete category with subcategories. Delete subcategories first.');
        }

        // Check if category has products
        const products = await Product.find({ category: req.params.id });
        if (products.length > 0) {
            res.status(400);
            throw new Error('Cannot delete category with associated products. Remove or reassign products first.');
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

module.exports = {
    getCategories,
    getCategoryById,
    getSubcategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
