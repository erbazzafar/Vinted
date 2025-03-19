"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, Inbox, Menu, Search, X, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Profile Dropdown Options
  const dropdownOptions = [
    { label: "Profile", path: "/seller" },
    { label: "Settings", path: "/settings" },
    { label: "My Orders", path: "/orders" },
    { label: "Wallet", path: "/wallet" },
    { label: "Log Out", path: "/logout" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="bg-[#EBEBEB] dark:bg-gray-900 w-full shadow-md relative">
      <div className="container mx-auto max-w-screen-2xl py-4 flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white">
          Brand
        </Link>

        {/* Search Bar (Hidden on Mobile) */}
        <div className="relative w-[45%] xl:w-[55%] hidden md:block">
          <input
            type="text"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full py-2 pl-10 border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Search..."
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 cursor-pointer" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/signup" className="text-gray-900 dark:text-white hover:text-gray-900 transition">
            Sign Up | Login
          </Link>
          <Link href="/inbox">
            <Inbox size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
          </Link>
          <Link href="/inbox">
            <Bell size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
          </Link>
          <Link href="/wishlist">
            <Heart size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-3 rounded-lg flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img src="pexels-alljos-1261422.jpg" className="w-10 h-10 rounded-full" alt="Profile" />
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg overflow-hidden"
                >
                  {dropdownOptions.map((option, index) => (
                    <Link key={index} href={option.path} className="block px-4 py-2 hover:bg-gray-100">
                      {option.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/sell" className="bg-gray-800 text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-gray-600">
            Sell Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-900 dark:text-white" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-6 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={26} />
        </button>

        {/* Mobile Links */}
        <nav className="mt-8 flex flex-col gap-4">
          <Link href="/signup" className="text-gray-900 dark:text-white hover:text-blue-500 transition" onClick={() => setIsMobileMenuOpen(false)}>
            Sign Up
          </Link>
          <Link href="/login" className="text-gray-900 dark:text-white hover:text-blue-500 transition" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </Link>
          <Link href="/sell" className="bg-gray-800 text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-gray-700 text-center" onClick={() => setIsMobileMenuOpen(false)}>
            Sell Now
          </Link>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
