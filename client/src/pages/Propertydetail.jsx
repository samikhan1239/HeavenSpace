"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  CheckCircle,
  CreditCard,
} from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useSelector((state) => state.listings);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

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
          if (!res.ok)
            throw new Error(data.message || "Failed to fetch property");
          setProperty(data);
          setMainImage(data.image?.[0] || "https://via.placeholder.com/150");

          const similarRes = await fetch(
            `/api/user/listings?propertyType=${data.propertyType}`,
            {
              credentials: "include",
            }
          );
          const similarData = await similarRes.json();
          if (!similarRes.ok)
            throw new Error(
              similarData.message || "Failed to fetch similar properties"
            );

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
            img: "https://via.placeholder.com/150",
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

  const handleImageClick = (img) => setMainImage(img);

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

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate dummy payment (mock order creation)
  const initiatePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    // Mock order data (replace with actual backend call in production)
    const orderData = {
      id: `order_${Date.now()}`,
      amount: (property.price + (property.securityDeposit || 0)) * 100, // Amount in paise
      currency: "INR",
    };

    const options = {
      key: "rzp_test_9QndpvcdDDqBTk", // Replace with your Razorpay Test Key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Property Booking",
      description: `Payment for ${property.name}`,
      order_id: orderData.id,
      handler: function (response) {
        setPaymentStatus({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
        setShowOrderModal(false);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#4F46E5",
      },
      modal: {
        ondismiss: function () {
          setPaymentStatus({ error: "Payment window closed" });
          setShowOrderModal(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      setPaymentStatus({ error: response.error.description });
      setShowOrderModal(false);
    });
    rzp.open();
  };

  const resetPayment = () => {
    setPaymentStatus(null);
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.p
            className="mt-4 text-gray-600 font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-indigo-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Property Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            {error ||
              "We couldn't find the property you're looking for. It may have been removed or the link is incorrect."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 pt-8 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          className="mb-6 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="hover:text-indigo-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>{" "}
          {" > "}{" "}
          <span
            className="hover:text-indigo-600 cursor-pointer"
            onClick={() => navigate("/properties")}
          >
            Properties
          </span>{" "}
          {" > "}{" "}
          <span className="text-indigo-600 font-medium">
            {property.name || "Property Details"}
          </span>
        </motion.div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100">
              <div className="relative">
                <motion.img
                  src={mainImage}
                  alt={property.name || "Property"}
                  className="w-full h-[500px] object-cover object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
                <div className="absolute top-4 right-4 flex space-x-3">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-indigo-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-red-600"
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-indigo-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5 text-indigo-600" />
                  </motion.button>
                </div>
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
              <div className="p-4 border-t border-indigo-100">
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                  {property.image && property.image.length > 0 ? (
                    property.image.map((img, index) => (
                      <motion.div
                        key={index}
                        className={`relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden ${
                          mainImage === img ? "ring-2 ring-indigo-500" : ""
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleImageClick(img)}
                      >
                        <img
                          src={img || "https://via.placeholder.com/150"}
                          alt={`${property.name} - Thumbnail ${index + 1}`}
                          className="w-24 h-24 object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                        {mainImage === img && (
                          <div className="absolute inset-0 bg-indigo-500/10 border border-indigo-500"></div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="w-24 h-24 bg-indigo-50 flex items-center justify-center text-indigo-400 rounded-lg">
                      No Images
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-1"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 sticky top-4">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.name || "Unnamed Property"}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-blue-500" />
                    <p className="text-sm truncate">
                      {property.location || "Location not specified"}
                    </p>
                  </div>
                </div>
                <div className="mb-6 bg-indigo-50 p-4 rounded-xl">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  {property.discountPrice && (
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500 line-through">
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
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-gray-900 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Property Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {property.propertyType || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-900 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">For</p>
                      <p className="text-sm font-medium text-gray-900">
                        {property.genderPreference || "Any"}
                      </p>
                    </div>
                  </div>
                  {property.roomType && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-gray-900 mr-2 flex items-center justify-center">
                        <span className="text-xs font-bold">R</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Room Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {property.roomType}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.availableRooms && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-gray-900 mr-2 flex items-center justify-center">
                        <span className="text-xs font-bold">#</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Available Rooms</p>
                        <p className="text-sm font-medium text-gray-900">
                          {property.availableRooms}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.securityDeposit && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-gray-900 mr-2 flex items-center justify-center">
                        <span className="text-xs font-bold">₹</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Security Deposit
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{property.securityDeposit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-900 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-900">
                        {property.category || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <motion.button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-purple-700 transition-colors mb-4"
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
                <motion.button
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-green-700 hover:to-teal-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderModal(true)}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Book Now</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <motion.div
          className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-indigo-50 shadow-md rounded-full mt-8 mb-8 border border-indigo-100 overflow-hidden"
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
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          <motion.section
            ref={overviewRef}
            className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-3">
                <Home className="w-5 h-5" />
              </span>{" "}
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-900">
                    {property.propertyType || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-medium text-gray-900">
                    {property.roomType || "N/A"}
                  </span>
                </div>
                {(property.propertyType === "Room" ||
                  property.propertyType === "Hostel") && (
                  <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
                    <span className="text-gray-600">Rooms Available</span>
                    <span className="font-medium text-gray-900">
                      {property.availableRooms || "N/A"}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">
                    {property.category || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
                  <span className="text-gray-600">Gender Preference</span>
                  <span className="font-medium text-gray-900">
                    {property.genderPreference || "Any"}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
                  <span className="text-gray-600">Availability</span>
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

          <motion.section
            ref={pricingRef}
            className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-3">
                <span className="font-bold">₹</span>
              </span>{" "}
              Pricing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                  <p className="text-gray-600 mb-2">Monthly Rent</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  {property.discountPrice && (
                    <div className="mt-3 flex items-center">
                      <span className="text-sm text-gray-500 line-through">
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
                    className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center"
                    whileHover={{ backgroundColor: "#eef2ff" }}
                  >
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-medium text-gray-900">
                      ₹{property.securityDeposit.toLocaleString()}
                    </span>
                  </motion.div>
                )}
              </div>
              <div className="space-y-4">
                {property.listingType === "Broker" &&
                  property.brokeragePrice && (
                    <motion.div
                      className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center"
                      whileHover={{ backgroundColor: "#eef2ff" }}
                    >
                      <span className="text-gray-600">Brokerage Fee</span>
                      <span className="font-medium text-gray-900">
                        ₹{property.brokeragePrice.toLocaleString()}
                      </span>
                    </motion.div>
                  )}
                <div className="bg-indigo-50 rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Payment Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Month Rent</span>
                      <span className="font-medium text-gray-900">
                        ₹{property.price.toLocaleString()}
                      </span>
                    </div>
                    {property.securityDeposit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-medium text-gray-900">
                          ₹{property.securityDeposit.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {property.listingType === "Broker" &&
                      property.brokeragePrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brokerage Fee</span>
                          <span className="font-medium text-gray-900">
                            ₹{property.brokeragePrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                    <div className="border-t border-indigo-200 pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900">
                          Total Initial Payment
                        </span>
                        <span className="text-indigo-600">
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

          <motion.section
            ref={amenitiesRef}
            className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-3">
                <Sparkles className="w-5 h-5" />
              </span>{" "}
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
                    className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                      {icon}
                    </span>
                    <span className="font-medium text-gray-900">{label}</span>
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
                  className="col-span-full p-6 bg-indigo-50 rounded-xl text-center"
                  variants={fadeInUp}
                >
                  <p className="text-gray-500 italic">
                    No amenities listed for this property
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.section>

          <motion.section
            ref={furnishingRef}
            className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-3">
                <Home className="w-5 h-5" />
              </span>{" "}
              Furnishing
            </h2>
            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    property.furnishing === "Fully Furnished"
                      ? "bg-green-500"
                      : property.furnishing === "Semi Furnished"
                      ? "bg-yellow-500"
                      : property.furnishing === "Unfurnished"
                      ? "bg-gray-400"
                      : "bg-gray-300"
                  }`}
                ></div>
                <h3 className="text-lg font-medium text-gray-900">
                  {property.furnishing || "Furnishing details not specified"}
                </h3>
              </div>
              <p className="text-gray-600">
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

          <motion.section
            ref={contactRef}
            className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-3">
                <Phone className="w-5 h-5" />
              </span>{" "}
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-indigo-50 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {property.listingType === "Broker"
                    ? "Broker Details"
                    : "Owner Details"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-bold">
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
                      <p className="font-medium text-gray-900">
                        {property.listingType === "Broker"
                          ? property.brokerName || "Broker"
                          : property.ownerName || "Owner"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {property.listingType || "Direct Owner"}
                      </p>
                    </div>
                  </div>
                  {property.listingType === "Broker" ? (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-indigo-600 mr-3" />
                      <span className="text-gray-900">
                        {property.brokerContact ||
                          "Contact information not available"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-indigo-600 mr-3" />
                      <span className="text-gray-900">
                        {property.ownerContact ||
                          "Contact information not available"}
                      </span>
                    </div>
                  )}
                  {property.phoneNo && (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-indigo-600 mr-3" />
                      <span className="text-gray-900">{property.phoneNo}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Book This Property
                </h3>
                <motion.button
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderModal(true)}
                >
                  Pay Now
                </motion.button>
              </div>
            </div>
          </motion.section>

          {similarProperties.length > 0 && (
            <motion.section
              className="bg-white rounded-3xl shadow-md overflow-hidden border border-indigo-100 p-8"
              ref={sliderRef}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-3">
                    <Home className="w-5 h-5" />
                  </span>{" "}
                  Similar Properties
                </h2>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={handlePrevSlide}
                    className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={allImages.length <= 3}
                  >
                    <ChevronLeft className="w-5 h-5 text-indigo-600" />
                  </motion.button>
                  <motion.button
                    onClick={handleNextSlide}
                    className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={allImages.length <= 3}
                  >
                    <ChevronRight className="w-5 h-5 text-indigo-600" />
                  </motion.button>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex transition-all duration-500 ease-in-out"
                  animate={{
                    x: `-${
                      currentSlide *
                      (window.innerWidth < 768
                        ? 100
                        : window.innerWidth < 1024
                        ? 50
                        : 20)
                    }%`,
                  }}
                >
                  {property.images && property.images.length > 0 ? (
                    property.images.map((img, index) => (
                      <motion.div
                        key={id}
                        className="flex-shrink-0 px-2 w-full md:w-1/2 lg:w-1/5"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 hover:shadow-xl transition-shadow">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={img || "https://via.placeholder.com/150"}
                              alt={name || "Similar Property"}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150")
                              }
                            />
                            <div className="absolute bottom-2 left-2">
                              <span className="px-2 py-1 bg-indigo-50/90 backdrop-blur-sm text-xs font-medium rounded-full text-indigo-600">
                                Similar
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 truncate">
                              {name || "Unnamed Property"}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0 text-indigo-600" />
                              <p className="truncate">
                                {location || "Location not specified"}
                              </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <p className="font-bold text-indigo-600">
                                ₹{price.toLocaleString()}{" "}
                                <span className="text-xs font-normal text-gray-500">
                                  /mo
                                </span>
                              </p>
                              <motion.button
                                className="text-indigo-600 text-sm font-medium flex items-center"
                                whileHover={{ x: 3 }}
                                onClick={() => navigate(`/property/${id}`)}
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
                      <p className="text-gray-500">
                        No similar properties found
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
              {allImages.length > 3 && (
                <div className="flex justify-center mt-6 space-x-1">
                  {Array.from({
                    length: Math.max(
                      0,
                      allImages.length -
                        (window.innerWidth < 768
                          ? 0
                          : window.innerWidth < 1024
                          ? 1
                          : 4)
                    ),
                  }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "bg-indigo-600 w-4"
                          : "bg-indigo-300"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-lg overflow-hidden p-8 text-center text-white"
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
              Don’t miss out on this opportunity. Book now or contact the{" "}
              {property.listingType === "Broker" ? "broker" : "owner"} for more
              details.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOrderModal(true)}
              >
                Book Now
              </motion.button>
              <motion.button
                className="bg-indigo-500/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-600/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/properties")}
              >
                Explore More Properties
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Order Payment Modal */}
        {showOrderModal && !paymentStatus && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-indigo-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Book {property.name}
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Total Amount: ₹
                  {(
                    property.price + (property.securityDeposit || 0)
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Includes first month rent and security deposit (if
                  applicable).
                </p>
                <motion.button
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={initiatePayment}
                >
                  Pay Now
                </motion.button>
                <motion.button
                  className="w-full border border-indigo-500 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderModal(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Success/Failure Modal */}
        {paymentStatus && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-indigo-100 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {paymentStatus.paymentId ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your booking for{" "}
                    <span className="font-medium">{property.name}</span> has
                    been confirmed.
                  </p>
                  <div className="text-left space-y-2 mb-6">
                    <p>
                      <strong>Payment ID:</strong> {paymentStatus.paymentId}
                    </p>
                    <p>
                      <strong>Order ID:</strong> {paymentStatus.orderId}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Payment Failed
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {paymentStatus.error ||
                      "Something went wrong. Please try again."}
                  </p>
                </>
              )}
              <motion.button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetPayment}
              >
                {paymentStatus.paymentId ? "Back to Property" : "Try Again"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
