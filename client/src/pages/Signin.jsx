import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.email || !formData.password) {
      setError("❌ Please enter both email and password");
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Raw signin response:", text);
        throw new Error(text || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Signin failed");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid response: Missing token or user data");
      }

      dispatch(
        signInSuccess({
          user: data.user,
          token: data.token,
        })
      );

      localStorage.setItem("token", data.token);

      setSuccessMessage("🌌 Welcome aboard! Redirecting...");
      console.log("Signin successful, user:", data.user);
      console.log("Signin successful:", data);

      const userRole = data.user?.role;
      setTimeout(() => {
        switch (userRole) {
          case "superadmin":
            navigate("/super-admin");
            break;
          case "admin":
            navigate("/admin/create-listing");
            break;
          case "user":
            navigate("/");
            break;
          default:
            console.warn("Unknown role:", userRole);
            navigate("/");
        }
      }, 2000);
    } catch (error) {
      dispatch(signInFailure(error.message));
      setError(`❌ Signin failed: ${error.message}`);
      console.error("Signin error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col md:flex-row overflow-hidden">
      {/* Left Half - Enhanced Heaven Space Branding */}
      <div className="md:w-1/2 flex items-center justify-center p-10 text-white relative overflow-hidden">
        <div className="space-y-10 z-10 max-w-lg">
          {/* Animated Title - One Line */}
          <h1 className="font-extrabold text-6xl sm:text-7xl animate-fadeIn">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">
              Heaven
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              {" "}
              Space
            </span>
          </h1>
          {/* Taglines */}
          <div className="space-y-3">
            <p className="text-gray-100 text-2xl font-semibold animate-fadeIn delay-400">
              Your Cosmic Adventure Awaits
            </p>
            <p className="text-gray-300 text-lg animate-fadeIn delay-600">
              Explore the infinite, create the extraordinary.
            </p>
          </div>
          {/* Points - No Animated Dots */}
          <ul className="text-gray-200 space-y-5 text-lg">
            <li className="flex items-center gap-4 animate-slideUp delay-800">
              <span className="w-3 h-3 bg-cyan-400 rounded-full" />
              <span>Unveil a universe of celestial listings.</span>
            </li>
            <li className="flex items-center gap-4 animate-slideUp delay-1000">
              <span className="w-3 h-3 bg-purple-400 rounded-full" />
              <span>Shape your own stellar creations.</span>
            </li>
            <li className="flex items-center gap-4 animate-slideUp delay-1200">
              <span className="w-3 h-3 bg-pink-300 rounded-full" />
              <span>Connect across the galaxy with dreamers.</span>
            </li>
            <li className="flex items-center gap-4 animate-slideUp delay-1400">
              <span className="w-3 h-3 bg-blue-300 rounded-full" />
              <span>Experience the magic of the cosmos.</span>
            </li>
          </ul>
        </div>
        {/* Starry Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-2 h-2 bg-white rounded-full top-20 left-20 animate-twinkle" />
          <div className="absolute w-3 h-3 bg-cyan-200 rounded-full top-1/3 right-1/4 animate-twinkle delay-200" />
          <div className="absolute w-1 h-1 bg-purple-300 rounded-full bottom-1/3 left-1/4 animate-twinkle delay-400" />
          <div className="absolute w-2 h-2 bg-pink-200 rounded-full top-2/3 right-1/3 animate-twinkle delay-600" />
          <div className="absolute w-1.5 h-1.5 bg-gray-100 rounded-full bottom-20 left-1/2 animate-twinkle delay-800" />
          <div className="absolute w-128 h-128 bg-cyan-500 rounded-full -top-32 -left-32 blur-3xl opacity-15 animate-float" />
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full -bottom-24 -right-24 blur-3xl opacity-15 animate-float delay-300" />
        </div>
      </div>

      {/* Right Half - Sign In Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 animate-slideInRight">
          <h2 className="text-3xl text-center font-semibold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="email"
              placeholder="Enter your cosmic email..."
              className="bg-white/5 border border-white/20 p-4 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/10 transition-all duration-300"
              id="email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Your secret stardust..."
              className="bg-white/5 border border-white/20 p-4 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/10 transition-all duration-300"
              id="password"
              onChange={handleChange}
              required
            />

            {/* Messages */}
            {error && (
              <p className="text-red-400 text-center bg-red-900/20 p-2 rounded-lg animate-shake">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-cyan-400 text-center bg-cyan-900/20 p-2 rounded-lg animate-bounceIn">
                {successMessage}
              </p>
            )}

            <button
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-4 rounded-lg uppercase font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex gap-2 mt-6 justify-center text-gray-200 animate-fadeIn delay-500">
            <p>New to Heaven Space?</p>
            <Link to="/sign-up">
              <span className="text-cyan-300 hover:text-cyan-400 transition-colors">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
