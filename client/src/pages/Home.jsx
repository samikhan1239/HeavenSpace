"use client"; // Assuming this is a client-side component in Next.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/listings/listingSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapPin,
  FaArrowRight,
  FaX,
  FaBars,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaBuilding,
  FaUsers,
  FaCalendar,
} from "react-icons/fa6";
import {
  FaChevronCircleRight,
  FaMailBulk,
  FaUserCircle,
  FaPhone,
} from "react-icons/fa";

// Mock data (replace with actual data or props as needed)
const heroSlides = [
  {
    title: "Find Your Perfect Space",
    subtitle: "Explore rooms, hostels, and hotels tailored to your needs.",
    image: "/hero-bg8.jpg",
  },
  {
    title: "Luxury Living Awaits",
    subtitle: "Discover premium accommodations with top amenities.",
    image: "/hero-bg11.jpg",
  },
  {
    title: "Affordable Comfort",
    subtitle: "Quality stays at prices that fit your budget.",
    image: "/hero-bg10.jpg",
  },
];
const coFounders = [
  {
    name: "Alexandra Lee",
    role: "Co-Founder & CEO",
    image: "/cofounder1.jpg", // Replace with actual image path
  },
  {
    name: "James Carter",
    role: "Co-Founder & CTO",
    image: "/cofounder2.jpg", // Replace with actual image path
  },
];

const features = [
  {
    title: "Prime Locations",
    description: "Stay in the heart of the city or serene retreats.",
    icon: <FaMapPin className="h-8 w-8 text-cyan-400" />,
  },
  {
    title: "Trusted Hosts",
    description: "Connect with verified property owners.",
    icon: <FaUserCircle className="h-8 w-8 text-cyan-400" />,
  },
  {
    title: "Easy Booking",
    description: "Book your stay in just a few clicks.",
    icon: <FaArrowRight className="h-8 w-8 text-cyan-400" />,
  },
];

// Mock destinations
const destinations = [
  {
    name: "Vallabh Nagar",
    properties: 100,
    image: "/val.png",
    icon: <FaMapPin className="h-5 w-5" />,
  },
  {
    name: "New Palasia",
    properties: 85,
    image: "/pal.jpg",
    icon: <FaMapPin className="h-5 w-5" />,
  },
  {
    name: "LIG Square",
    properties: 95,
    image: "/lig.jpg",
    icon: <FaMapPin className="h-5 w-5" />,
  },
  {
    name: "Bhawarkua",
    properties: 70,
    image: "/bho.jpg",
    icon: <FaMapPin className="h-5 w-5" />,
  },
];

// Mock how it works
const howItWorks = [
  {
    title: "Search",
    description: "Find accommodations that match your preferences.",
    icon: <FaMapPin className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Select",
    description: "Choose from a variety of verified listings.",
    icon: <FaUsers className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Book",
    description: "Secure your stay with a simple booking process.",
    icon: <FaCalendar className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Enjoy",
    description: "Relax and enjoy your perfect space.",
    icon: <FaStar className="h-10 w-10 text-blue-500" />,
  },
];

// Mock testimonials

// Assuming this is part of your component with state
const testimonials = [
  {
    content: "An amazing experience! The booking was seamless.",
    name: "Jane Doe",
    role: "Traveler",
    image: "/user1.jpg",
  },
  {
    content: "Luxury at its best. Highly recommend Heaven Space!",
    name: "John Smith",
    role: "Business Owner",
    image: "/user2.jpg",
  },
  {
    content: "The perfect stay - comfortable and affordable!",
    name: "Emily Chen",
    role: "Freelancer",
    image: "/user3.jpg",
  },
  {
    content: "Exceptional service and stunning properties!",
    name: "Michael Brown",
    role: "Photographer",
    image: "/user4.jpg",
  },
  {
    content: "Heaven Space made my trip unforgettable!",
    name: "Sarah Johnson",
    role: "Teacher",
    image: "/user5.jpg",
  },
  {
    content: "Best accommodation I've ever had!",
    name: "Alex Carter",
    role: "Designer",
    image: "/user6.jpg",
  },
];

// Mock FAQs

// Assuming this is part of your component with state

const faqs = [
  {
    question: "How do I book a stay with Heaven Space?",
    answer:
      "Simply browse our listings, select your preferred property, and follow the easy booking steps online.",
  },

  {
    question: "Are pets allowed in the properties?",
    answer:
      "Pet policies vary by property. Check the listing details or contact us for clarification.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Reach out via our 24/7 chat, email at support@heavenspace.com, or call our hotline.",
  },
  {
    question: "Is there a minimum stay requirement?",
    answer:
      "Most properties have a 1-night minimum, but some may require longer stays during peak seasons.",
  },
  {
    question: "Do you offer discounts for long-term stays?",
    answer:
      "Yes, many hosts offer weekly or monthly discounts. Check the listing for details.",
  },
];

// Assuming this is part of your component
const partners = [
  { name: "Partner 1", image: "/brand1.jpeg" },
  { name: "Partner 2", image: "/brand6.jpeg" },
  { name: "Partner 3", image: "/brand7.jpeg" },
  { name: "Partner 4", image: "/brand3.jpeg" },
  { name: "Partner 5", image: "/brand8.jpeg" },
];

