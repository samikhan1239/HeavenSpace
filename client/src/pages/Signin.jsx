import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Reset success message

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || `HTTP error! Status: ${res.status}`);

      dispatch(signInSuccess(data));

      setSuccessMessage("🎉 Login successful! Redirecting..."); // Display success message
      console.log("Signin successful:", data);
      const userRole = data?.user?.role; // Ensure `data.user` exists

      // Redirect after showing success message
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "superadmin") {
          navigate("/super-admin");
        } else {
          navigate("/");
        }
      }, 2000); // Delay redirection for user feedback
    } catch (error) {
      dispatch(signInFailure(error.message));
      setError(`❌ Signin failed: ${error.message}`);
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

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
          Sign In
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p> Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
