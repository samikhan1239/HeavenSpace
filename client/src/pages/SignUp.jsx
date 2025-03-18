import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice"; // Adjust path

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
          user: data.user, // { id: '67d91d4bab6aa90232fc8c88', ... }
          token: data.token,
        })
      );

      console.log("✅ Signup successful:", data);
      console.log("✅ Token received:", data.token);

      setSuccessMessage("🎉 Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/sign-in"); // Use navigate for React Router
      }, 2000);
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
      setError(`❌ Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
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

        <div className="flex gap-4">
          <button
            type="button"
            className={`p-3 rounded-lg flex-1 ${
              formData.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleRoleSelection("user")}
          >
            I want to Buy Property
          </button>
          <button
            type="button"
            className={`p-3 rounded-lg flex-1 ${
              formData.role === "admin"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleRoleSelection("admin")}
          >
            I want to Sell Property
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
          Sign Up
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
