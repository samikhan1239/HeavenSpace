"use client";

import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.2 },
  },
};

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      dispatch(signOutUserSuccess());
      localStorage.removeItem("token");
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate("/sign-in");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error("Logout error:", error);
    }
  };

  // Navigation items
  const navItems = ["Home", "Rooms", "Hostels", "Hotels", "About", "Contact"];

  return (
    <>
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md h-20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">HS</span>
                </div>
              </div>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl font-extrabold text-gray-900 tracking-tight"
            >
              Heaven Space
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              navItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Link
                    to={item === "Home" ? "/home" : "/listings"}
                    className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-base font-semibold text-gray-500 cursor-not-allowed"
              >
                Please sign in to access navigation
              </motion.div>
            )}
            {currentUser ? (
              <div className="relative">
                <motion.button
                  onClick={toggleProfile}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-300 focus:outline-none"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <FaUserCircle size={28} />
                </motion.button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link
                  to="/sign-in"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-xl absolute top-20 left-0 right-0 z-40"
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="flex flex-col space-y-6">
                  {currentUser ? (
                    navItems.map((item) => (
                      <Link
                        key={item}
                        to={item === "Home" ? "/" : "/listings"}
                        className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    ))
                  ) : (
                    <div className="text-base font-semibold text-gray-500 py-2">
                      Please sign in to access navigation
                    </div>
                  )}
                  {currentUser ? (
                    <>
                      <Link
                        to="/profile"
                        className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/sign-in"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full text-center shadow-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
}
