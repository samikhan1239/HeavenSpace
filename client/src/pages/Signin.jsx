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
  const { loading } = useSelector((state) => state.user); // Access loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate input
    if (!formData.email || !formData.password) {
      setError("❌ Email and password are required");
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

      // Dispatch user and token separately
      dispatch(
        signInSuccess({
          user: data.user,
          token: data.token,
        })
      );

      // Optional: Store token in localStorage for persistence
      localStorage.setItem("token", data.token);

      setSuccessMessage("🎉 Login successful! Redirecting...");
      console.log("Signin successful:", data);

      const userRole = data.user?.role;
      setTimeout(() => {
        switch (userRole) {
          case "superadmin":
            navigate("/super-admin");
            break;
          case "admin":
            navigate("/create-listing"); // Align with your requirement
            break;
          case "user":
            navigate("/"); // Users view listings
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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />

        {/* Display error or success messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
