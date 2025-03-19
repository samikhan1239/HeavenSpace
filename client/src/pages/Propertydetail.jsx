"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const PropertyDetail = () => {
  const { id } = useParams();
  const { listings } = useSelector((state) => state.listings);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const overviewRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);
  const amenitiesRef = useRef(null);
  const furnishingRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const foundProperty = listings.find((listing) => listing._id === id);
        if (foundProperty) {
          setProperty(foundProperty);
          setMainImage(
            foundProperty.image?.[0] || "https://via.placeholder.com/150"
          );
          setSimilarProperties(
            listings
              .filter(
                (listing) =>
                  listing.propertyType === foundProperty.propertyType &&
                  listing._id !== foundProperty._id
              )
              .slice(0, 5)
          );
        } else {
          const res = await fetch(`/api/user/listings/${id}`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch property");
          }
          setProperty(data);
          setMainImage(data.image?.[0] || "https://via.placeholder.com/150");
          const similarRes = await fetch(
            `/api/user/listings?propertyType=${data.propertyType}`,
            { credentials: "include" }
          );
          const similarData = await similarRes.json();
          setSimilarProperties(
            similarData.filter((item) => item._id !== data._id).slice(0, 5)
          );
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, listings]);

  // Flatten all images from similar properties into a single array
  const allImages = similarProperties.flatMap((similar) =>
    similar.image && similar.image.length > 0
      ? similar.image.map((img, index) => ({
          img,
          name: similar.name,
          location: similar.location,
          price: similar.price,
          id: `${similar._id}-${index}`,
        }))
      : [
          {
            img: "https://via.placeholder.com/150",
            name: similar.name,
            location: similar.location,
            price: similar.price,
            id: similar._id,
          },
        ]
  );

  // Continuous sliding for 5 images per slide
  useEffect(() => {
    if (allImages.length > 5) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
      }, 3000); // Slide every 3 seconds
      return () => clearInterval(interval);
    }
  }, [allImages]);

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
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

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.p
          className="text-red-500 text-2xl font-semibold bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error || "Property not found"}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Container */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Hero Section */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="p-4">
              <motion.img
                src={mainImage}
                alt={property.name || "Property"}
                className="w-full h-[550px] object-contain rounded-2xl shadow-lg bg-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div
                className="flex space-x-4 mt-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {property.image && property.image.length > 0 ? (
                  property.image.map((img, index) => (
                    <motion.img
                      key={index}
                      src={img}
                      alt={`${property.name} - Thumbnail ${index + 1}`}
                      className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                        mainImage === img
                          ? "border-indigo-500 shadow-md"
                          : "border-gray-200"
                      } hover:opacity-90`}
                      onClick={() => handleImageClick(img)}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                  ))
                ) : (
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
                    No Images
                  </div>
                )}
              </motion.div>
            </div>
            <div className="p-10 flex flex-col justify-between">
              <div>
                <motion.h1
                  className="text-5xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {property.name || "Unnamed Property"}
                </motion.h1>
                <motion.p
                  className="text-gray-600 text-xl mt-4 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {property.location || "N/A"}
                </motion.p>
                <motion.p
                  className="text-indigo-600 font-bold text-4xl mt-6 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  ${property.price.toLocaleString()}/month
                </motion.p>
                <motion.p
                  className="text-gray-700 mt-3 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <span className="font-semibold">Category:</span>{" "}
                  {property.category || "N/A"}
                </motion.p>
              </div>
              <motion.button
                className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => scrollToSection(contactRef)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Contact {property.listingType === "Broker" ? "Broker" : "Owner"}
              </motion.button>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 flex flex-wrap justify-center gap-6 border-t border-gray-200"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: "Overview", ref: overviewRef },
              { label: "Pricing", ref: pricingRef },
              { label: "Amenities", ref: amenitiesRef },
              { label: "Furnishing", ref: furnishingRef },
              { label: "Contact", ref: contactRef },
            ].map(({ label, ref }) => (
              <motion.button
                key={label}
                onClick={() => scrollToSection(ref)}
                className="text-indigo-600 font-semibold text-lg hover:bg-indigo-100 px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>

          {/* Overview Section */}
          <motion.div
            ref={overviewRef}
            className="p-10 border-t border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-700 text-lg">
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {property.propertyType || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Room Type:</span>{" "}
                {property.roomType || "N/A"}
              </p>
              {(property.propertyType === "Room" ||
                property.propertyType === "Hostel") && (
                <p>
                  <span className="font-semibold">Rooms Available:</span>{" "}
                  {property.availableRooms || "N/A"}
                </p>
              )}
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {property.category || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Gender Preference:</span>{" "}
                {property.genderPreference || "Any"}
              </p>
              <p>
                <span className="font-semibold">Availability:</span>{" "}
                <span
                  className={
                    property.availability === "Available"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {property.availability || "N/A"}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            ref={pricingRef}
            className="p-10 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Pricing
            </h2>
            <div className="space-y-6 text-gray-700 text-lg">
              <p className="text-indigo-600 font-bold text-4xl">
                ${property.price.toLocaleString()}/month
              </p>
              {property.discountPrice && (
                <p className="text-green-600 font-semibold text-2xl">
                  Discount: ${property.discountPrice.toLocaleString()}/month
                </p>
              )}
              {property.securityDeposit && (
                <p>
                  <span className="font-semibold">Deposit:</span> $
                  {property.securityDeposit.toLocaleString()}
                </p>
              )}
              {property.listingType === "Broker" && property.brokeragePrice && (
                <p>
                  <span className="font-semibold">Brokerage:</span> $
                  {property.brokeragePrice.toLocaleString()}
                </p>
              )}
            </div>
          </motion.div>

          {/* Amenities Section */}
          <motion.div
            ref={amenitiesRef}
            className="p-10 border-t border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: "parkingAvailable", label: "Parking", icon: "🚗" },
                { key: "kitchen", label: "Kitchen", icon: "🍳" },
                { key: "housekeeping", label: "Housekeeping", icon: "🧹" },
                { key: "electricityBackup", label: "Power Backup", icon: "🔋" },
                { key: "laundryServices", label: "Laundry", icon: "🧼" },
                { key: "securityGuard", label: "Security", icon: "🛡️" },
                { key: "cctv", label: "CCTV", icon: "📹" },
              ].map(({ key, label, icon }) =>
                property[key] ? (
                  <motion.div
                    key={key}
                    className="bg-indigo-50 p-5 rounded-xl shadow-md flex items-center space-x-4 hover:bg-indigo-100 transition-all duration-300"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span className="text-3xl">{icon}</span>
                    <p className="text-gray-800 font-medium text-lg">{label}</p>
                  </motion.div>
                ) : null
              )}
              {[
                "parkingAvailable",
                "kitchen",
                "housekeeping",
                "electricityBackup",
                "laundryServices",
                "securityGuard",
                "cctv",
              ].every((key) => !property[key]) && (
                <div className="bg-indigo-50 p-5 rounded-xl shadow-md">
                  <p className="text-gray-500 italic text-lg">
                    No amenities listed
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Furnishing Section */}
          <motion.div
            ref={furnishingRef}
            className="p-10 border-t border-gray-100 bg-gray-50"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Furnishing
            </h2>
            <p className="text-gray-700 text-lg font-medium">
              {property.furnishing || "Furnishing details not specified"}
            </p>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            ref={contactRef}
            className="p-10 border-t border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Contact Information
            </h2>
            <div className="space-y-6 text-gray-700 text-lg">
              <p>
                <span className="font-semibold">Listed By:</span>{" "}
                {property.listingType || "Direct Owner"}
              </p>
              {property.listingType === "Broker" && (
                <>
                  <p>
                    <span className="font-semibold">Broker:</span>{" "}
                    {property.brokerName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {property.brokerContact || "N/A"}
                  </p>
                </>
              )}
              {property.listingType === "Direct Owner" && (
                <>
                  <p>
                    <span className="font-semibold">Owner:</span>{" "}
                    {property.ownerName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {property.ownerContact || "N/A"}
                  </p>
                </>
              )}
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {property.phoneNo || "N/A"}
              </p>
            </div>
          </motion.div>

          {/* Similar Properties Slider - 5 Images Per Slide */}
          {similarProperties.length > 0 && (
            <motion.div
              className="p-10 border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50"
              ref={sliderRef}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                Similar{" "}
                {property.propertyType === "Room" ? "Rooms" : "Properties"}
              </h2>
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex"
                  animate={{ x: `-${currentSlide * 20}%` }} // Move by 20% (1 card) per slide
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ width: `${allImages.length * 20}%` }} // Total width for all cards
                >
                  {allImages.map(({ img, name, location, price, id }) => (
                    <motion.div
                      key={id}
                      className="w-1/5 flex-shrink-0 px-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <img
                          src={img}
                          alt={name || "Similar Property"}
                          className="w-full h-40 object-contain bg-gray-100 hover:scale-105 transition-transform duration-500"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {name || "Unnamed Property"}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {location || "N/A"}
                          </p>
                          <p className="text-indigo-600 font-bold mt-2">
                            ${price.toLocaleString()}/month
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  className="flex justify-center mt-6 space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {Array.from({
                    length: Math.max(0, allImages.length - 4),
                  }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        currentSlide === index ? "bg-indigo-600" : "bg-gray-300"
                      } transition-all duration-300`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.div
            className="p-10 border-t border-gray-100 flex justify-center bg-gradient-to-r from-gray-50 to-indigo-50"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-full font-semibold text-xl shadow-xl hover:from-indigo-700 hover:to-purple-700"
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              Explore More Properties
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;
