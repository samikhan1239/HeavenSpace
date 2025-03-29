import React, { useState, useEffect } from "react";
import axios from "axios";

function Superadmin() {
  const [adminAmount, setAdminAmount] = useState("");
  const [userAmount, setUserAmount] = useState("");
  const [adminFree, setAdminFree] = useState(false);
  const [userFree, setUserFree] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log("Fetching settings with config:", config);
        const response = await axios.get("/api/admin/get-settings", config);
        const data = response.data.settings;
        console.log("Settings fetched:", data);
        setSettings(data);
        setAdminAmount(data.adminAmount || "");
        setUserAmount(data.userAmount || "");
        setAdminFree(data.adminFree);
        setUserFree(data.userFree);
      } catch (error) {
        console.error(
          "Error fetching settings:",
          error.response?.data || error
        );
        setError(
          error.response?.data?.message || "Failed to load current settings"
        );
      }
    };
    fetchSettings();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        adminAmount: adminFree ? 0 : parseFloat(adminAmount) || 0,
        userAmount: userFree ? 0 : parseFloat(userAmount) || 0,
        adminFree,
        userFree,
      };

      if (!adminFree && (!adminAmount || adminAmount <= 0)) {
        throw new Error("Admin amount must be greater than 0 if not free");
      }
      if (!userFree && (!userAmount || userAmount <= 0)) {
        throw new Error("User amount must be greater than 0 if not free");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log("Submitting with config:", config, "Payload:", payload);
      const response = await axios.post(
        "/api/admin/set-payments",
        payload,
        config
      );
      const updatedSettings = response.data.settings;
      setSettings(updatedSettings);
      setAdminAmount(updatedSettings.adminAmount || "");
      setUserAmount(updatedSettings.userAmount || "");
      setAdminFree(updatedSettings.adminFree);
      setUserFree(updatedSettings.userFree);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error.response?.data || error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error updating settings"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Superadmin Panel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Signup Amount (INR)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 ${
                adminFree
                  ? "bg-gray-200 cursor-not-allowed opacity-70"
                  : "hover:border-indigo-300"
              }`}
              value={adminAmount}
              onChange={(e) => setAdminAmount(e.target.value)}
              disabled={adminFree}
              placeholder={adminFree ? "Free" : "Enter amount in INR"}
            />
            <span className="absolute right-3 top-10 text-gray-500 text-sm">
              ₹
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              checked={adminFree}
              onChange={(e) => {
                setAdminFree(e.target.checked);
                if (e.target.checked) setAdminAmount("");
              }}
            />
            <label className="ml-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Free for Admins
            </label>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Signup Amount (INR)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 ${
                userFree
                  ? "bg-gray-200 cursor-not-allowed opacity-70"
                  : "hover:border-indigo-300"
              }`}
              value={userAmount}
              onChange={(e) => setUserAmount(e.target.value)}
              disabled={userFree}
              placeholder={userFree ? "Free" : "Enter amount in INR"}
            />
            <span className="absolute right-3 top-10 text-gray-500 text-sm">
              ₹
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              checked={userFree}
              onChange={(e) => {
                setUserFree(e.target.checked);
                if (e.target.checked) setUserAmount("");
              }}
            />
            <label className="ml-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Free for Users
            </label>
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-red-600 animate-pulse">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                  />
                </svg>
                Saving...
              </div>
            ) : (
              "Save Settings"
            )}
          </button>
        </form>
        {settings && (
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-center text-gray-700 shadow-inner">
            <p className="text-sm font-semibold text-indigo-600">
              Current Settings
            </p>
            <p className="mt-2 text-sm">
              <span className="font-medium">Admin:</span>{" "}
              {settings.adminFree ? "Free" : `${settings.adminAmount} INR`}
            </p>
            <p className="text-sm">
              <span className="font-medium">User:</span>{" "}
              {settings.userFree ? "Free" : `${settings.userAmount} INR`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Superadmin;
