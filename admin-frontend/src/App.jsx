import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginForm from "./Components/Login";

import ResetPassword from "./Components/ResetPassword";

import DashboardLayout from "./Components/Layout/DashboardLayout";

import Dashboard from "./Components/Dashboard";

import Staff from "./Components/Staff";

import StaffAddEdit from "./Components/Staff/AddEdit";

import Category from "./Components/Category";

import Products from "./Components/Products";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" replace />;
};


export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginForm />} />

        <Route
          path="/change"
          element={
            <ResetPassword
              onBackToLogin={() => window.location.href = "/"}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Dashboard />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/add" element={<StaffAddEdit />} />
          <Route path="staff/edit/:id" element={<StaffAddEdit />} />
          <Route path="categories" element={<Category />} />
          <Route path="products" element={<Products />} />

        </Route>

        <Route
          path="/staff"
          element={<Navigate to="/dashboard/staff" replace />}
        />

        <Route
          path="/categories"
          element={<Navigate to="/dashboard/categories" replace />}
        />

        <Route
          path="/products"
          element={<Navigate to="/dashboard/products" replace />}
        />

        <Route
          path="/orders"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/customers"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/settings"
          element={<Navigate to="/dashboard" replace />}
        />
        
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}