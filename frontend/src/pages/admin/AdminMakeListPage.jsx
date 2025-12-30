import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import API from '../../services/api';

const AdminMakeListPage = () => {
    const [makes, setMakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMake, setEditingMake] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        isActive: true
    });

    useEffect(() => {
        fetchMakes();
    }, []);

    const fetchMakes = async () => {
        try {
            const { data } = await API.get('/makes');
            setMakes(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching makes:', error);
            setLoading(false);
        }
    };

    const handleEdit = (make) => {
        setEditingMake(make);
        setFormData({
            name: make.name,
            description: make.description || '',
            logo: make.logo || '',
            isActive: make.isActive
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingMake(null);
        setFormData({
            name: '',
            description: '',
            logo: '',
            isActive: true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMake) {
                await API.put(`/makes/id/${editingMake._id}`, formData);
            } else {
                await API.post('/makes', formData);
            }
            setShowModal(false);
            fetchMakes();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving make');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This will fail if there are products using this make.')) {
            try {
                await API.delete(`/makes/id/${id}`);
                fetchMakes();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting make');
            }
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Makes Management</h1>
                <button
                    onClick={handleCreate}
                    className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                    <FaPlus /> <span>Add Make</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {makes.map((make) => (
                            <tr key={make._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {make.logo ? (
                                        <img src={make.logo} alt={make.name} className="w-12 h-12 object-contain" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                            {make.name.charAt(0)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-800">{make.name}</td>
                                <td className="px-6 py-4 text-gray-600 font-mono text-sm">{make.slug}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{make.description || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${make.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {make.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(make)}
                                            className="text-blue-600 hover:text-blue-800 transition"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(make._id)}
                                            className="text-red-600 hover:text-red-800 transition"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">{editingMake ? 'Edit Make' : 'Create Make'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                <input
                                    type="text"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active</span>
                                </label>
                            </div>
                            <div className="flex space-x-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-brand hover:bg-brand-dark text-white py-2 rounded-lg transition"
                                >
                                    {editingMake ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMakeListPage;
