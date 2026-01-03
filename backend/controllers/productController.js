const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Make = require('../models/Make');
const Model = require('../models/Model');
const generateSlug = require('../utils/generateSlug');

// @desc    Fetch all products with optional hierarchical filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const { category, make, model, categorySlug, makeSlug, modelSlug } = req.query;

    let query = {};

    // Handle slug-based filtering
    if (categorySlug) {
        const cat = await Category.findOne({ slug: categorySlug });
        if (cat) query.category = cat._id;
    } else if (category) {
        query.category = category;
    }

    if (makeSlug) {
        const mk = await Make.findOne({ slug: makeSlug });
        if (mk) query.make = mk._id;
    } else if (make) {
        query.make = make;
    }

    if (modelSlug && makeSlug) {
        const mk = await Make.findOne({ slug: makeSlug });
        if (mk) {
            const mdl = await Model.findOne({ slug: modelSlug, make: mk._id });
            if (mdl) {
                query.$or = [
                    { model: mdl._id },
                    { compatibleModels: mdl._id }
                ];
            }
        }
    } else if (model) {
        query.$or = [
            { model: model },
            { compatibleModels: model }
        ];
    }

    const products = await Product.find(query)
        .populate('make', 'name slug logo')
        .populate('model', 'name slug')
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('compatibleModels', 'name slug');

    res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('make', 'name slug logo description')
        .populate('model', 'name slug description image releaseYear')
        .populate('category', 'name slug description')
        .populate('subcategory', 'name slug description')
        .populate('compatibleModels', 'name slug make')
        .populate({
            path: 'compatibleModels',
            populate: {
                path: 'make',
                select: 'name slug'
            }
        });

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate('make', 'name slug logo description')
        .populate('model', 'name slug description image releaseYear')
        .populate('category', 'name slug description')
        .populate('subcategory', 'name slug description')
        .populate('compatibleModels', 'name slug make')
        .populate({
            path: 'compatibleModels',
            populate: {
                path: 'make',
                select: 'name slug'
            }
        });

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, image, images, make, model, compatibleModels, category, subcategory, countInStock, description, specifications } = req.body;

    // Validate make exists
    const makeExists = await Make.findById(make);
    if (!makeExists) {
        res.status(400);
        throw new Error('Make not found');
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(400);
        throw new Error('Category not found');
    }

    // Validate model if provided
    if (model) {
        const modelExists = await Model.findById(model);
        if (!modelExists) {
            res.status(400);
            throw new Error('Model not found');
        }
        if (modelExists.make.toString() !== make) {
            res.status(400);
            throw new Error('Model does not belong to the selected make');
        }
    }

    // Validate subcategory exists and belongs to category
    if (subcategory) {
        const subcategoryExists = await Category.findById(subcategory);
        if (!subcategoryExists) {
            res.status(400);
            throw new Error('Subcategory not found');
        }
        if (subcategoryExists.parent && subcategoryExists.parent.toString() !== category) {
            res.status(400);
            throw new Error('Subcategory does not belong to the selected category');
        }
    }

    // Generate slug if not provided
    var slug = await generateSlug(name, Product);

    const product = await Product.create({
        name,
        price,
        user: req.user._id,
        image,
        images: images || [],
        make,
        model: model || null,
        compatibleModels: compatibleModels || [],
        category,
        subcategory: subcategory || null,
        countInStock,
        description,
        specifications: specifications || {},
        slug: slug || undefined, // Will be generated by pre-save hook if not provided
    });

    const createdProduct = await product.populate(['make', 'model', 'category', 'subcategory', 'compatibleModels']);
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, image, images, make, model, compatibleModels, category, subcategory, countInStock, description, specifications } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Validate make if provided
        if (make) {
            const makeExists = await Make.findById(make);
            if (!makeExists) {
                res.status(400);
                throw new Error('Make not found');
            }
        }

        // Validate category if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                res.status(400);
                throw new Error('Category not found');
            }
        }

        // Validate model if provided
        if (model) {
            const modelExists = await Model.findById(model);
            if (!modelExists) {
                res.status(400);
                throw new Error('Model not found');
            }
            const makeId = make || product.make.toString();
            if (modelExists.make.toString() !== makeId) {
                res.status(400);
                throw new Error('Model does not belong to the selected make');
            }
        }

        // Validate subcategory if provided
        if (subcategory) {
            const subcategoryExists = await Category.findById(subcategory);
            if (!subcategoryExists) {
                res.status(400);
                throw new Error('Subcategory not found');
            }
            const categoryId = category || product.category.toString();
            if (subcategoryExists.parent && subcategoryExists.parent.toString() !== categoryId) {
                res.status(400);
                throw new Error('Subcategory does not belong to the selected category');
            }
        }

        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.image = image || product.image;
        product.images = images !== undefined ? images : product.images;
        product.make = make || product.make;
        product.model = model !== undefined ? model : product.model;
        product.compatibleModels = compatibleModels !== undefined ? compatibleModels : product.compatibleModels;
        product.category = category || product.category;
        product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.description = description || product.description;
        product.specifications = specifications !== undefined ? specifications : product.specifications;

        // Regenerate slug if name changed
        if (name && name !== product.name) {
            product.slug = undefined; // Will be regenerated by pre-save hook
        }

        const updatedProduct = await product.save();
        await updatedProduct.populate(['make', 'model', 'category', 'subcategory', 'compatibleModels']);
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
};
