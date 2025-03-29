import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default on mobile
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white shadow-2xl transition-all duration-300 ease-in-out z-50 lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent animate-pulse">
              Admin Hub
            </h2>
            <button
              className="lg:hidden p-2 rounded-full hover:bg-indigo-800 transition-colors"
              onClick={toggleSidebar}
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3">
              {[
                {
                  to: "/admin",
                  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                  label: "Home",
                },
                {
                  to: "/admin/create-listing",
                  icon: "M12 4v16m8-8H4",
                  label: "Create List",
                },
                {
                  to: "/admin/listing",
                  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  label: "View Listings",
                },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => handleNavigation(item.to)}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-white/10 shadow-lg text-white border border-indigo-500/50"
                          : "hover:bg-white/10 hover:shadow-md text-gray-200 hover:text-white"
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      />
                    </svg>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-indigo-800/50">
            <button
              className="w-full flex items-center p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              onClick={() => handleNavigation("/logout")}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className={`fixed top-4 left-4 z-50 p-3 bg-indigo-600 rounded-full text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 ${
          isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        } lg:hidden`}
        onClick={toggleSidebar} // Fixed: Added onClick to toggle sidebar
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 pt-16 p-6 lg:p-8 lg:pt-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-md">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-white shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 hover:shadow-lg"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => handleNavigation("/admin/create-listing")}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md flex items-center hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Quick Add
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