// Mock featured listings for slider
const featuredListings = [
  {
    id: 1,
    title: "Cozy NYC Loft",
    location: "New York",
    price: "$120/night",
    image: "/listing1.jpg",
    rating: "4.8",
    reviews: "150",
  },
  {
    id: 2,
    title: "Parisian Charm",
    location: "Paris",
    price: "$150/night",
    image: "/listing2.jpg",
    rating: "4.9",
    reviews: "200",
  },
  {
    id: 3,
    title: "Tokyo Retreat",
    location: "Tokyo",
    price: "$100/night",
    image: "/listing3.jpg",
    rating: "4.7",
    reviews: "120",
  },
  {
    id: 4,
    title: "Sydney Beach House",
    location: "Sydney",
    price: "$180/night",
    image: "/listing4.jpg",
    rating: "4.85",
    reviews: "180",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listings } = useSelector((state) => state.listings);
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/user/listings", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) dispatch(setListings(data.listings));
      } catch (err) {
        console.error("Error fetching listings:", err.message);
      }
    };
    fetchListings();
  }, [dispatch]);

  // Auto-slide for Featured Listings
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedSlide((prev) => (prev + 1) % featuredListings.length);
    }, 5000); // Slide every 5 seconds
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);
  // Group listings into sets of 4
  const groupedListings = [];
  for (let i = 0; i < listings.length; i += 4) {
    groupedListings.push(listings.slice(i, i + 4));
  }

  // Handler to check authentication before navigation
  const handleLinkClick = (e, to) => {
    if (!currentUser) {
      e.preventDefault();
      navigate("/sign-in");
    }
  };

  // Check if user is admin or superadmin
  const isAdmin = currentUser && currentUser.role === "admin";
  const isSuperAdmin = currentUser && currentUser.role === "superadmin";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Navigation */}

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence initial={false}>
            {heroSlides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ x: index > currentSlide ? "100%" : "-100%" }}
                animate={{
                  x:
                    index === currentSlide
                      ? 0
                      : index > currentSlide
                      ? "100%"
                      : "-100%",
                }}
                exit={{ x: "-100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: index === currentSlide ? 10 : 0 }}
              >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="object-cover w-full h-full brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-20 flex flex-col items-center justify-center h-full">
          <AnimatePresence mode="wait">
            {heroSlides.map(
              (slide, index) =>
                index === currentSlide && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.6, -0.05, 0.01, 0.99],
                    }}
                    className="space-y-6 text-center"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: [0.6, -0.05, 0.01, 0.99],
                      }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4,
                        ease: [0.6, -0.05, 0.01, 0.99],
                      }}
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto drop-shadow-md"
                    >
                      {slide.subtitle}
                    </motion.p>
                  </motion.div>
                )
            )}
          </AnimatePresence>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="mt-10 flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/listings"
              onClick={(e) => handleLinkClick(e, "/listings")}
              className="relative bg-blue-600 text-white font-semibold py-5 px-10 rounded-full hover:bg-blue-700 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span className="relative z-10">Browse Listings</span>
              <motion.span
                className="absolute inset-0 bg-blue-500 rounded-full opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={(e) => handleLinkClick(e, "/admin")}
                className="bg-green-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-green-700 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Admin Dashboard
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                to="/super-admin"
                onClick={(e) => handleLinkClick(e, "/super-admin")}
                className="bg-purple-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-purple-700 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Super Admin Dashboard
              </Link>
            )}
          </motion.div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-10 shadow-md"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover why thousands trust Heaven Space for their accommodation
              needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBuilding className="h-14 w-14 text-blue-600" />,
                value: "500+",
                label: "Properties Available",
                gradient: "from-blue-100 to-blue-200",
                color: "text-blue-600",
              },
              {
                icon: <FaUsers className="h-14 w-14 text-green-600" />,
                value: "10K+",
                label: "Happy Customers",
                gradient: "from-green-100 to-green-200",
                color: "text-green-600",
              },
              {
                icon: <FaMapPin className="h-14 w-14 text-purple-600" />,
                value: "50+",
                label: "Cities Covered",
                gradient: "from-purple-100 to-purple-200",
                color: "text-purple-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 * index,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
                className={`relative bg-gradient-to-br ${stat.gradient} p-8 rounded-3xl shadow-lg text-center transform transition-all duration-300 overflow-hidden group`}
              >
                {/* Background Decorative Element */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <div
                    className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-${
                      stat.color.split("-")[1]
                    }-300 blur-3xl`}
                  ></div>
                </div>

                {/* Icon Container */}
                <div className="relative z-10 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-md mx-auto"
                  >
                    {stat.icon}
                  </motion.div>
                </div>

                {/* Value */}
                <motion.h3
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index + 0.2 }}
                  className={`text-5xl md:text-6xl font-extrabold ${stat.color} mb-3`}
                >
                  {stat.value}
                </motion.h3>

                {/* Label */}
                <p className="text-gray-700 text-lg font-medium relative z-10">
                  {stat.label}
                </p>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-10 bg-gradient-to-b from-blue-50 to-white relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-purple-100 text-purple-600 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
              Explore Destinations
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 ">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover amazing accommodations in these trending locations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative h-96 rounded-2xl overflow-hidden group shadow-xl transform transition-all duration-300"
              >
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center mb-3">
                    {destination.icon}
                    <h3 className="text-2xl font-bold ml-3">
                      {destination.name}
                    </h3>
                  </div>
                  <p className="text-white/90 text-base">
                    {destination.properties} properties
                  </p>
                  <button className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-md w-full py-3 rounded-lg text-white font-semibold transition-all duration-300">
                    Explore
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}

      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative z-10 overflow-hidden">
        <div className="w-full px-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="text-center mb-16 relative"
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
              }}
              className="inline-block bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-md animate-gradient"
            >
              Simple Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: "easeOut",
              }}
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 tracking-tight"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: "easeOut",
              }}
              className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Effortlessly secure your dream stay in just a few steps
            </motion.p>
            {/* Background Glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl -z-10"
            />
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.2,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="relative bg-white p-6 rounded-xl shadow-md text-center transform group overflow-hidden border border-gray-100 hover:border-blue-200/50"
              >
                {/* Connecting Line */}
                {index < howItWorks.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                    className="hidden lg:block absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 z-0"
                  >
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                      whileHover={{ scale: 1.2 }}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-purple-400 w-3 h-3"
                    >
                      <FaChevronRight />
                    </motion.div>
                  </motion.div>
                )}

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                    whileHover={{
                      scale: 1.15,
                      rotate: 5,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }}
                    className="mx-auto mb-6 h-16 w-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-inner border border-blue-100/30 group-hover:shadow-lg"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, color: "#9333ea" }}
                      transition={{ duration: 0.3 }}
                      className="text-blue-600"
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                    whileHover={{ brightness: 1.25 }}
                    className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight"
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                    className="text-gray-600 text-sm leading-relaxed font-medium"
                  >
                    {step.description}
                  </motion.p>
                </div>

                {/* Modern Hover Effects */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform origin-center"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CSS for Gradient Animation */}
        <style jsx>{`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 4s ease infinite;
          }
        `}</style>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-blue-50 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
              Our Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 tracking-tight">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide the best accommodations with premium amenities and
              exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}

      <section
        className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative z-10 overflow-hidden"
        id="testimonials"
      >
        <div className="w-full px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center mb-16 relative"
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 tracking-tight"
            >
              What Our Guests Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Hear from travelers who love Heaven Space
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-10 -z-10"
            />
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100/50 relative overflow-hidden transform transition-all duration-300 group"
              >
                {/* Star Rating */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  className="flex justify-center mb-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </motion.div>

                {/* Testimonial Content */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                  className="text-gray-800 text-base italic text-center mb-6 font-light leading-relaxed line-clamp-3"
                >
                  "{testimonial.content}"
                </motion.p>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 shadow-md border border-gray-200/50">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </motion.div>

                {/* Hover Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}

      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center mb-16 relative"
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Get answers to your questions about Heaven Space
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full blur-3xl opacity-10 -z-10"
            />
          </motion.div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * index,
                  ease: "easeOut",
                }}
                className="mb-4"
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-6 rounded-xl flex justify-between items-center transition-all duration-300 ${
                    activeAccordion === index
                      ? "bg-white shadow-lg border border-indigo-200"
                      : "bg-white/70 hover:bg-white hover:shadow-md border border-gray-100/50"
                  }`}
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeAccordion === index ? (
                      <FaChevronUp className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <FaChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {activeAccordion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden bg-white px-6 pb-6 rounded-b-xl shadow-lg border border-t-0 border-indigo-200"
                    >
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-gray-700 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}

      <section className="py-16 bg-gradient-to-br from-white to-blue-50 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center mb-12 relative"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight"
            >
              Our Trusted Partners
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Collaborating with the best to bring you exceptional experiences
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-10 -z-10"
            />
          </motion.div>

          {/* Partners Grid */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.1,
                  y: -10,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                }}
                className=" transition-all duration-300 rounded-lg overflow-hidden bg-white p-4 shadow-md hover:shadow-lg border border-gray-100/50 group"
              >
                <motion.img
                  src={partner.image || "/placeholder.svg"}
                  alt={partner.name}
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                  className="h-16 w-auto max-w-[120px] object-contain transition-transform duration-300"
                />
                {/* Optional Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-medium text-center py-1 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0"
                >
                  {partner.name}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Stay Updated with Heaven Space
            </h2>
            <p className="text-white/80 mb-8">
              Subscribe to our newsletter for exclusive deals and travel
              inspiration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-grow relative">
                <FaMailBulk className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 py-3 bg-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-white/60 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready to Find Your New Home?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied renters today!
            </p>
            <Link
              to="/listings"
              onClick={(e) => handleLinkClick(e, "/listings")}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-200 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Search
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default Home; // Added export statement
