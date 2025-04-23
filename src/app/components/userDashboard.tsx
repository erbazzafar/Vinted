"use client"
import { useEffect, useState } from "react";
import {Settings, User, Shield, Bell, Camera, PlusCircle, Menu, X } from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DatePicker} from "@heroui/react"
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios"
import { parseDate, CalendarDate } from "@internationalized/date";
import { useRouter } from "next/navigation";
import Image from "next/image";

const pages = [
  { name: "Profile", icon: User },
  { name: "Settings", icon: Settings, content: "This is the Settings page." },
  { name: "Notifications", icon: Bell, content: "This is the Notifications page." },
  { name: "Security", icon: Shield, content: "This is the Security page." },
];

export default function Dashboard() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [profile, setProfile] = useState({
    image: null as string | File | null, about: "", country: "United States", city: "", language: "English",  phone: "", emailLink: false, fullName: "", gender: "",   birthDay: null as string | null, 
  });
  const router = useRouter()

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [phone, setPhoneNumber] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("User Id: ",Cookies.get("userId"));
  const token = Cookies.get("token");
  const id = Cookies.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !token){
          console.log("user is not authenticated");
          return
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${id}`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status !== 200){
          console.log("server Error");
          return
        }

        setProfile(response.data.data)
        
      } catch (error) {
        toast.error("Error in Fetching the Data")
      }
    }
    fetchData()
  }, [id, token])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prevProfile) => ({ ...prevProfile, image: file }));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if(!token || !id){
        console.log("Id or Token not found");
        return
      }
      const formData = new FormData()
      
      formData.append("about", profile.about)
      formData.append("country", profile.country || "United States")
      formData.append("city", profile.city)
      console.log(formData.get("country"));
      
      formData.append("language", profile.language)
      formData.append("phone", profile.phone)
      // formData.append("emailLink", profile.emailLink? "true" : "false");
      formData.append("fullName", profile.fullName)
      formData.append("gender", profile.gender)
      formData.append("birthDay", profile.birthDay || "");

     if (profile.image) {
        formData.append("image", profile.image); // Append file object, not Data URL
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${id}`,
        formData,
        {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
        }
      )
      if (response.status !== 200){
        toast.error("profile not updated")
        return
      }

      toast.success(" Profile updated Successfully ")
      
    } catch (error) {
      toast.error("Error updating the Profile")
    }
  };

  const handleProfileDelete = async () => {
    try {
     
      if(!token || !id){
        console.log("No token | user not authenticated")
        return
      }
      console.log(id)
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/delete/${id}`)
      console.log("response: ", response);
      

      if(response.status === 200){
        toast.success("User Deleted Successfully")
        Cookies.remove("token")
        Cookies.remove("userId")
        router.push("/")
      }
      else {
        toast.error("User is NOT deleted")
      }
      
    } catch (error) {
      toast.error("Error deleting the profile")
    }
  };

  return (
    <div className="mt-0 md:mt-5 flex flex-col md:flex-row w-full mx-auto min-h-screen">
      {/* Mobile Menu Button */}
      <button 
        className={`md:hidden fixed top-32 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg ${isMobileMenuOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:relative z-40 w-64 bg-white p-5 transition-transform duration-300 ease-in-out
        h-screen md:h-auto`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mt-2 mb-4 border-b-4">Setting</h2>
          <button 
            className="md:hidden p-2 text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {pages.map((page) => (
              <li
                key={page.name}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                  selectedPage.name === page.name ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                  setSelectedPage(page);
                  setIsMobileMenuOpen(false);
                }}
              >
                <page.icon className="w-5 h-5" />
                {page.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white/5 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0">
        <h1 className="text-xl font-semibold mb-4 border-b-4">{selectedPage.name}</h1>
        <div className="bg-gray-50 gap-y-4 p-4 md:p-6 rounded-lg">
          {selectedPage.name === "Profile" ? (
            <div className="space-y-6 md:space-y-9">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                  {profile.image ? (
                    <Image
                      src={
                        typeof profile.image === "string"
                          ? profile.image.startsWith("http") 
                            ? profile.image
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${profile.image}`
                          : URL.createObjectURL(profile.image)
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Camera className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* File Input */}
                <input type="file" className="mt-2 hidden" id="photoUpload" onChange={handlePhotoChange} />
                <label htmlFor="photoUpload" className="mt-2 bg-gray-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-700 text-sm md:text-base">
                  Upload Photo
                </label>
              </div>

              {/* About Section */}
              <div>
                <label className="block text-md font-medium">About you</label>
                <textarea
                  className="mt-2 w-full border p-2 rounded"
                  placeholder="Tell us more about yourself and your style"
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="flex flex-col">
                  <label className="block text-md font-medium">Phone Number</label>
                  <button 
                    className="bg-gray-100 px-4 md:px-7 py-2 rounded flex items-center justify-between w-full"
                    onClick={() => setIsPhoneModalOpen(true)}>
                    {profile.phone ? profile.phone : "Add Phone Number"} <PlusCircle className="w-5 h-5 md:w-7 md:h-7"/>
                  </button>
                </div>

                {/* DatePicker */}
                <div className="flex flex-col">
                  <label className="block text-md font-medium">Birth Date</label>
                  <DatePicker
                    value={
                      profile.birthDay && /^\d{4}-\d{2}-\d{2}$/.test(profile.birthDay)
                        ? parseDate(profile.birthDay)
                        : null
                    }
                    onChange={(date: CalendarDate | null) => {
                      const formatted = date
                        ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
                        : null;
                      setProfile({ ...profile, birthDay: formatted });
                    }}
                    className="w-full min-w-0 z-50 bg-gray-100 cursor-pointer"
                    variant="underlined"
                    aria-label="Select your birth date"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-md font-medium">Gender</label>
                <select
                  className="mt-2 w-full border p-2 rounded"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Keep it secret</option>
                </select>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-md font-medium">Country</label>
                <select
                  className="mt-2 w-full border p-2 rounded"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-md font-medium">Town/City</label>
                <input
                  type="text"
                  className="mt-2 w-full border p-2 rounded"
                  placeholder="Enter your city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>

              {/* Language Preferences */}
              <div>
                <label className="block text-md font-medium">Language</label>
                <select
                  className="mt-2 w-full border p-2 rounded"
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Update Profile Button */}
                <button
                  className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
                  onClick={handleProfileUpdate}
                >
                  Update Profile
                </button>
                {/* Delete Profile Button */}
                <button
                  className="mt-4 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          ) : (
            selectedPage.content
          )}
        </div>

        {/* Phone Number Modal */}
        <Modal open={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)}>
          <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-lg font-semibold mb-4">Add Phone Number</h2>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
              onClick={() => {
                setProfile({ ...profile, phone });
                setIsPhoneModalOpen(false);
                setPhoneNumber("");
              }}
            >
              Submit
            </button>
          </Box>
        </Modal>

        {/* Delete Modal */}
        <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
          <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete Your Profile</h3>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full cursor-pointer"
              onClick={handleProfileDelete}
            >
              Delete Profile
            </button>
          </Box>
        </Modal>
      </main>
    </div>
  );
}
