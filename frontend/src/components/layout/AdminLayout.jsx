import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaSignOutAlt, FaTags, FaIndustry, FaMobileAlt } from 'react-icons/fa';

const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/products', icon: <FaBox />, label: 'Products' },
        { path: '/admin/categories', icon: <FaTags />, label: 'Categories' },
        { path: '/admin/makes', icon: <FaIndustry />, label: 'Makes' },
        { path: '/admin/models', icon: <FaMobileAlt />, label: 'Models' },
        { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold tracking-wider">ONE TOUCH<span className="text-brand-light">.</span></h1>
                    <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${location.pathname === item.path
                                ? 'bg-brand text-white'
                                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center space-x-3 text-gray-400 hover:text-white px-4 py-3 w-full rounded-lg hover:bg-slate-800 transition">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-slate-800">
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Admin User</span>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
