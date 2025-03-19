"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const SuperAdminListings = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Fetching listings with token:", token);

        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const res = await fetch("/api/listings/admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.log("Fetch response:", data);
          if (res.status === 401 || res.status === 403) {
            navigate("/sign-in");
            return;
          }
          throw new Error(data.message || "Failed to fetch listings");
        }

        setListings(data.listings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === "superadmin") {
      fetchAllListings();
    } else {
      console.log(
        "Redirecting: User not superadmin or not logged in",
        currentUser
      );
      navigate("/sign-in");
    }
  }, [navigate, currentUser]);

  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate("/sign-in");
          return;
        }
        throw new Error(data.message || "Failed to delete listing");
      }

      setListings(listings.filter((l) => l._id !== listingId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/property/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.p
          className="text-red-500 text-2xl font-semibold bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Super Admin - All Listings
      </h1>
      <p className="text-center text-gray-600 text-xl mb-4">
        Total Listings: {listings.length}
      </p>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          No listings available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 uppercase text-sm font-semibold">
                <th className="p-4 text-left">Admin Name</th>
                <th className="p-4 text-left">Property Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <motion.tr
                  key={listing._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="p-4">{listing.userRef?.username || "N/A"}</td>
                  <td className="p-4">{listing.name || "Unnamed Property"}</td>
                  <td className="p-4 truncate max-w-xs">
                    {listing.description || "No description"}
                  </td>
                  <td className="p-4">
                    ${listing.price ? listing.price.toLocaleString() : "N/A"}
                  </td>
                  <td className="p-4">{listing.location || "N/A"}</td>
                  <td className="p-4">{listing.category || "N/A"}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(listing._id)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminListings;
