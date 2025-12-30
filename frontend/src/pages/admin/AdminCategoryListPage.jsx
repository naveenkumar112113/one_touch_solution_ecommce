import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import API from '../../services/api';

const AdminCategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [modalType, setModalType] = useState('category'); // 'category' or 'subcategory'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        parent: null,
        isActive: true
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories');
            // Separate categories and subcategories
            const mainCategories = data.filter(cat => !cat.parent);
            setCategories(mainCategories);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const toggleExpand = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const openCreateModal = (type = 'category', parent = null) => {
        setModalMode('create');
        setModalType(type);
        setFormData({
            name: '',
            description: '',
            image: '',
            parent: parent,
            isActive: true
        });
        setSelectedCategory(null);
        setShowModal(true);
    };

    const openEditModal = (category, type = 'category') => {
        setModalMode('edit');
        setModalType(type);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            parent: category.parent || null,
            isActive: category.isActive !== undefined ? category.isActive : true
        });
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await API.post('/categories', formData);
            } else {
                await API.put(`/categories/${selectedCategory._id}`, formData);
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (categoryId, hasSubcategories) => {
        if (hasSubcategories) {
            alert('Cannot delete category with subcategories. Delete subcategories first.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await API.delete(`/categories/${categoryId}`);
                fetchCategories();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting category');
            }
        }
    };

    const toggleStatus = async (category) => {
        try {
            await API.put(`/categories/${category._id}`, {
                ...category,
                isActive: !category.isActive
            });
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Category Management</h1>
                <button
                    onClick={() => openCreateModal('category')}
                    className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <FaPlus /> Add Category
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                />
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategories</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCategories.map((category) => (
                            <React.Fragment key={category._id}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {category.subcategories && category.subcategories.length > 0 && (
                                                <button
                                                    onClick={() => toggleExpand(category._id)}
                                                    className="text-gray-500 hover:text-brand"
                                                >
                                                    {expandedCategories.has(category._id) ? <FaChevronDown /> : <FaChevronRight />}
                                                </button>
                                            )}
                                            <span className="font-medium text-slate-800">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {category.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {category.subcategories?.length || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(category)}
                                            className="flex items-center gap-1"
                                        >
                                            {category.isActive ? (
                                                <><FaToggleOn className="text-2xl text-green-500" /> <span className="text-sm text-green-600">Active</span></>
                                            ) : (
                                                <><FaToggleOff className="text-2xl text-gray-400" /> <span className="text-sm text-gray-500">Inactive</span></>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openCreateModal('subcategory', category._id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                + Add Sub
                                            </button>
                                            <button
                                                onClick={() => openEditModal(category, 'category')}
                                                className="text-brand hover:text-brand-dark"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id, category.subcategories?.length > 0)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Subcategories */}
                                {expandedCategories.has(category._id) && category.subcategories?.map((subcat) => (
                                    <tr key={subcat._id} className="bg-gray-50">
                                        <td className="px-6 py-3 pl-16">
                                            <span className="text-gray-600">↳ {subcat.name}</span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 text-sm">
                                            {subcat.description || '-'}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 text-sm">-</td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => toggleStatus(subcat)}
                                                className="flex items-center gap-1"
                                            >
                                                {subcat.isActive ? (
                                                    <><FaToggleOn className="text-xl text-green-500" /> <span className="text-xs text-green-600">Active</span></>
                                                ) : (
                                                    <><FaToggleOff className="text-xl text-gray-400" /> <span className="text-xs text-gray-500">Inactive</span></>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(subcat, 'subcategory')}
                                                    className="text-brand hover:text-brand-dark"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subcat._id, false)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            {modalMode === 'create' ? 'Create' : 'Edit'} {modalType === 'category' ? 'Category' : 'Subcategory'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded text-brand focus:ring-brand"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition"
                                >
                                    {modalMode === 'create' ? 'Create' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryListPage;
