import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import CreateListing from "./Admin/CreateListing";
import Listings from "./Admin/Listings";
import ListingDetail from "./Admin/ListingDetail";
import UserListings from "./Admin/Listings";
import { Admin } from "./Admin/Admin";
import Property from "./pages/Property";
import Superadmin from "./SuperAdmin/SuperAdmin";
import PropertyDetail from "./pages/Propertydetail";
import SuperAdminListings from "./SuperAdmin/SuperAdminListing";
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashBoard";
import Footer from "./components/Footer";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    try {
      // Decode JWT payload to get role
      const decoded = JSON.parse(atob(token.split(".")[1]));
      userRole = decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  if (!token || userRole !== allowedRole) {
    console.log(
      `Redirecting: Role ${userRole} not allowed for ${allowedRole} route`
    );
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Default route redirects to /sign-in */}
        <Route path="/" element={<Signin />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listings" element={<Property />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/property/:id" element={<PropertyDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />}>
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="listing" element={<UserListings />} />
        </Route>

        {/* Superadmin Routes (Protected) */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRole="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route
            path="price"
            element={
              <ProtectedRoute allowedRole="superadmin">
                <Superadmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="listings"
            element={
              <ProtectedRoute allowedRole="superadmin">
                <SuperAdminListings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback route for undefined paths */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
