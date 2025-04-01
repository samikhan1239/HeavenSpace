import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/listings/listingSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search, ChevronDown, ChevronUp } from "lucide-react";

const AMENITIES = [
  { key: "parkingAvailable", label: "Parking" },
  { key: "kitchen", label: "Kitchen" },
  { key: "housekeeping", label: "Housekeeping" },
  { key: "electricityBackup", label: "Electricity Backup" },
  { key: "laundryServices", label: "Laundry Services" },
  { key: "securityGuard", label: "Security Guard" },
  { key: "cctv", label: "CCTV" },
];

function Property() {
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
    priceRange: [0, 50000], // Adjusted max range
    amenities: [],
  });
  const [mobileView, setMobileView] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    roomTypes: true,
    priceRange: true,
    amenities: true,
  });

  const filterRef = useRef(null);

  useEffect(() => {
    const checkMobileView = () => {
      setMobileView(window.innerWidth < 1024);
    };
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        mobileView
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileView]);

  useEffect(() => {
    if (!currentUser) {
      setError("Please log in to view properties.");
      setLoading(false);
      navigate("/sign-in");
      return;
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listings/admin", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        const data = await res.json();
        console.log("API Response:", data);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch listings");
        }

        const listingsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.listings)
          ? data.listings
          : Array.isArray(data.data)
          ? data.data
          : [];
        dispatch(setListings(listingsArray));
        setFilteredListings(listingsArray);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchListings();
  }, [dispatch, currentUser, navigate]);

  useEffect(() => {
    console.log("Raw Listings from Redux:", listings);
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
        listing.price >= filters.priceRange[0] &&
        listing.price <= filters.priceRange[1]
    );

    if (filters.amenities.length > 0) {
      filtered = filtered.filter((listing) =>
        filters.amenities.every((amenity) => listing[amenity])
      );
    }

    console.log("Filtered Listings:", filtered);
    setFilteredListings(filtered);
  }, [searchTerm, filters, listings]);

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      switch (type) {
        case "category":
          return {
            ...prev,
            categories: prev.categories.includes(value)
              ? prev.categories.filter((item) => item !== value)
              : [...prev.categories, value],
          };
        case "roomType":
          return {
            ...prev,
            roomTypes: prev.roomTypes.includes(value)
              ? prev.roomTypes.filter((item) => item !== value)
              : [...prev.roomTypes, value],
          };
        case "amenity":
          return {
            ...prev,
            amenities: prev.amenities.includes(value)
              ? prev.amenities.filter((item) => item !== value)
              : [...prev.amenities, value],
          };
        case "priceRangeMin":
          return {
            ...prev,
            priceRange: [Number(value), prev.priceRange[1]],
          };
        case "priceRangeMax":
          return {
            ...prev,
            priceRange: [prev.priceRange[0], Number(value)],
          };
        default:
          return prev;
      }
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      roomTypes: [],
      priceRange: [0, 50000],
      amenities: [],
    });
    setSearchTerm("");
  };

  const filterVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-red-50 border border-red-500 text-red-600 p-6 rounded-lg max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-semibold text-lg mb-2 text-red-700">
            Error Loading Properties
          </h3>
          <p>{error}</p>
          <button
            className="mt-4 border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-100"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-indigo-600">
          Find Your Perfect Home
        </h1>
        <div className="flex items-center gap-2">
          {mobileView && (
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-5 h-5" />
              <span className="sr-only">Toggle filters</span>
            </motion.button>
          )}
          {(filters.categories.length > 0 ||
            filters.roomTypes.length > 0 ||
            filters.amenities.length > 0 ||
            filters.priceRange[0] > 0 ||
            filters.priceRange[1] < 50000) && (
            <button
              className="hidden md:block border border-indigo-500 text-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-50"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <AnimatePresence>
          {(isFilterOpen || !mobileView) && (
            <motion.div
              ref={filterRef}
              className={`w-full lg:w-80 bg-white border-r border-gray-200 p-4 md:p-6 z-50 overflow-y-auto ${
                mobileView
                  ? "fixed inset-0 h-screen"
                  : "sticky top-0 h-[calc(100vh-4rem)]"
              }`}
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {mobileView && (
                  <button
                    className="text-gray-600 hover:text-gray-900 p-1"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </button>
                )}
              </div>

              {(filters.categories.length > 0 ||
                filters.roomTypes.length > 0 ||
                filters.amenities.length > 0) && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-600">
                      Applied Filters
                    </h3>
                    <button
                      className="text-indigo-600 hover:text-indigo-700 text-xs"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.categories.map((category) => (
                      <span
                        key={`cat-${category}`}
                        className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded flex items-center"
                      >
                        {category}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer text-indigo-600 hover:text-indigo-800"
                          onClick={() =>
                            handleFilterChange("category", category)
                          }
                        />
                      </span>
                    ))}
                    {filters.roomTypes.map((type) => (
                      <span
                        key={`type-${type}`}
                        className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded flex items-center"
                      >
                        {type}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleFilterChange("roomType", type)}
                        />
                      </span>
                    ))}
                    {filters.amenities.map((amenity) => {
                      const amenityLabel =
                        AMENITIES.find((a) => a.key === amenity)?.label ||
                        amenity;
                      return (
                        <span
                          key={`amenity-${amenity}`}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded flex items-center"
                        >
                          {amenityLabel}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer text-indigo-600 hover:text-indigo-800"
                            onClick={() =>
                              handleFilterChange("amenity", amenity)
                            }
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-4">
                  <button
                    className="flex justify-between items-center w-full text-left mb-4"
                    onClick={() => toggleSection("categories")}
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      Property Type
                    </h3>
                    {expandedSections.categories ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.categories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3">
                          {["Room", "Flat", "Hostel"].map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`category-${category}`}
                                checked={filters.categories.includes(category)}
                                onChange={() =>
                                  handleFilterChange("category", category)
                                }
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`category-${category}`}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {(filters.categories.includes("Room") ||
                  filters.categories.includes("Flat") ||
                  filters.categories.length === 0) && (
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      className="flex justify-between items-center w-full text-left mb-4"
                      onClick={() => toggleSection("roomTypes")}
                    >
                      <h3 className="text-sm font-semibold text-gray-900">
                        {filters.categories.includes("Room") &&
                        !filters.categories.includes("Flat")
                          ? "Room Type"
                          : filters.categories.includes("Flat") &&
                            !filters.categories.includes("Room")
                          ? "Flat Type"
                          : "Room/Flat Type"}
                      </h3>
                      {expandedSections.roomTypes ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections.roomTypes && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3">
                            {(filters.categories.includes("Room") ||
                              filters.categories.length === 0) && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="room-single"
                                    checked={filters.roomTypes.includes(
                                      "Single"
                                    )}
                                    onChange={() =>
                                      handleFilterChange("roomType", "Single")
                                    }
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="room-single"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                  >
                                    Single Room
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="room-double"
                                    checked={filters.roomTypes.includes(
                                      "Double"
                                    )}
                                    onChange={() =>
                                      handleFilterChange("roomType", "Double")
                                    }
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="room-double"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                  >
                                    Double Room
                                  </label>
                                </div>
                              </>
                            )}
                            {(filters.categories.includes("Flat") ||
                              filters.categories.length === 0) && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="flat-1bhk"
                                    checked={filters.roomTypes.includes(
                                      "1 BHK"
                                    )}
                                    onChange={() =>
                                      handleFilterChange("roomType", "1 BHK")
                                    }
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="flat-1bhk"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                  >
                                    1 BHK
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="flat-2bhk"
                                    checked={filters.roomTypes.includes(
                                      "2 BHK"
                                    )}
                                    onChange={() =>
                                      handleFilterChange("roomType", "2 BHK")
                                    }
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="flat-2bhk"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                  >
                                    2 BHK
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="flat-3bhk"
                                    checked={filters.roomTypes.includes(
                                      "3 BHK"
                                    )}
                                    onChange={() =>
                                      handleFilterChange("roomType", "3 BHK")
                                    }
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="flat-3bhk"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                  >
                                    3 BHK
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="flat-4bhk"
                                    checked={filters.roomTypes.includes(
                                      "4 BHK"
                                    )}
                                    onChange={() =>
                                      handleFilterChange("roomType", "4 BHK")
                                    }
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="flat-4bhk"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                  >
                                    4 BHK
                                  </label>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <button
                    className="flex justify-between items-center w-full text-left mb-4"
                    onClick={() => toggleSection("priceRange")}
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      Price Range (per month)
                    </h3>
                    {expandedSections.priceRange ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.priceRange && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-6">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              ₹{filters.priceRange[0].toLocaleString()}
                            </span>
                            <span>
                              ₹{filters.priceRange[1].toLocaleString()}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="range"
                              min="0"
                              max="50000"
                              step="500"
                              value={filters.priceRange[0]}
                              onChange={(e) =>
                                handleFilterChange(
                                  "priceRangeMin",
                                  e.target.value
                                )
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <input
                              type="range"
                              min="0"
                              max="50000"
                              step="500"
                              value={filters.priceRange[1]}
                              onChange={(e) =>
                                handleFilterChange(
                                  "priceRangeMax",
                                  e.target.value
                                )
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button
                    className="flex justify-between items-center w-full text-left mb-4"
                    onClick={() => toggleSection("amenities")}
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      Amenities
                    </h3>
                    {expandedSections.amenities ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.amenities && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3">
                          {AMENITIES.map(({ key, label }) => (
                            <div
                              key={key}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`amenity-${key}`}
                                checked={filters.amenities.includes(key)}
                                onChange={() =>
                                  handleFilterChange("amenity", key)
                                }
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`amenity-${key}`}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                              >
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Available Properties
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "property" : "properties"}{" "}
                found
              </p>
            </div>
            <div className="lg:hidden">
              <button
                className="flex items-center gap-2 border border-indigo-500 text-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-50"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12 px-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Search className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 max-w-md mb-6">
                We couldn't find any properties matching your current filters.
                Try adjusting your search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <div
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full cursor-pointer hover:border-indigo-500 transition-colors duration-300"
                    onClick={() => handleCardClick(listing._id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          listing.image?.[0] ||
                          "https://via.placeholder.com/400x600"
                        }
                        alt={listing.name || "Property"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/400x600")
                        }
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-bold text-lg">
                          ₹{listing.price.toLocaleString()}/month
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1 hover:text-indigo-600">
                        {listing.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="font-medium">{listing.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs border border-indigo-500 text-indigo-600 px-2 py-1 rounded">
                          {listing.category}
                        </span>
                        <span className="text-xs border border-indigo-500 text-indigo-600 px-2 py-1 rounded">
                          {listing.roomType}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex flex-wrap gap-2">
                      {listing.parkingAvailable && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Parking
                        </span>
                      )}
                      {listing.kitchen && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Kitchen
                        </span>
                      )}
                      {listing.securityGuard && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Security
                        </span>
                      )}
                      {listing.cctv && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          CCTV
                        </span>
                      )}
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
}

export default Property;
