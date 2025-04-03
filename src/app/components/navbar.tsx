"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, Inbox, Menu, Search, X, ChevronDown, ChevronUp, Bell, MessageSquare, Package, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const photoURL = Cookies.get("photourl")
  const namepic = Cookies.get("name0")
  const token = Cookies.get("token")
  console.log("token: ", token);
  const id = Cookies.get("userId")
  
  const handleLogout = () => {
    console.log("user Logged out");
    Cookies.remove("photourl")
    Cookies.remove("token")
    router.push('/')
  }


  // Profile Dropdown Options
  const dropdownOptions = [
    { label: "Profile", path: `/seller/${id}`},
    { label: "Settings", path: "/user-setting" },
    { label: "My Orders", path: "/orders" },
    { label: "Wallet", path: "/wallet" },
    { label: "Logout", path: "#", onClick: handleLogout },
  ];
  

  // Notification Data
  
  const notificationsData = [
    {
      id: 1,
      icon: <MessageSquare className="w-6 h-6 text-gray-500 dark:text-gray-300" />,
      message: "Product Inquiry from Kathryn",
      description: "Kathryn has sent you a message regarding a product inquiry.",
      link: "/messages/kathryn",
      time: "1 day ago",
    },
    {
      id: 2,
      icon: <Package className="w-6 h-6 text-gray-500 dark:text-gray-300" />,
      message: "Order Confirmation",
      description: "Your order has been placed successfully.",
      link: "/orders",
      time: "1 month ago",
    },
    {
      id: 3,
      icon: <Percent className="w-6 h-6 text-gray-500 dark:text-gray-300" />,
      message: "Exclusive Discount Offer",
      description: "Get 20% off on your next purchase!",
      link: "/offers",
      time: "1 day ago",
    },
    {
      id: 4,
      icon: <MessageSquare className="w-6 h-6 text-gray-500 dark:text-gray-300" />,
      message: "Message from Joana",
      description: "Joana has sent you a message. Tap to read!",
      link: "/offers",
      time: "2 days ago",
    },
    {
      id: 5,
      icon: <Percent className="w-6 h-6 text-gray-500 dark:text-gray-300" />,
      message: "Exclusive Discount Offer",
      description: "Get 20% off on your next purchase!",
      link: "/offers",
      time: "4 days ago",
    },
  ];

    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const [notifications, setNotifications] = useState(notificationsData)

    const clearNotifications = () => {
      setNotifications([]);
    };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#EBEBEB] dark:bg-gray-900 w-full shadow-md relative overflow-visible">
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
        {!token  ? (
            <Link href="/signup" className="text-gray-900 dark:text-white hover:text-gray-900 transition">
              Sign Up | Login
            </Link>
          ) : (
            <>
              <Link href="/inbox">
                <Inbox size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
              </Link>
              <Link href="/wishlist">
                <Heart size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
              </Link>

          {/* Notification Dropdown */}
          <div className="relative" ref={notifRef}>
            {/* 🔔 Notification Bell */}
            <button
              className="p-3 rounded-lg flex items-center gap-2 relative"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <Bell size={25} className="text-gray-700 dark:text-white" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-400 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* 🔥 Dropdown Menu */}
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-124 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden z-[1000]"
                >
                  <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      className="text-sm text-teal-600 dark:text-teal-400"
                      onClick={() => setNotifications([])}
                    >
                      Clear All
                    </button>
                  </div>

                  {/* 🔔 Notification Items */}
                  {notifications.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <Link key={notif.id} href={notif.link} className="block">
                          <button className="flex items-start gap-3 px-4 py-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                              {notif.icon}
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="text-gray-900 dark:text-white font-medium">{notif.message}</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">{notif.description}</p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
                          </button>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      No new notifications
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-3 rounded-lg flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img 
                src={photoURL || namepic}
                className="w-10 h-10 rounded-full" alt="Profile" />

              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg overflow-visible z-[1000]"
                >
                  {dropdownOptions.map((option, index) =>
                    option.onClick ? (
                      <button
                        key={index}
                        onClick={option.onClick} // ✅ Ensure it's called as a function reference
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black cursor-pointer border-t-2"
                         >
                        {option.label}
                      </button>
                    ) : (
                      <Link
                        key={index}
                        href={option.path}
                        className="block px-4 py-2 hover:bg-gray-100 text-black"
                      >
                        {option.label}
                      </Link>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </>
         )}

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
