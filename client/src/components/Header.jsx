import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 shadow-lg text-white">
      <div className="flex items-center justify-between w-full  p-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Logo - Left */}
          <motion.div
            className="flex items-center gap-4"
            variants={logoVariants}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
            >
              <span className="text-white text-3xl font-bold">HS</span>
            </motion.div>
          </motion.div>

          <Link to="/" className="flex items-center flex-shrink-0">
            <h1 className="font-extrabold text-xl sm:text-3xl flex items-center space-x-2 transition-all duration-300 hover:text-cyan-200">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">
                Heaven
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                Space
              </span>
            </h1>
          </Link>
        </div>

        {/* Search Form - Middle */}
        <form className="flex-grow mx-8 bg-white/10 backdrop-blur-md p-3 rounded-full flex items-center shadow-inner max-w-xs sm:max-w-md transition-all duration-300 hover:shadow-lg hover:bg-white/20">
          <input
            type="text"
            placeholder="Search rooms, flats, and hostels..."
            className="bg-transparent focus:outline-none text-white placeholder-gray-300 w-full"
          />
          <FaSearch className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer" />
        </form>

        {/* Navigation - Right */}
        <ul className="flex gap-6 items-center flex-shrink-0">
          <Link to="/">
            <li className="hidden sm:inline text-gray-200 font-medium hover:text-cyan-300 transition-all duration-300 hover:scale-110 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-gray-200 font-medium hover:text-cyan-300 transition-all duration-300 hover:scale-110 relative group">
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </li>
          </Link>
          <Link to="/admin">
            <li className="hidden sm:inline text-gray-200 font-medium hover:text-cyan-300 transition-all duration-300 hover:scale-110 relative group">
              Admin
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </li>
          </Link>
          <Link to="/sign-in">
            <li className="text-gray-200 font-medium hover:text-cyan-300 transition-all duration-300 hover:scale-110 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20">
              Sign In
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
