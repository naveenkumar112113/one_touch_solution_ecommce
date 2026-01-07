import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [keyword, setKeyword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold tracking-wider text-white z-50">
                        ONE TOUCH <span className="text-brand-light">SOLUTION.</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="space-y-2">
                            <span className={`block w-8 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                            <span className={`block w-8 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-8 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                        </div>
                    </button>

                    {/* Desktop Search Bar */}
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
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

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-slate-900/95 z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <form onSubmit={searchHandler} className="w-3/4 text-gray-800 mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500">
                                <FaSearch />
                            </button>
                        </div>
                    </form>

                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-brand-light transition">Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-brand-light transition">Shop</Link>
                    <Link to="/makes" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-brand-light transition">Browse by Make</Link>
                    <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-brand-light transition">Categories</Link>

                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-brand-light transition flex items-center gap-2">
                        <FaShoppingCart /> Cart ({getCartCount()})
                    </Link>

                    {user ? (
                        <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-700 w-1/2">
                            <span className="text-lg">Hello, {user.name}</span>
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition"
                            >
                                <FaSignOutAlt /> <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-brand-light transition flex items-center gap-2 pt-4 border-t border-gray-700 w-1/2 justify-center">
                            <FaUser /> Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
