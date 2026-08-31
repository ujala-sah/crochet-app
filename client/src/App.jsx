import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VerifyOtpPage from './pages/VerifyOtpPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import PatternsPage from './pages/PatternsPage.jsx';
import PatternDetailPage from './pages/PatternDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import CartPage from './pages/CartPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import UserDashboardPage from './pages/dashboard/UserDashboardPage.jsx';
import UserAccountPage from './pages/dashboard/UserAccountPage.jsx';
import UserOrdersPage from './pages/dashboard/UserOrdersPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminAccountPage from './pages/admin/AdminAccountPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductFormPage from './pages/admin/AdminProductFormPage.jsx';
import AdminPatternsPage from './pages/admin/AdminPatternsPage.jsx';
import AdminPatternFormPage from './pages/admin/AdminPatternFormPage.jsx';

function withSite(page) {
  return <SiteLayout>{page}</SiteLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={withSite(<HomePage />)} />
      <Route path="/login" element={withSite(<LoginPage />)} />
      <Route path="/register" element={withSite(<RegisterPage />)} />
      <Route path="/verify-otp" element={withSite(<VerifyOtpPage />)} />
      <Route path="/products" element={withSite(<ProductsPage />)} />
      <Route path="/products/:id" element={withSite(<ProductDetailPage />)} />
      <Route path="/patterns" element={withSite(<PatternsPage />)} />
      <Route path="/patterns/:id" element={withSite(<PatternDetailPage />)} />
      <Route path="/about" element={withSite(<AboutPage />)} />
      <Route path="/search" element={withSite(<SearchPage />)} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute userOnly>
            {withSite(<CartPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute userOnly>
            {withSite(<WishlistPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute userOnly>
            {withSite(<CheckoutPage />)}
          </ProtectedRoute>
        }
      />
      <Route path="/account" element={<Navigate to="/dashboard/account" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute userOnly>
            <DashboardLayout>
              <UserDashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/account"
        element={
          <ProtectedRoute userOnly>
            <DashboardLayout>
              <UserAccountPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute userOnly>
            <DashboardLayout>
              <UserOrdersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/account"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminAccountPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminCustomersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminProductFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/edit/:id"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminProductFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patterns"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminPatternsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patterns/new"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminPatternFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patterns/edit/:id"
        element={
          <ProtectedRoute admin>
            <AdminLayout>
              <AdminPatternFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={withSite(<NotFoundPage />)} />
    </Routes>
  );
}
