"use client";

import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaUserCircle } from "react-icons/fa"; // Added FaUserCircle
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
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
  const dispatch = useDispatch(); // For dispatching logout actions
  const navigate = useNavigate(); // For redirecting after logout

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle profile dropdown
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Handle logout
  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart()); // Start logout process

      // Optionally, call an API to invalidate the token on the server (if applicable)
      // const res = await fetch("/api/auth/signout", { method: "POST" });
      // if (!res.ok) throw new Error("Logout failed");

      dispatch(signOutUserSuccess()); // Clear Redux state
      localStorage.removeItem("token"); // Remove token from localStorage
      setIsProfileOpen(false); // Close dropdown
      setIsMenuOpen(false); // Close mobile menu if open
      navigate("/sign-in"); // Redirect to sign-in page
    } catch (error) {
      dispatch(signOutUserFailure(error.message)); // Handle failure
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white text-black">
      <div className="flex items-center justify-between w-full p-2">
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        HS
                      </span>
                    </div>
                  </div>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl font-extrabold text-gray-900 tracking-tight"
                >
                  Heaven Space
                </motion.span>
              </Link>

              <nav className="hidden md:flex items-center space-x-10">
                {["Home", "Rooms", "Hostels", "Hotels", "About", "Contact"].map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <Link
                        to={`#${item.toLowerCase()}`}
                        className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  )
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Link
                    to="/sign-in"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </nav>

              <button
                className="md:hidden text-gray-800 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaX size={28} /> : <FaBars size={28} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white shadow-xl"
              >
                <div className="container mx-auto px-4 py-6">
                  <nav className="flex flex-col space-y-6">
                    {[
                      "Home",
                      "Rooms",
                      "Hostels",
                      "Hotels",
                      "About",
                      "Contact",
                    ].map((item) => (
                      <Link
                        key={item}
                        to={`#${item.toLowerCase()}`}
                        className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    ))}
                    <Link
                      to="/sign-in"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full text-center shadow-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>
    </header>
  );
}
