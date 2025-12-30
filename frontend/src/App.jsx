import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/user/HomePage';
import ContactPage from './pages/user/ContactPage';
import LoginPage from './pages/user/LoginPage';
import ProductPage from './pages/user/ProductPage';
import ProductDetailsPage from './pages/user/ProductDetailsPage';
import CategoryPage from './pages/user/CategoryPage';
import RegisterPage from './pages/user/RegisterPage';
import MakeBrowsePage from './pages/user/MakeBrowsePage';
import MakeListPage from './pages/user/MakeListPage';
import ModelListPage from './pages/user/ModelListPage';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminCategoryListPage from './pages/admin/AdminCategoryListPage';
import AdminMakeListPage from './pages/admin/AdminMakeListPage';
import AdminModelListPage from './pages/admin/AdminModelListPage';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/user/CartPage';

// ... (existing imports)

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* User Routes - Wrapped in Layout */}
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:slug" element={<ProductDetailsPage />} />
              <Route path="/categories" element={<CategoryPage />} />

              {/* Make-based navigation */}
              <Route path="/makes" element={<MakeBrowsePage />} />
              <Route path="/make/:makeSlug/models" element={<ModelListPage />} />
              <Route path="/make/:makeSlug/model/:modelSlug/products" element={<ProductPage />} />

              {/* Category-based navigation */}
              <Route path="/category/:categorySlug/makes" element={<MakeListPage />} />
              <Route path="/category/:categorySlug/make/:makeSlug/models" element={<ModelListPage />} />
              <Route path="/category/:categorySlug/make/:makeSlug/model/:modelSlug/products" element={<ProductPage />} />

              <Route path="/cart" element={<CartPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Admin Routes - Wrapped in AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductListPage />} />
              <Route path="product/:id/edit" element={<AdminProductEditPage />} />
              <Route path="product/new" element={<AdminProductEditPage />} />
              <Route path="orders" element={<AdminOrderListPage />} />
              <Route path="categories" element={<AdminCategoryListPage />} />
              <Route path="makes" element={<AdminMakeListPage />} />
              <Route path="models" element={<AdminModelListPage />} />
              <Route path="users" element={<div className="p-10">Users Management (Coming Soon)</div>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
