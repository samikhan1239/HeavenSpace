"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Home,
  Users,
  Wifi,
  Car,
  Coffee,
  Sparkles,
  Battery,
  ShowerHead,
  Shield,
  Camera,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const { listings } = useSelector((state) => state.listings);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);

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
            foundProperty.image?.[0] || "/placeholder.svg?height=600&width=800"
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
          setMainImage(
            data.image?.[0] || "/placeholder.svg?height=600&width=800"
          );

          const similarRes = await fetch(
            `/api/user/listings?propertyType=${data.propertyType}`,
            {
              credentials: "include",
            }
          );
          const similarData = await similarRes.json();

          if (!similarRes.ok) {
            throw new Error(
              similarData.message || "Failed to fetch similar properties"
            );
          }

          const similarArray = Array.isArray(similarData)
            ? similarData
            : Array.isArray(similarData?.listings)
            ? similarData.listings
            : Array.isArray(similarData?.data)
            ? similarData.data
            : [];

          setSimilarProperties(
            similarArray.filter((item) => item._id !== data._id).slice(0, 5)
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
            img: "/placeholder.svg?height=300&width=400",
            name: similar.name,
            location: similar.location,
            price: similar.price,
            id: similar._id,
          },
        ]
  );

  useEffect(() => {
    if (allImages.length > 5) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (prev) => (prev + 1) % Math.max(1, allImages.length - 4)
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allImages]);

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const scrollToSection = (ref, section) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(section);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.max(0, allImages.length - 5) : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= Math.max(0, allImages.length - 5) ? 0 : prev + 1
    );
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.p
            className="mt-4 text-slate-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading property details...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Property Not Found
          </h3>
          <p className="text-slate-600 mb-6">
            {error ||
              "We couldn't find the property you're looking for. It may have been removed or the link is incorrect."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          className="mb-6 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="hover:text-primary cursor-pointer">Home</span>
          {" > "}{" "}
          <span className="hover:text-primary cursor-pointer">Properties</span>
          {" > "}{" "}
          <span className="text-primary font-medium">
            {property.name || "Property Details"}
          </span>
        </motion.div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
              {/* Main Image */}
              <div className="relative">
                <motion.img
                  src={mainImage}
                  alt={property.name || "Property"}
                  className="w-full h-[500px] object-cover object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=600&width=800";
                  }}
                />

                {/* Image Controls */}
                <div className="absolute top-4 right-4 flex space-x-3">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-slate-700"
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5 text-slate-700" />
                  </motion.button>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      property.availability === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {property.availability || "Status Unknown"}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {property.image && property.image.length > 0 ? (
                    property.image.map((img, index) => (
                      <motion.div
                        key={index}
                        className={`relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden ${
                          mainImage === img ? "ring-2 ring-primary" : ""
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleImageClick(img)}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${property.name} - Thumbnail ${index + 1}`}
                          className="w-24 h-24 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "/placeholder.svg?height=150&width=150";
                          }}
                        />
                        {mainImage === img && (
                          <div className="absolute inset-0 bg-primary/10 border border-primary"></div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-slate-400 rounded-lg">
                      No Images
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Property Info */}
          <motion.div
            className="lg:col-span-1"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 sticky top-4">
              <div className="p-6">
                {/* Property Title & Location */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {property.name || "Unnamed Property"}
                  </h1>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <p className="text-sm truncate">
                      {property.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-primary">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="text-slate-600 ml-1">/month</span>
                  </div>

                  {property.discountPrice && (
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-slate-500 line-through">
                        ₹
                        {(
                          property.price + property.discountPrice
                        ).toLocaleString()}
                      </span>
                      <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Save ₹{property.discountPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-slate-500">Property Type</p>
                      <p className="text-sm font-medium">
                        {property.propertyType || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-slate-500">For</p>
                      <p className="text-sm font-medium">
                        {property.genderPreference || "Any"}
                      </p>
                    </div>
                  </div>
                  {property.roomType && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-primary mr-2 flex items-center justify-center">
                        <span className="text-xs font-bold">R</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Room Type</p>
                        <p className="text-sm font-medium">
                          {property.roomType}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.availableRooms && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-primary mr-2 flex items-center justify-center">
                        <span className="text-xs font-bold">#</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">
                          Available Rooms
                        </p>
                        <p className="text-sm font-medium">
                          {property.availableRooms}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.securityDeposit && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-primary mr-2 flex items-center justify-center">
                        <span className="text-xs font-bold">₹</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">
                          Security Deposit
                        </p>
                        <p className="text-sm font-medium">
                          ₹{property.securityDeposit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-slate-500">Category</p>
                      <p className="text-sm font-medium">
                        {property.category || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <motion.button
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(contactRef, "contact")}
                >
                  <Phone className="w-5 h-5" />
                  <span>
                    Contact{" "}
                    {property.listingType === "Broker" ? "Broker" : "Owner"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <motion.div
          className="sticky top-0 z-10 bg-white shadow-sm rounded-full mt-8 mb-8 border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Overview", ref: overviewRef },
              { id: "pricing", label: "Pricing", ref: pricingRef },
              { id: "amenities", label: "Amenities", ref: amenitiesRef },
              { id: "furnishing", label: "Furnishing", ref: furnishingRef },
              { id: "contact", label: "Contact", ref: contactRef },
            ].map(({ id, label, ref }) => (
              <button
                key={id}
                onClick={() => scrollToSection(ref, id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === id
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview Section */}
          <motion.section
            ref={overviewRef}
            className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                <Home className="w-5 h-5" />
              </span>
              Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Type</span>
                  <span className="font-medium text-slate-900">
                    {property.propertyType || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Room Type</span>
                  <span className="font-medium text-slate-900">
                    {property.roomType || "N/A"}
                  </span>
                </div>
                {(property.propertyType === "Room" ||
                  property.propertyType === "Hostel") && (
                  <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Rooms Available</span>
                    <span className="font-medium text-slate-900">
                      {property.availableRooms || "N/A"}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Category</span>
                  <span className="font-medium text-slate-900">
                    {property.category || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Gender Preference</span>
                  <span className="font-medium text-slate-900">
                    {property.genderPreference || "Any"}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Availability</span>
                  <span
                    className={`font-medium ${
                      property.availability === "Available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {property.availability || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Pricing Section */}
          <motion.section
            ref={pricingRef}
            className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                <span className="font-bold">₹</span>
              </span>
              Pricing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 mb-6">
                  <p className="text-slate-600 mb-2">Monthly Rent</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-primary">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="text-slate-600 ml-1">/month</span>
                  </div>

                  {property.discountPrice && (
                    <div className="mt-3 flex items-center">
                      <span className="text-sm text-slate-500 line-through">
                        ₹
                        {(
                          property.price + property.discountPrice
                        ).toLocaleString()}
                      </span>
                      <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {Math.round(
                          (property.discountPrice /
                            (property.price + property.discountPrice)) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>

                {property.securityDeposit && (
                  <motion.div
                    className="bg-slate-50 rounded-xl p-4 flex justify-between items-center"
                    whileHover={{ backgroundColor: "#f8fafc" }}
                  >
                    <span className="text-slate-600">Security Deposit</span>
                    <span className="font-medium text-slate-900">
                      ₹{property.securityDeposit.toLocaleString()}
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                {property.listingType === "Broker" &&
                  property.brokeragePrice && (
                    <motion.div
                      className="bg-slate-50 rounded-xl p-4 flex justify-between items-center"
                      whileHover={{ backgroundColor: "#f8fafc" }}
                    >
                      <span className="text-slate-600">Brokerage Fee</span>
                      <span className="font-medium text-slate-900">
                        ₹{property.brokeragePrice.toLocaleString()}
                      </span>
                    </motion.div>
                  )}

                <div className="bg-slate-50 rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    Payment Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">First Month Rent</span>
                      <span className="font-medium">
                        ₹{property.price.toLocaleString()}
                      </span>
                    </div>

                    {property.securityDeposit && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Security Deposit</span>
                        <span className="font-medium">
                          ₹{property.securityDeposit.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {property.listingType === "Broker" &&
                      property.brokeragePrice && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Brokerage Fee</span>
                          <span className="font-medium">
                            ₹{property.brokeragePrice.toLocaleString()}
                          </span>
                        </div>
                      )}

                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-900">
                          Total Initial Payment
                        </span>
                        <span className="text-primary">
                          ₹
                          {(
                            property.price +
                            (property.securityDeposit || 0) +
                            (property.brokeragePrice || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Amenities Section */}
          <motion.section
            ref={amenitiesRef}
            className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                <Sparkles className="w-5 h-5" />
              </span>
              Amenities
            </h2>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  key: "parkingAvailable",
                  label: "Parking",
                  icon: <Car className="w-5 h-5" />,
                },
                {
                  key: "kitchen",
                  label: "Kitchen",
                  icon: <Coffee className="w-5 h-5" />,
                },
                {
                  key: "housekeeping",
                  label: "Housekeeping",
                  icon: <Sparkles className="w-5 h-5" />,
                },
                {
                  key: "electricityBackup",
                  label: "Power Backup",
                  icon: <Battery className="w-5 h-5" />,
                },
                {
                  key: "laundryServices",
                  label: "Laundry",
                  icon: <ShowerHead className="w-5 h-5" />,
                },
                {
                  key: "securityGuard",
                  label: "Security",
                  icon: <Shield className="w-5 h-5" />,
                },
                {
                  key: "cctv",
                  label: "CCTV",
                  icon: <Camera className="w-5 h-5" />,
                },
                {
                  key: "wifi",
                  label: "WiFi",
                  icon: <Wifi className="w-5 h-5" />,
                },
              ].map(({ key, label, icon }) =>
                property[key] ? (
                  <motion.div
                    key={key}
                    className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                      {icon}
                    </span>
                    <span className="font-medium">{label}</span>
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
                "wifi",
              ].every((key) => !property[key]) && (
                <motion.div
                  className="col-span-full p-6 bg-slate-50 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <p className="text-slate-500 italic">
                    No amenities listed for this property
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.section>

          {/* Furnishing Section */}
          <motion.section
            ref={furnishingRef}
            className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                <Home className="w-5 h-5" />
              </span>
              Furnishing
            </h2>

            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    property.furnishing === "Fully Furnished"
                      ? "bg-green-500"
                      : property.furnishing === "Semi Furnished"
                      ? "bg-yellow-500"
                      : property.furnishing === "Unfurnished"
                      ? "bg-slate-400"
                      : "bg-slate-300"
                  }`}
                ></div>
                <h3 className="text-lg font-medium text-slate-900">
                  {property.furnishing || "Furnishing details not specified"}
                </h3>
              </div>

              <p className="text-slate-600">
                {property.furnishing === "Fully Furnished"
                  ? "This property comes with all essential furniture and appliances for immediate move-in."
                  : property.furnishing === "Semi Furnished"
                  ? "This property includes some basic furniture and fixtures, but you may need to add some items."
                  : property.furnishing === "Unfurnished"
                  ? "This property does not include furniture or appliances. You'll need to furnish it yourself."
                  : "Contact the owner for more details about the furnishing status of this property."}
              </p>
            </div>
          </motion.section>

          {/* Contact Information Section */}
          <motion.section
            ref={contactRef}
            className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                <Phone className="w-5 h-5" />
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  {property.listingType === "Broker"
                    ? "Broker Details"
                    : "Owner Details"}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-bold">
                        {property.listingType === "Broker"
                          ? property.brokerName
                            ? property.brokerName.charAt(0).toUpperCase()
                            : "B"
                          : property.ownerName
                          ? property.ownerName.charAt(0).toUpperCase()
                          : "O"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {property.listingType === "Broker"
                          ? property.brokerName || "Broker"
                          : property.ownerName || "Owner"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {property.listingType || "Direct Owner"}
                      </p>
                    </div>
                  </div>

                  {property.listingType === "Broker" ? (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <span>
                        {property.brokerContact ||
                          "Contact information not available"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <span>
                        {property.ownerContact ||
                          "Contact information not available"}
                      </span>
                    </div>
                  )}

                  {property.phoneNo && (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <span>{property.phoneNo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  Send a Message
                </h3>

                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={3}
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    ></textarea>
                  </div>
                  <motion.button
                    type="button"
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.section>

          {/* Similar Properties Slider */}
          {similarProperties.length > 0 && (
            <motion.section
              className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-8"
              ref={sliderRef}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                    <Home className="w-5 h-5" />
                  </span>
                  Similar Properties
                </h2>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={handlePrevSlide}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={allImages.length <= 5}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={handleNextSlide}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={allImages.length <= 5}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <motion.div
                  className="flex transition-all duration-500 ease-in-out"
                  animate={{ x: `-${currentSlide * 20}%` }}
                >
                  {allImages.length > 0 ? (
                    allImages.map(({ img, name, location, price, id }) => (
                      <motion.div
                        key={id}
                        className="w-1/5 flex-shrink-0 px-2"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={name || "Similar Property"}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              onError={(e) => {
                                e.target.src =
                                  "/placeholder.svg?height=300&width=400";
                              }}
                            />
                            <div className="absolute bottom-2 left-2">
                              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full">
                                Similar
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-slate-900 truncate">
                              {name || "Unnamed Property"}
                            </h3>
                            <div className="flex items-center text-slate-500 text-sm mt-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <p className="truncate">
                                {location || "Location not specified"}
                              </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <p className="font-bold text-primary">
                                ₹{price.toLocaleString()}
                                <span className="text-xs font-normal text-slate-500">
                                  /mo
                                </span>
                              </p>
                              <motion.button
                                className="text-primary text-sm font-medium flex items-center"
                                whileHover={{ x: 3 }}
                              >
                                View <ArrowRight className="w-3 h-3 ml-1" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="w-full p-8 text-center">
                      <p className="text-slate-500">
                        No similar properties found
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {allImages.length > 5 && (
                <div className="flex justify-center mt-6 space-x-1">
                  {Array.from({
                    length: Math.max(0, allImages.length - 4),
                  }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "bg-primary w-4"
                          : "bg-slate-300"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* Call to Action */}
          <motion.div
            className="bg-gradient-to-r from-primary/80 to-primary rounded-3xl shadow-lg overflow-hidden p-8 text-center text-white"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div animate={pulseAnimation}>
              <h2 className="text-2xl font-bold mb-4">
                Ready to make this your new home?
              </h2>
            </motion.div>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Don't miss out on this opportunity. Contact the{" "}
              {property.listingType === "Broker" ? "broker" : "owner"} today to
              schedule a viewing or get more information.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(contactRef, "contact")}
              >
                Contact Now
              </motion.button>
              <motion.button
                className="bg-primary/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore More Properties
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
