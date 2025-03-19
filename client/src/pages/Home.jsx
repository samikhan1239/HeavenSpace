"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/listings/listingSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { listings } = useSelector((state) => state.listings);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(setListings(data.listings));
        }
      } catch (err) {
        console.error("Error fetching listings:", err.message);
      }
    };
    fetchListings();
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col justify-center items-center text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg3.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <h1 className="text-6xl font-bold z-10 animate__animated animate__fadeInDown">
          Find Your Perfect Rental
        </h1>
        <p className="text-lg z-10 mt-4 animate__animated animate__fadeInUp">
          Explore rooms, hostels, and flats tailored to your needs.
        </p>
        <Link to="/listings">
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-200 mt-6 z-10 animate__animated animate__fadeInUp">
            Browse Listings
          </button>
        </Link>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 animate__animated animate__fadeIn">
            Featured Rentals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.slice(0, 6).map((listing) => (
              <div
                key={listing.id}
                className="shadow-lg rounded-lg overflow-hidden bg-white transition-transform transform hover:scale-105 animate__animated animate__fadeIn"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{listing.title}</h3>
                  <p className="text-gray-600">{listing.location}</p>
                  <Link
                    to={`/listings/${listing.id}`}
                    className="text-blue-600 font-medium hover:underline mt-2 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 animate__animated animate__fadeIn">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Affordable Prices",
                description: "Find rentals that fit your budget.",
              },
              {
                title: "Verified Listings",
                description: "All listings are verified for authenticity.",
              },
              {
                title: "24/7 Support",
                description: "We're here to help you anytime.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 shadow-lg rounded-lg bg-white transition-transform transform hover:scale-105 animate__animated animate__fadeIn"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn">
          Ready to Find Your New Home?
        </h2>
        <p className="mb-6 animate__animated animate__fadeIn">
          Join thousands of satisfied renters today!
        </p>
        <Link to="/listings">
          <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-200 animate__animated animate__fadeIn">
            Start Your Search
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 Your Rental Website. All rights reserved.
          </p>
          <p className="text-gray-500 mt-2">
            Contact us: support@yourrental.com | +1-800-RENTALS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
