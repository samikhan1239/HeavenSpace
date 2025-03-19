"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setListings } from "../redux/listings/listingSlice";
import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";

const Property = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    roomTypes: [],
    priceMin: 0,
    priceMax: 20000,
    amenities: [],
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listings/admin", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch listings");
        }

        dispatch(setListings(data.listings));
        setFilteredListings(data.listings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchListings();
  }, [dispatch]);

  // Filter listings based on search term and filters
  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter((listing) =>
        [
          listing.name,
          listing.description,
          listing.location,
          listing.category,
          listing.roomType,
        ].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((listing) =>
        filters.categories.includes(listing.category)
      );
    }

    if (filters.roomTypes.length > 0) {
      filtered = filtered.filter((listing) =>
        filters.roomTypes.includes(listing.roomType)
      );
    }

    filtered = filtered.filter(
      (listing) =>
        listing.price >= filters.priceMin && listing.price <= filters.priceMax
    );

    if (filters.amenities.length > 0) {
      filtered = filtered.filter((listing) =>
        filters.amenities.every((amenity) => listing[amenity])
      );
    }

    setFilteredListings(filtered);
  }, [searchTerm, filters, listings]);

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "categories") {
        setFilters((prev) => ({
          ...prev,
          categories: checked
            ? [...prev.categories, value]
            : prev.categories.filter((item) => item !== value),
        }));
      } else if (name === "roomTypes") {
        setFilters((prev) => ({
          ...prev,
          roomTypes: checked
            ? [...prev.roomTypes, value]
            : prev.roomTypes.filter((item) => item !== value),
        }));
      } else if (name === "amenities") {
        setFilters((prev) => ({
          ...prev,
          amenities: checked
            ? [...prev.amenities, value]
            : prev.amenities.filter((item) => item !== value),
        }));
      }
    } else if (type === "range") {
      setFilters((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const filterVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg flex justify-between items-center lg:rounded-b-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Available Properties
        </h1>
        <motion.button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md lg:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilter className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Filter */}
        <motion.div
          className={`w-full md:w-1/2 lg:w-80 bg-white shadow-2xl p-8 fixed top-0 left-0 h-screen overflow-y-auto z-50 lg:static lg:rounded-r-2xl`}
          variants={filterVariants}
          initial="hidden"
          animate={
            isFilterOpen || window.innerWidth >= 1024 ? "visible" : "hidden"
          }
        >
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Filters
            </h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent hidden lg:block">
            Filter Properties
          </h2>
          <div className="space-y-10">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Search
              </label>
              <motion.input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Category
              </label>
              <div className="space-y-4">
                {["Room", "Flat", "Hostel"].map((category) => (
                  <motion.div
                    key={category}
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="checkbox"
                      name="categories"
                      value={category}
                      checked={filters.categories.includes(category)}
                      onChange={handleFilterChange}
                      className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-3 text-sm text-gray-700 font-medium">
                      {category}
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Room/Flat Types */}
            {(filters.categories.includes("Room") ||
              filters.categories.includes("Flat")) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  {filters.categories.includes("Room") &&
                  filters.categories.includes("Flat")
                    ? "Room/Flat Type"
                    : filters.categories.includes("Room")
                    ? "Room Type"
                    : "Flat Type"}
                </label>
                <div className="space-y-4">
                  {(filters.categories.includes("Room")
                    ? ["Single", "Double"]
                    : ["1 BHK", "2 BHK", "3 BHK", "4 BHK"]
                  ).map((type) => (
                    <motion.div
                      key={type}
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <input
                        type="checkbox"
                        name="roomTypes"
                        value={type}
                        checked={filters.roomTypes.includes(type)}
                        onChange={handleFilterChange}
                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-3 text-sm text-gray-700 font-medium">
                        {type}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Price Range (per month)
              </label>
              <div className="space-y-6">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>${filters.priceMin.toLocaleString()}</span>
                  <span>${filters.priceMax.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  name="priceMin"
                  min="0"
                  max="20000"
                  step="100"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all duration-300"
                />
                <input
                  type="range"
                  name="priceMax"
                  min="0"
                  max="20000"
                  step="100"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all duration-300"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Amenities
              </label>
              <div className="space-y-4">
                {[
                  { key: "parkingAvailable", label: "Parking" },
                  { key: "kitchen", label: "Kitchen" },
                  { key: "housekeeping", label: "Housekeeping" },
                  { key: "electricityBackup", label: "Electricity Backup" },
                  { key: "laundryServices", label: "Laundry Services" },
                  { key: "securityGuard", label: "Security Guard" },
                  { key: "cctv", label: "CCTV" },
                ].map(({ key, label }) => (
                  <motion.div
                    key={key}
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="checkbox"
                      name="amenities"
                      value={key}
                      checked={filters.amenities.includes(key)}
                      onChange={handleFilterChange}
                      className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-3 text-sm text-gray-700 font-medium">
                      {label}
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 py-12 px-6 lg:px-10">
          <p className="text-gray-700 text-lg mb-8 font-medium">
            Total Listings: {filteredListings.length}
          </p>

          {filteredListings.length === 0 ? (
            <motion.p
              className="text-gray-600 text-xl text-center font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              No properties match your filters.
            </motion.p>
          ) : (
            <motion.div
              className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleCardClick(listing._id)}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                    borderColor: "#6366f1", // Indigo-600
                    transition: { duration: 0.3 },
                  }}
                >
                  {listing.image && listing.image.length > 0 ? (
                    <motion.img
                      src={listing.image[0]}
                      alt={listing.name || "Property"}
                      className="w-full h-56 object-cover transition-all duration-300 group-hover:brightness-110"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.1 }} // Image zoom on hover
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate transition-all duration-300 group-hover:text-indigo-600">
                      {listing.name || "Unnamed Property"}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm transition-all duration-300 group-hover:text-gray-700">
                      {listing.description || "No description available"}
                    </p>
                    <p className="text-indigo-600 font-bold text-lg mb-3 transition-all duration-300 group-hover:text-indigo-700">
                      ${listing.price ? listing.price.toLocaleString() : "N/A"}
                      /month
                    </p>
                    <div className="text-sm text-gray-500 space-y-1 transition-all duration-300 group-hover:text-gray-600">
                      <p>Location: {listing.location || "N/A"}</p>
                      <p>Category: {listing.category || "N/A"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;
