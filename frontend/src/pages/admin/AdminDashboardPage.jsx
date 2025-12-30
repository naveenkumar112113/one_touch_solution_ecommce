import React from 'react';
import { FaBox, FaShoppingBag, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-4 rounded-full ${color} text-white`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="₹1,24,000" icon={<FaMoneyBillWave />} color="bg-green-500" />
                <StatCard title="Total Orders" value="45" icon={<FaShoppingBag />} color="bg-blue-500" />
                <StatCard title="Total Products" value="120" icon={<FaBox />} color="bg-orange-500" />
                <StatCard title="Total Users" value="89" icon={<FaUsers />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-semibold text-slate-700">Order #100{i}</p>
                                    <p className="text-xs text-gray-500">2 mins ago</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Delivered
                                </span>
                                <p className="font-bold text-slate-800">₹2,500</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">New Users</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center space-x-4 py-3 border-b border-gray-50 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <div>
                                    <p className="font-semibold text-slate-700">User {i}</p>
                                    <p className="text-xs text-gray-500">user{i}@example.com</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
