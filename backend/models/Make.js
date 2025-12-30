const mongoose = require('mongoose');

const makeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
}, {
    timestamps: true,
});

// Pre-save hook to generate slug from name if not provided
makeSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

const Make = mongoose.model('Make', makeSchema);

module.exports = Make;
