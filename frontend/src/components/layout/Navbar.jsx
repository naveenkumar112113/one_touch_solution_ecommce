import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { user, logout } = useAuth();

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products?search=${keyword}`);
        } else {
            navigate('/products');
        }
    };

    return (
        <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wider text-white">
                    ONE TOUCH <span className="text-brand-light">SOLUTION.</span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={searchHandler} className="hidden md:flex relative w-1/3 text-gray-800">
                    <input
                        type="text"
                        placeholder="Search for parts..."
                        className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-brand transition">
                        <FaSearch />
                    </button>
                </form>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-accent transition duration-300">Home</Link>
                    <Link to="/products" className="hover:text-accent transition duration-300">Shop</Link>
                    <Link to="/makes" className="hover:text-accent transition duration-300">Browse by Make</Link>
                    <Link to="/categories" className="hover:text-accent transition duration-300">Categories</Link>

                    <Link to="/cart" className="relative hover:text-accent transition duration-300">
                        <FaShoppingCart size={20} />
                        <span className="absolute -top-2 -right-2 bg-brand-light text-xs text-slate-900 font-bold px-1.5 py-0.5 rounded-full">
                            {getCartCount()}
                        </span>
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">Hello, {user.name}</span>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-1 hover:text-accent transition duration-300"
                            >
                                <FaSignOutAlt size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-1 hover:text-accent transition duration-300">
                            <FaUser size={20} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
