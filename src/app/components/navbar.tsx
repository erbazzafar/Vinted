"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, Inbox, Search, Bell, MessageSquare, Package, Percent, User, Settings, Wallet, Plus, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

interface DropdownOption {
  label: string;
  path: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface Notification {
  _id: string,
  subTitle: string,
  title: string,
  type: string
}

const Navbar = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const photoURL = Cookies.get("photourl")
  const isLoggedIn = Cookies.get("token") ? true : false
  const id = Cookies.get("userId")

  const handleLogout = () => {
    console.log("user Logged out");
    Cookies.remove("photourl")
    Cookies.remove("token")
    router.push('/')
  }

  const token = Cookies.get("token")

  // Profile Dropdown Options
  const dropdownOptions: DropdownOption[] = [
    { label: "Profile", path: `/seller/${id}`, icon: <User size={20} /> },
    { label: "Settings", path: "/user-setting", icon: <Settings size={20} /> },
    { label: "My Orders", path: "/orders", icon: <Package size={20} /> },
    { label: "Wallet", path: `/wallet`, icon: <Wallet size={20} /> },
    { label: "Logout", path: "#", icon: <LogOut size={20} />, onClick: handleLogout },
  ];

  // Mobile Dropdown Options
  const mobileDropdownOptions: DropdownOption[] = [
    { label: "Profile", path: `/seller/${id}`, icon: <User size={20} /> },
    { label: "My Orders", path: "/orders", icon: <Package size={20} /> },
    { label: "Wallet", path: `/wallet`, icon: <Wallet size={20} /> },
    { label: "Settings", path: "/user-setting", icon: <Settings size={20} /> },
    { label: "Sell Now", path: "/sell", icon: <Plus size={20} />, className: "bg-gray-800 text-white hover:bg-gray-700" },
    { label: "Logout", path: "#", icon: <LogOut size={20} />, onClick: handleLogout },
  ];

