import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import { Admin } from "./Admin/Admin";
import { SuperAdmin } from "./SuperAdmin/SuperAdmin";
import CreateListing from "./Admin/CreateListing";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="create-listing" element={<CreateListing />} />
        </Route>
        <Route path="/super-admin" element={<SuperAdmin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
