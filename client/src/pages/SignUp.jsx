import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({ role: "" }); // Default role empty
  const [error, setError] = useState(""); // Error handling
  const [successMessage, setSuccessMessage] = useState(""); // Success message

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
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

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
      });

      const data = await res.json(); // Get response JSON

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! Status: ${res.status}`);
      }

      setSuccessMessage("🎉 Registration successful! Redirecting...");
      console.log("Signup successful:", data);

      setTimeout(() => {
        window.location.href = "/sign-in"; // Redirect after success
      }, 2000);
    } catch (error) {
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

        {/* Role Selection - Two Buttons */}
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

        {/* Show Error Messages */}
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