  // Notification Data
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([])

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare size={20} className="text-gray-700 dark:text-white" />;
      case "offer":
        return <Percent size={20} className="text-gray-700 dark:text-white" />;
      default:
        return <Bell size={20} className="text-gray-700 dark:text-white" />; // default icon
    }
  };


  useEffect(() => {
    const getNotifications = async () => {
      try {
        if (!token || !id) {
          return
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/viewAll?userId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log("Notification Response", response);
        setNotifications(response.data.data)

      } catch (error) {
        toast.error("error")
        return
      }
    }
    getNotifications()
  }, [token, id])

  const [counter, setCounter] = useState<any[]>([]);

  useEffect(() => {
    const unreadNotificationCounter = async () => {
      try {
        if (!id || !token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/countUnreadData?userId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          toast.error("Error fetching notifications");
          return;
        }
        console.log("counter notification response: ", response);
        
        setCounter(response.data.data); // must be an array
      } catch (error) {
        console.log("Notification error:", error);
      }
    };

    unreadNotificationCounter();
  }, [id, token]);

  // Updated hover behavior for profile dropdown
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  // Updated hover behavior for notification dropdown
  const handleNotifMouseEnter = () => setIsNotifOpen(true);
  const handleNotifMouseLeave = () => setIsNotifOpen(false);

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

  const handleSellNowClick = () => {
    if (!isLoggedIn) {
      toast.info("Please log in first to sell the items")
      router.push("/signup")
    } else {
      router.push("/sell")
    }
  }

  return (
    <nav className="bg-[#EBEBEB] dark:bg-gray-900 w-full shadow-md relative overflow-visible">
      <div className="lg:px-[50px] container mx-auto max-w-screen-2xl flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white">
          <Image
            src="/darkLogo.png"
            alt="AffariDoro"
            width={100}
            height={50}
            unoptimized
          />
        </Link>

        {/* Search Bar (Hidden on Mobile) */}
        <div className="relative w-[42%] xl:w-[52%] hidden md:block">
          <input
            type="text"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full py-2 pl-10 border border-gray-400 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Search..."
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 cursor-pointer" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!isLoggedIn ? (
            <Link href="/signup" className="text-[13px] text-gray-900 dark:text-white hover:text-gray-900 transition">
              Sign Up | Login
            </Link>
          ) : (
            <>
              <Link href={`/inbox/${id}`}>
                <Inbox size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition mt-1" />
              </Link>
              <Link href="/wishlist">
                <Heart size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition mt-1" />
              </Link>

              {/* Notification Dropdown */}
              <div
                className="relative"
                ref={notifRef}
                onMouseEnter={handleNotifMouseEnter}
                onMouseLeave={handleNotifMouseLeave}
              >
                <button className="p-2 rounded-lg flex items-center gap-2 relative cursor-pointer">
                  <Bell size={25} className="text-gray-700 dark:text-white mt-1" />
                  {counter.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-400 text-white text-[8px] px-2 py-1 rounded-full">
                      {counter.length}
                    </span>
                  )}
                </button>

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

                      {notifications.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notif) => (
                            <Link key={notif._id} href="#" className="block">
                              <button className="flex items-start gap-3 px-4 py-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                                  {getNotifIcon(notif.type)}
                                </div>
                                <div className="flex-1 text-left">
                                  <h4 className="text-gray-900 dark:text-white font-medium">{notif.title}</h4>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm">{notif.subTitle}</p>
                                </div>
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
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="p-3 rounded-lg flex items-center gap-2 cursor-pointer">
                  {(() => {
                    const type = Cookies.get("photoType");
                    let img = ""
                    if (type === "google") {
                      if (photoURL.includes("uploads/*")) {
                        img = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${photoURL}`
                      }
                      img = Cookies.get("googlePhoto")
                    } else if (type === "dummy") {
                      img = `/imageLogo2.jpg`
                    } else {
                      img = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${photoURL}`
                    }
                    return (<Image
                      src={img}
                      alt={"profile"}
                      width={10}
                      height={10}
                      unoptimized
                      className="w-8 h-8 rounded-full object-cover"
                    />)
                  })()}

                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-visible z-[1000]"
                    >
                      {dropdownOptions.map((option, index) =>
                        option.onClick ? (
                          <button
                            key={index}
                            onClick={option.onClick}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-black cursor-pointer ${option.className || ''}`}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ) : (
                          <Link
                            key={index}
                            href={option.path}
                            className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-black cursor-pointer ${option.className || ''}`}
                          >
                            {option.icon}
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

          <button
            onClick={handleSellNowClick}
            className="text-[13px] bg-gray-800 text-white px-6 py-1.5 rounded-lg transition duration-300 cursor-pointer hover:bg-gray-600"
          >
            Sell Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Inbox and Wishlist Icons */}
              <Link href={`/inbox/${id}`} className="p-2">
                <Inbox size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
              </Link>
              <Link href="/wishlist" className="p-2">
                <Heart size={25} className="text-gray-900 dark:text-white hover:text-gray-900 transition" />
              </Link>

              {/* Notification Bell for Mobile */}
              <div className="relative" ref={notifRef}>
                <button
                  className="p-2 rounded-lg flex items-center gap-2 relative cursor-pointer"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                >
                  <Bell size={25} className="text-gray-700 dark:text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-400 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown for Mobile */}
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden z-[1000]"
                    >
                      <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button
                          className="text-sm text-teal-600 dark:text-teal-400 cursor-pointer"
                          onClick={() => setNotifications([])}
                        >
                          Clear All
                        </button>
                      </div>
                      {notifications.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notif) => (
                            <Link key={notif._id} href="#" className="block">
                              <button className="flex items-start gap-3 px-4 py-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                                  {getNotifIcon(notif.type)}
                                </div>
                                <div className="flex-1 text-left">
                                  <h4 className="text-gray-900 dark:text-white font-medium">{notif.title}</h4>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm">{notif.subTitle}</p>
                                </div>
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

              {/* Profile Dropdown for Mobile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="p-2 rounded-lg cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Image
                    src={photoURL && photoURL.includes("uploads/")
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${photoURL}`
                      : photoURL || "default.png"}
                    alt={"profile"}
                    width={10}
                    height={10}
                    unoptimized
                    className="w-8 h-8 rounded-full" />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-visible z-[1000]"
                    >
                      {mobileDropdownOptions.map((option, index) =>
                        option.onClick ? (
                          <button
                            key={index}
                            onClick={option.onClick}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-black cursor-pointer ${option.className || ''}`}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ) : (
                          <Link
                            key={index}
                            href={option.path}
                            className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-black cursor-pointer ${option.className || ''}`}
                          >
                            {option.icon}
                            {option.label}
                          </Link>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signup" className="text-gray-900 dark:text-white hover:text-gray-900 transition">
                Sign Up
              </Link>
              <span className="text-gray-900 dark:text-white">|</span>
              <Link href="/login" className="text-gray-900 dark:text-white hover:text-gray-900 transition mr-3">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;