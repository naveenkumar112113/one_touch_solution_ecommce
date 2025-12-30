import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: productsData } = await API.get('/products');
                const { data: categoriesData } = await API.get('/categories');

                // For "featured", just taking the first 8 products for now
                setFeaturedProducts(productsData.slice(0, 8));

                // Use backend categories or fallback if empty
                if (categoriesData && categoriesData.length > 0) {
                    setCategories(categoriesData);
                } else {
                    // Fallback mock categories if DB is empty for some reason
                    setCategories([
                        { name: 'Screens' }, { name: 'Batteries' }, { name: 'Keyboards' }, { name: 'Accessories' }
                    ]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative h-[500px] bg-primary rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
                {/* Placeholder for Hero Image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>

                <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-20 text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
                    >
                        Premium Parts.<br />
                        <span className="text-brand-light">Perfect Fit.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl mb-8 max-w-xl text-gray-200"
                    >
                        The ultimate destination for mobile and laptop spare parts. Authenticity guaranteed.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/products" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-brand/50">
                            Shop Now
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Categories - Mock */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">Popular Categories</h2>
                    <Link to="/categories" className="text-brand font-semibold hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Screens', 'Batteries', 'Keyboards', 'Accessories'].map((cat, index) => (
                        <Link to={`/products?category=${cat}`} key={cat}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer text-center group h-full"
                            >
                                <div className="h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 group-hover:bg-brand-light/10 transition">
                                    {/* Icon placeholder */}
                                    <span className="text-4xl">📱</span>
                                </div>
                                <h3 className="font-semibold text-lg text-slate-700 group-hover:text-brand transition">{cat}</h3>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section>
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Trending Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {featuredProducts.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 group">
                            <Link to={`/product/${item.slug}`}>
                                <div className="h-48 bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-2">
                                        <button className="bg-white text-slate-900 p-2 rounded-full hover:bg-brand hover:text-white transition">
                                            View
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 truncate text-slate-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{item.make && (typeof item.make === 'object' ? item.make.name : item.make)}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-brand">₹{item.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
