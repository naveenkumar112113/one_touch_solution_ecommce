const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    image: {
        type: String,
        required: true,
    },
    images: [String],
    make: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Make',
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
    },
    compatibleModels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    description: {
        type: String,
        required: true,
    },
    specifications: {
        type: Map,
        of: String,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    zoho_item_id: {
        type: String,
        unique: true,
        sparse: true,
    },
    sku: {
        type: String,
    },
    group_id: {
        type: String,
    },
    group_name: {
        type: String,
    },
    actual_available_stock: {
        type: Number,
        default: 0,
    },
    reorder_level: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
    },
    last_zoho_modified_time: {
        type: Date,
    },
    last_synced_at: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

