import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../services/api';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await API.get('/categories');
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    // Fallback mock categories
                    setCategories([
                        { name: 'Screens' }, { name: 'Batteries' }, { name: 'Keyboards' }, { name: 'Accessories' },
                        { name: 'Chargers' }, { name: 'Cases' }, { name: 'Tools' }, { name: 'Protectors' }
                    ]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Fallback on error too
                setCategories([
                    { name: 'Screens' }, { name: 'Batteries' }, { name: 'Keyboards' }, { name: 'Accessories' }
                ]);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-[50vh]">Loading Categories...</div>;
    }

    return (
        <div className="py-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2 text-center">All Categories</h1>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Explore our wide range of premium spare parts and accessories for all your devices.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {categories.map((cat, index) => (
                    <Link to={`/products?category=${cat.name || cat}`} key={index}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-8 rounded-xl shadow-md border border-gray-100 cursor-pointer text-center group h-full flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300"
                        >
                            <div className="h-24 w-24 bg-gray-50 rounded-full mb-6 flex items-center justify-center text-4xl group-hover:bg-brand-light/10 group-hover:text-brand transition duration-300">
                                {/* Simple icon based on name, or generic */}
                                📱
                            </div>
                            <h3 className="font-bold text-xl text-slate-700 group-hover:text-brand transition">{cat.name || cat}</h3>
                            <p className="text-sm text-gray-400 mt-2">{Math.floor(Math.random() * 50) + 10} Products</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
