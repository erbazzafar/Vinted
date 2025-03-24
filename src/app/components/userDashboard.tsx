"use client"
import { useState } from "react";
import { Home, Settings, User, Shield, Bell, Camera, PlusCircle } from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";


const pages = [
  { name: "Profile", icon: User },
  { name: "Settings", icon: Settings, content: "This is the Settings page." },
  { name: "Notifications", icon: Bell, content: "This is the Notifications page." },
  { name: "Security", icon: Shield, content: "This is the Security page." },
];

export default function Dashboard() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [profile, setProfile] = useState({
    photo: "", about: "", country: "", city: "", language: "English",  phoneNumber: "", email: "", fullName: "", gender: "", birthday: ""
  });

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  
  const handleProfileUpdate = () => {
    alert("Profile updated successfully!");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({ ...profile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-15 flex w-7xl mx-auto min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 ">
        <h2 className="text-xl font-semibold mt-2 mb-4 border-b-4">Setting</h2>
        <nav>
          <ul>
            {pages.map((page) => (
              <li
                key={page.name}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                  selectedPage.name === page.name ? "bg-gray-300" : ""
                }`}
                onClick={() => setSelectedPage(page)}
              >
                <page.icon className="w-5 h-5" />
                {page.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4 border-b-4">{selectedPage.name}</h1>
        <div className="bg-gray-50 gap-y-4 p-6 rounded-lg ">
          {selectedPage.name === "Profile" ? (
            <div className="space-y-9 ">
              {/* Profile Picture */}
              <div className=" flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Camera className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <input type="file" className="mt-2 hidden" id="photoUpload" onChange={handlePhotoChange} />
                <label htmlFor="photoUpload" className="mt-2 bg-gray-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-700">
                  Upload Photo
                </label>
              </div>
              {/* About Section */}
              <div>
                <label className=" block text-md font-medium">About you</label>
                <textarea
                  className="mt-2 w-full border p-2 rounded"
                  placeholder="Tell us more about yourself and your style"
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                />
              </div>

              {/* Phone Number */}

              <label className=" block text-md font-medium">Phone Number</label>
              <div className="flex items-center gap-2">
                <button className="bg-gray-100 px-7 py-2 rounded flex items-center gap-2" onClick={() => setIsPhoneModalOpen(true)}>
                  {profile.phoneNumber ? profile.phoneNumber : "Add Phone Number"} <PlusCircle className="w-7 h-7" />
                </button>
              </div>

              <Modal open={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)}>
              <Box
                  className="bg-white p-6 rounded-lg shadow-lg w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <h2 className="text-lg font-semibold mb-4">Add Phone Number</h2>
                  <input
                    type="text"
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
                    onClick={() => {
                      setProfile({ ...profile, phoneNumber });
                      setIsPhoneModalOpen(false);
                      setPhoneNumber("");
                    }}
                  >
                      Submit
                  </button>
                </Box>
            </Modal>



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
              {/* Update Profile Button */}
              <button
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={handleProfileUpdate}
              >
                Update Profile
              </button>
            </div>
          ) : (
            selectedPage.content
          )}
        </div>
      </main>
    </div>
  );
}
