import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapPin,
  FaMailBulk,
  FaPhone,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Mock co-founder data (single co-founder with branch and LinkedIn)
const coFounder = {
  name: "Sami Khan",
  role: "Co-Founder & CEO",
  branch: "Electronics and Instrumentation 2 year",
  image: "/sami1.jpg", // Replace with actual image path
  linkedin: "https://www.linkedin.com/in/sami-khan-6ba282294/", // Replace with actual LinkedIn profile
};

export default function Footer() {
  return (
    <footer className="py-8 bg-gradient-to-t from-gray-900 to-gray-800 text-white relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">HS</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Heaven Space
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-xs">
              Luxurious stays worldwide.
            </p>
            <ul className="text-gray-400 text-xs space-y-2">
              <li>✓ Premium accommodations</li>
              <li>✓ 24/7 customer support</li>
              <li>✓ Global presence</li>
              <li>✓ Affordable luxury</li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-base font-semibold mb-3 text-blue-300">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Rooms", "Hotels", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-base font-semibold mb-3 text-blue-300">
              Contact Us
            </h3>
            <address className="not-italic text-gray-400 text-sm space-y-2">
              <p className="flex items-center">
                <FaMapPin className="h-4 w-4 mr-2 text-blue-400" />
                123 Serenity Lane
              </p>
              <p className="flex items-center">
                <FaMailBulk className="h-4 w-4 mr-2 text-blue-400" />
                support@heavenspace.com
              </p>
              <p className="flex items-center">
                <FaPhone className="h-4 w-4 mr-2 text-blue-400" />
                +1-800-RENTALS
              </p>
            </address>
            <div className="flex space-x-3 mt-4">
              <motion.a
                href="https://www.facebook.com/profile.php?id=100039092656262"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300"
              >
                <FaFacebook className="h-6 w-6 text-white" />
                <span className="sr-only">Facebook</span>
              </motion.a>
              <motion.a
                href="https://www.instagram.com/sami_khan674/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#E4405F] hover:via-[#C13584] hover:to-[#833AB4] transition-all duration-300"
              >
                <FaInstagram className="h-6 w-6 text-white" />
                <span className="sr-only">Instagram</span>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/sami-khan-6ba282294/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[#0077B5] transition-all duration-300"
              >
                <FaLinkedin className="h-6 w-6 text-white" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Co-Founder Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              Co-Founder
            </h3>
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center space-y-4 bg-gray-800/50 p-6 rounded-xl hover:bg-gray-700/70 transition-all duration-300"
            >
              <div className="relative max-h-39 max-w-39 h-35 w-36 md:h-39 md:w-40 lg:h-30 lg:w-30 rounded-full overflow-hidden border-4 border-blue-400">
                <motion.img
                  src={coFounder.image || "/placeholder.svg"}
                  alt={coFounder.name}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="text-center">
                <motion.h4
                  initial={{ y: 5, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-semibold text-white"
                >
                  {coFounder.name}
                </motion.h4>
                <p className="text-base text-gray-400">{coFounder.role}</p>
                <p className="text-sm text-gray-500">{coFounder.branch}</p>
                <motion.a
                  href={coFounder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="mt-2 inline-flex items-center text-[#0077B5] text-sm hover:text-blue-300 transition-all duration-300"
                >
                  <FaLinkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Heaven Space. All rights reserved.</p>
        </div>
      </div>

      {/* Subtle Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-30 -z-10" />
    </footer>
  );
}
