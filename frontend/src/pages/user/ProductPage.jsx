import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaSort } from 'react-icons/fa';
import API from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';

const ProductPage = () => {
    const { categorySlug, makeSlug, modelSlug } = useParams();
    const [searchParams] = useSearchParams();
    const searchFilter = searchParams.get('search');

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [make, setMake] = useState(null);
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [inStockOnly, setInStockOnly] = useState(false);

    // Determine navigation mode
    const isCategoryMode = !!categorySlug;
    const isHierarchical = !!(makeSlug && modelSlug);

    useEffect(() => {
        fetchData();
    }, [categorySlug, makeSlug, modelSlug, searchFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let queryParams = {};

            if (searchFilter) {
                // Search mode
                const { data } = await API.get(`/products?search=${searchFilter}`);
                setProducts(data);
            } else if (isHierarchical) {
                // Hierarchical mode
                if (isCategoryMode) {
                    queryParams = { categorySlug, makeSlug, modelSlug };
                } else {
                    queryParams = { makeSlug, modelSlug };
                }

                const { data } = await API.get('/products', { params: queryParams });
                setProducts(data);

                // Fetch metadata
                if (categorySlug) {
                    const { data: categories } = await API.get('/categories');
                    setCategory(categories.find(c => c.slug === categorySlug));
                }
                if (makeSlug) {
                    const { data: makeData } = await API.get(`/makes/${makeSlug}`);
                    setMake(makeData);
                }
                if (modelSlug && makeSlug) {
                    const { data: modelData } = await API.get(`/models/${makeSlug}/${modelSlug}`);
                    setModel(modelData);
                }
            } else {
                // All products
                const { data } = await API.get('/products');
                setProducts(data);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(p => !inStockOnly || p.countInStock > 0)
        .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'popularity':
                    return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    // Build breadcrumb
    const buildBreadcrumb = () => {
        const items = [];

        if (searchFilter) {
            items.push({ label: `Search: "${searchFilter}"` });
        } else if (isHierarchical) {
            if (isCategoryMode && category) {
                items.push({ label: 'Categories', link: '/categories' });
                items.push({ label: category.name, link: `/category/${category.slug}` });
                items.push({ label: 'Makes', link: `/category/${categorySlug}/makes` });
            } else {
                items.push({ label: 'Makes', link: '/makes' });
            }

            if (make) {
                items.push({
                    label: make.name,
                    link: isCategoryMode
                        ? `/category/${categorySlug}/make/${makeSlug}/models`
                        : `/make/${makeSlug}/models`
                });
            }

            if (model) {
                items.push({ label: model.name });
            }

            items.push({ label: 'Products' });
        } else {
            items.push({ label: 'All Products' });
        }

        return items;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading Products...</div>;
    }

    return (
        <div className="py-8">
            <Breadcrumb items={buildBreadcrumb()} />

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                    {searchFilter
                        ? `Search Results for "${searchFilter}"`
                        : model
                            ? `${model.name} Products`
                            : make
                                ? `${make.name} Products`
                                : 'All Products'
                    }
                </h1>
                <p className="text-gray-600">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <FaFilter className="mr-2" />
                            Filters
                        </h3>

                        {/* Sort */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaSort className="inline mr-1" />
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popularity">Most Popular</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                                    placeholder="Min"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mb-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="mr-2 rounded text-brand focus:ring-brand"
                                />
                                <span className="text-sm text-gray-700">In Stock Only</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">No products found</p>
                            <Link to="/products" className="text-brand hover:underline">
                                View All Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/product/${product.slug}`}
                                        className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-brand group"
                                    >
                                        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            {product.make && (
                                                <span className="text-xs text-brand font-semibold uppercase tracking-wider">
                                                    {typeof product.make === 'object' ? product.make.name : product.make}
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-slate-800 mt-1 mb-2 line-clamp-2 group-hover:text-brand transition">
                                                {product.name}
                                            </h3>
                                            {product.compatibleModels && product.compatibleModels.length > 0 && (
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Compatible with {product.compatibleModels.length} model{product.compatibleModels.length > 1 ? 's' : ''}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-slate-800">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                                <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
