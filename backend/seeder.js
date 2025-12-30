const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Make = require('./models/Make');
const Model = require('./models/Model');
const connectDB = require('./config/db');

dotenv.config();

connectDB().then(() => {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await Model.deleteMany();
        await Make.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        // Create Users
        const createdUsers = [];
        for (const user of users) {
            const newUser = await User.create(user);
            createdUsers.push(newUser);
        }
        const adminUser = createdUsers[0]._id;

        // Create Categories
        const categories = await Category.insertMany([
            { name: 'Screens', description: 'Displays for mobiles and laptops', slug: 'screens' },
            { name: 'Batteries', description: 'High capacity batteries', slug: 'batteries' },
            { name: 'Keyboards', description: 'Laptop keyboards', slug: 'keyboards' },
            { name: 'Accessories', description: 'Cables, chargers, stands, etc', slug: 'accessories' }
        ]);

        const categoryMap = {};
        categories.forEach(cat => { categoryMap[cat.name] = cat; });

        // Create Makes
        const makes = await Make.insertMany([
            {
                name: 'Apple',
                slug: 'apple',
                description: 'American multinational technology company',
                logo: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=200',
                categories: [categoryMap['Screens']._id, categoryMap['Batteries']._id, categoryMap['Keyboards']._id, categoryMap['Accessories']._id]
            },
            {
                name: 'Samsung',
                slug: 'samsung',
                description: 'South Korean multinational conglomerate',
                logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200',
                categories: [categoryMap['Screens']._id, categoryMap['Batteries']._id, categoryMap['Accessories']._id]
            },
            {
                name: 'Dell',
                slug: 'dell',
                description: 'American multinational computer technology company',
                logo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200',
                categories: [categoryMap['Batteries']._id, categoryMap['Accessories']._id]
            },
            {
                name: 'One Touch',
                slug: 'one-touch',
                description: 'One Touch Solution - Quality parts and accessories',
                logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
                categories: [categoryMap['Accessories']._id]
            }
        ]);

        const makeMap = {};
        makes.forEach(make => { makeMap[make.name] = make; });

        // Create Models
        const models = await Model.insertMany([
            // Apple Models
            { name: 'iPhone 13 Pro', slug: 'iphone-13-pro', make: makeMap['Apple']._id, category: categoryMap['Screens']._id, releaseYear: 2021 },
            { name: 'iPhone 13', slug: 'iphone-13', make: makeMap['Apple']._id, category: categoryMap['Screens']._id, releaseYear: 2021 },
            { name: 'iPhone 12', slug: 'iphone-12', make: makeMap['Apple']._id, category: categoryMap['Screens']._id, releaseYear: 2020 },
            { name: 'MacBook Air M1', slug: 'macbook-air-m1', make: makeMap['Apple']._id, category: categoryMap['Batteries']._id, releaseYear: 2020 },
            { name: 'MacBook Pro M1', slug: 'macbook-pro-m1', make: makeMap['Apple']._id, category: categoryMap['Batteries']._id, releaseYear: 2020 },
            { name: 'iPad Pro 11-inch', slug: 'ipad-pro-11-inch', make: makeMap['Apple']._id, category: categoryMap['Keyboards']._id, releaseYear: 2021 },
            // Samsung Models
            { name: 'Galaxy S21 Ultra', slug: 'galaxy-s21-ultra', make: makeMap['Samsung']._id, category: categoryMap['Screens']._id, releaseYear: 2021 },
            { name: 'Galaxy S21', slug: 'galaxy-s21', make: makeMap['Samsung']._id, category: categoryMap['Screens']._id, releaseYear: 2021 },
            { name: 'Galaxy Note 20', slug: 'galaxy-note-20', make: makeMap['Samsung']._id, category: categoryMap['Screens']._id, releaseYear: 2020 },
            // Dell Models
            { name: 'XPS 13', slug: 'xps-13', make: makeMap['Dell']._id, category: categoryMap['Accessories']._id, releaseYear: 2021 },
            { name: 'XPS 15', slug: 'xps-15', make: makeMap['Dell']._id, category: categoryMap['Accessories']._id, releaseYear: 2021 },
        ]);

        const modelMap = {};
        models.forEach(model => { modelMap[model.name] = model; });

        // Create Products
        const products = await Product.insertMany([
            {
                name: 'iPhone 13 Pro Screen Replacement',
                slug: 'iphone-13-pro-screen-replacement',
                image: 'https://images.unsplash.com/photo-1621330396173-e41b1afd85cf?w=500',
                images: ['https://images.unsplash.com/photo-1621330396173-e41b1afd85cf?w=500'],
                description: 'High-quality OLED screen replacement for iPhone 13 Pro. Supports True Tone (requires programmer).',
                make: makeMap['Apple']._id,
                model: modelMap['iPhone 13 Pro']._id,
                compatibleModels: [modelMap['iPhone 13 Pro']._id],
                category: categoryMap['Screens']._id,
                price: 12500,
                countInStock: 10,
                rating: 4.5,
                numReviews: 12,
                user: adminUser,
                specifications: new Map([
                    ['Type', 'OLED'],
                    ['Size', '6.1 inches'],
                    ['Resolution', '2532 x 1170'],
                    ['Warranty', '6 months']
                ])
            },
            {
                name: 'MacBook Air M1 Battery (A2389)',
                slug: 'macbook-air-m1-battery-a2389',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500',
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500'],
                description: 'Original capacity replacement battery for MacBook Air M1 2020 Model.',
                make: makeMap['Apple']._id,
                model: modelMap['MacBook Air M1']._id,
                compatibleModels: [modelMap['MacBook Air M1']._id],
                category: categoryMap['Batteries']._id,
                price: 8500,
                countInStock: 7,
                rating: 4.0,
                numReviews: 8,
                user: adminUser,
                specifications: new Map([
                    ['Capacity', '49.9Wh'],
                    ['Part Number', 'A2389'],
                    ['Warranty', '1 year']
                ])
            },
            {
                name: 'Samsung Galaxy S21 Ultra Display',
                slug: 'samsung-galaxy-s21-ultra-display',
                image: 'https://images.unsplash.com/photo-1610945265078-4389958742cb?w=500',
                images: ['https://images.unsplash.com/photo-1610945265078-4389958742cb?w=500'],
                description: 'Original Service Pack Display for Samsung S21 Ultra with Frame.',
                make: makeMap['Samsung']._id,
                model: modelMap['Galaxy S21 Ultra']._id,
                compatibleModels: [modelMap['Galaxy S21 Ultra']._id],
                category: categoryMap['Screens']._id,
                price: 18500,
                countInStock: 5,
                rating: 3,
                numReviews: 12,
                user: adminUser,
                specifications: new Map([
                    ['Type', 'Dynamic AMOLED 2X'],
                    ['Size', '6.8 inches'],
                    ['Resolution', '3200 x 1440'],
                    ['Refresh Rate', '120Hz']
                ])
            },
            {
                name: 'Dell XPS 13 Charger (45W)',
                slug: 'dell-xps-13-charger-45w',
                image: 'https://images.unsplash.com/photo-1588872657578-137a6222b618?w=500',
                images: ['https://images.unsplash.com/photo-1588872657578-137a6222b618?w=500'],
                description: 'Original Dell XPS 13 Type-C Adapter 45W.',
                make: makeMap['Dell']._id,
                model: modelMap['XPS 13']._id,
                compatibleModels: [modelMap['XPS 13']._id, modelMap['XPS 15']._id],
                category: categoryMap['Accessories']._id,
                price: 2500,
                countInStock: 15,
                rating: 5,
                numReviews: 10,
                user: adminUser,
                specifications: new Map([
                    ['Power', '45W'],
                    ['Connector', 'USB Type-C'],
                    ['Cable Length', '1.8m']
                ])
            },
            {
                name: 'iPad Pro Magic Keyboard (11-inch)',
                slug: 'ipad-pro-magic-keyboard-11-inch',
                image: 'https://images.unsplash.com/photo-1587033411391-5d9e659ce25f?w=500',
                images: ['https://images.unsplash.com/photo-1587033411391-5d9e659ce25f?w=500'],
                description: 'The Magic Keyboard is an amazing companion for iPad Pro and iPad Air.',
                make: makeMap['Apple']._id,
                model: modelMap['iPad Pro 11-inch']._id,
                compatibleModels: [modelMap['iPad Pro 11-inch']._id],
                category: categoryMap['Keyboards']._id,
                price: 22000,
                countInStock: 3,
                rating: 4.8,
                numReviews: 5,
                user: adminUser,
                specifications: new Map([
                    ['Compatibility', 'iPad Pro 11-inch'],
                    ['Features', 'Backlit keys, trackpad'],
                    ['Color', 'Black']
                ])
            },
            {
                name: 'Universal Laptop Stand',
                slug: 'universal-laptop-stand',
                image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
                images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500'],
                description: 'Ergonomic aluminium laptop stand compatible with all laptops.',
                make: makeMap['One Touch']._id,
                model: null,
                compatibleModels: [],
                category: categoryMap['Accessories']._id,
                price: 1500,
                countInStock: 50,
                rating: 4.2,
                numReviews: 25,
                user: adminUser,
                specifications: new Map([
                    ['Material', 'Aluminum Alloy'],
                    ['Adjustable', 'Yes'],
                    ['Max Load', '10kg']
                ])
            }
        ]);

        console.log('✅ Data Imported!');
        console.log(`Created ${createdUsers.length} users`);
        console.log(`Created ${categories.length} categories`);
        console.log(`Created ${makes.length} makes`);
        console.log(`Created ${models.length} models`);
        console.log(`Created ${products.length} products`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await Model.deleteMany();
        await Make.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};
