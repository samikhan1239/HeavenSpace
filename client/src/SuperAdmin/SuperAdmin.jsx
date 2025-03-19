import React, { useState, useEffect } from "react";
import axios from "axios";

function Superadmin() {
  const [adminAmount, setAdminAmount] = useState("");
  const [userAmount, setUserAmount] = useState("");
  const [adminFree, setAdminFree] = useState(false);
  const [userFree, setUserFree] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get("api/admin/get-settings")
      .then((response) => setSettings(response.data))
      .catch((error) => console.error("Error fetching settings:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("api/admin/set-payments", {
        adminAmount,
        userAmount,
        adminFree,
        userFree,
      });
      alert(response.data.message);
      setSettings(response.data);
    } catch (error) {
      alert("Error updating settings");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Superadmin Panel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Admin Amount (INR):</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              value={adminAmount}
              onChange={(e) => setAdminAmount(e.target.value)}
              disabled={adminFree}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={adminFree}
              onChange={(e) => setAdminFree(e.target.checked)}
            />
            <label className="text-gray-700">Free for Admins</label>
          </div>
          <div>
            <label className="block text-gray-700">User Amount (INR):</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              value={userAmount}
              onChange={(e) => setUserAmount(e.target.value)}
              disabled={userFree}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={userFree}
              onChange={(e) => setUserFree(e.target.checked)}
            />
            <label className="text-gray-700">Free for Users</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </form>
        {settings && (
          <p className="mt-4 text-center text-gray-600">
            <strong>Current:</strong> Admin: {settings.adminAmount} INR (Free:{" "}
            {settings.adminFree ? "Yes" : "No"}), User: {settings.userAmount}{" "}
            INR (Free: {settings.userFree ? "Yes" : "No"})
          </p>
        )}
      </div>
    </div>
  );
}

export default Superadmin;
