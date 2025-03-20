import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/listings" element={<Property />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="listing" element={<UserListings />} />
        </Route>
        <Route path="/super-admin" element={<SuperAdminDashboard />}>
          <Route path="price" element={<Superadmin />} />
          <Route path="listings" element={<SuperAdminListings />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
