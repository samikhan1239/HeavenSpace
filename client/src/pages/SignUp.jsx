"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { signInSuccess } from "../redux/user/userSlice";

const SignUp = () => {
  const [formData, setFormData] = useState({ role: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleSelection = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.role) {
      setError("⚠️ Please select whether you want to Buy or Sell Property.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Signup Response Data:", data);

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! Status: ${res.status}`);
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid response: Missing token or user data");
      }

      // Dispatch to Redux
      dispatch(
        signInSuccess({
          user: data.user,
          token: data.token,
        })
      );

      console.log("✅ Signup successful:", data);
      console.log("✅ Token received:", data.token);

      setSuccessMessage("🎉 Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
      setError(`❌ Signup failed: ${error.message}`);
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(8, 145, 178, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const roleButtonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.97 },
    selected: {
      scale: 1.03,
      y: -3,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const starVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.2, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: Math.random() * 3 + 2,
      },
    },
  };

  const nebulaVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 15,
        ease: "easeInOut",
      },
    },
  };

  const shootingStarVariants = {
    initial: {
      x: -100,
      y: -100,
      opacity: 0,
    },
    animate: {
      x: "150vw",
      y: "150vh",
      opacity: 1,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col md:flex-row overflow-hidden">
      {/* Left Half - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 order-2 md:order-1">
        <motion.div
          className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.h2
              className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Join Heaven Space
            </motion.h2>
            <motion.p className="text-gray-300" variants={itemVariants}>
              Create your account to start your cosmic journey
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            variants={containerVariants}
          >
            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-200 ml-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <motion.input
                  type="text"
                  placeholder="Choose a username"
                  className="bg-white/5 border border-white/20 pl-10 p-4 rounded-xl w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  id="username"
                  onChange={handleChange}
                  required
                  whileFocus={{
                    boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.2)",
                    scale: 1.01,
                  }}
                />
              </div>
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-200 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <motion.input
                  type="email"
                  placeholder="Enter your  email address"
                  className="bg-white/5 border border-white/20 pl-10 p-4 rounded-xl w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  id="email"
                  onChange={handleChange}
                  required
                  whileFocus={{
                    boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.2)",
                    scale: 1.01,
                  }}
                />
              </div>
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <motion.input
                  type="password"
                  placeholder="Create a secure password"
                  className="bg-white/5 border border-white/20 pl-10 p-4 rounded-xl w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  id="password"
                  onChange={handleChange}
                  required
                  whileFocus={{
                    boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.2)",
                    scale: 1.01,
                  }}
                />
              </div>
            </motion.div>

            <motion.div className="space-y-3" variants={itemVariants}>
              <label className="text-sm font-medium text-gray-200 ml-1">
                I want to:
              </label>
              <div className="flex gap-4 flex-col sm:flex-row">
                <motion.button
                  type="button"
                  className={`p-4 rounded-xl flex-1 flex items-center justify-center gap-2 ${
                    formData.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-white/5 border border-white/20 text-gray-200"
                  }`}
                  onClick={() => handleRoleSelection("user")}
                  variants={roleButtonVariants}
                  initial="initial"
                  whileHover={formData.role !== "user" ? "hover" : ""}
                  whileTap="tap"
                  animate={formData.role === "user" ? "selected" : "initial"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Buy Property
                </motion.button>
                <motion.button
                  type="button"
                  className={`p-4 rounded-xl flex-1 flex items-center justify-center gap-2 ${
                    formData.role === "admin"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/5 border border-white/20 text-gray-200"
                  }`}
                  onClick={() => handleRoleSelection("admin")}
                  variants={roleButtonVariants}
                  initial="initial"
                  whileHover={formData.role !== "admin" ? "hover" : ""}
                  whileTap="tap"
                  animate={formData.role === "admin" ? "selected" : "initial"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Sell Property
                </motion.button>
              </div>
            </motion.div>

            {/* Messages with AnimatePresence for smooth transitions */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="bg-red-900/30 border border-red-500/50 rounded-xl p-4"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <motion.p
                    className="text-red-300 text-center flex items-center justify-center gap-2"
                    animate={{ x: [0, -5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </motion.p>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  className="bg-cyan-900/30 border border-cyan-500/50 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <motion.p
                    className="text-cyan-300 text-center flex items-center justify-center gap-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {successMessage}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mt-2 group"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <span>Create Account</span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </motion.button>
          </motion.form>

          <motion.div className="mt-8 text-center" variants={itemVariants}>
            <motion.p className="text-gray-300" variants={itemVariants}>
              Already have an account?
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/sign-in" className="inline-block mt-2">
                <motion.span
                  className="text-cyan-300 hover:text-cyan-400 transition-colors font-medium flex items-center justify-center gap-1 group"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Sign In
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Half - Branding */}
      <div className="md:w-1/2 flex items-center justify-center p-10 text-white relative overflow-hidden order-1 md:order-2">
        <motion.div
          className="space-y-10 z-10 max-w-lg"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center gap-4"
            variants={logoVariants}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
            >
              <span className="text-white text-3xl font-bold">HS</span>
            </motion.div>
            <motion.h1
              className="font-extrabold text-5xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-300"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Heaven Space
            </motion.h1>
          </motion.div>

          {/* Taglines with animated reveal */}
          <motion.div className="space-y-3" variants={itemVariants}>
            <motion.p
              className="text-gray-100 text-2xl font-semibold"
              variants={itemVariants}
            >
              Discover Your Perfect Stay
            </motion.p>
            <motion.p className="text-gray-300 text-lg" variants={itemVariants}>
              Find the ideal Sp, from cozy rooms to spacious hostel.
            </motion.p>
          </motion.div>

          {/* Benefits */}
          <motion.div className="space-y-6">
            <motion.h3
              className="text-xl font-semibold text-cyan-300"
              variants={itemVariants}
            >
              Why join Heaven Space?
            </motion.h3>

            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">
                    Premium Listings
                  </h4>
                  <p className="text-gray-300 mt-1">
                    Access exclusive properties not available anywhere else.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">
                    List, rent, and connect effortlessly.
                  </h4>
                  <p className="text-gray-300 mt-1">
                    Connect with like-minded property enthusiasts.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">
                    Stellar Support
                  </h4>
                  <p className="text-gray-300 mt-1">
                    Our team is available 24/7 to assist with your journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Starry Background Animation with Framer Motion */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Stars */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              variants={starVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Shooting stars */}
          <motion.div
            className="absolute w-0.5 h-20 bg-gradient-to-b from-white to-transparent -rotate-45"
            style={{ top: "10%", left: "20%" }}
            variants={shootingStarVariants}
            initial="initial"
            animate="animate"
          />

          <motion.div
            className="absolute w-0.5 h-16 bg-gradient-to-b from-white to-transparent -rotate-45"
            style={{ top: "30%", right: "30%" }}
            variants={shootingStarVariants}
            initial="initial"
            animate="animate"
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 4,
              repeatDelay: 15,
              ease: "easeOut",
            }}
          />

          {/* Nebula effects */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full -top-32 -left-32 blur-3xl opacity-20 bg-gradient-to-r from-cyan-500 to-blue-500"
            variants={nebulaVariants}
            initial="initial"
            animate="animate"
          />

          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full -bottom-24 -right-24 blur-3xl opacity-20 bg-gradient-to-r from-purple-500 to-pink-500"
            variants={nebulaVariants}
            initial="initial"
            animate="animate"
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 18,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
