"use client"
import { useEffect, useState } from "react";
import {Settings, User, FileText, Bell, Camera, PlusCircle, Menu, X } from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DatePicker } from "antd";
import moment from "moment";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios"
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PageType {
  name: string;
  icon: any;
  content?: ({ vacationMode, onVacationModeChange, notificationEnabled, onNotificationChange }: { 
    vacationMode: boolean;
    onVacationModeChange: (e: any) => void;
    notificationEnabled: boolean;
    onNotificationChange: (e: any) => void;
  }) => React.ReactNode;
  isLink?: boolean;
  path?: string;
}

const pages: PageType[] = [
  { name: "Profile", icon: User },
  { name: "Settings", icon: Settings, content: ({ vacationMode, onVacationModeChange, notificationEnabled, onNotificationChange }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div>
          <h3 className="font-medium">Vacation Mode</h3>
          <p className="text-sm text-gray-500">When enabled, your listings will be hidden from buyers</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={vacationMode}
            onChange={onVacationModeChange}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div>
          <h3 className="font-medium">Notifications</h3>
          <p className="text-sm text-gray-500">Receive notifications about your orders and messages</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notificationEnabled}
            onChange={onNotificationChange}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
        </label>
      </div>
    </div>
  )},
  { name: "Terms & Conditions", icon: FileText, content: () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="text-gray-600 mb-8">Last Updated: April 24, 2025</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Affare Doro. These terms and conditions outline the rules and regulations for the use of our e-commerce platform. 
            By accessing this website and using our services, you accept these terms and conditions in full. 
            Do not continue to use Affare Doro&apos;s website if you do not accept all of the terms and conditions stated on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
          <div className="space-y-3 text-gray-600">
            <p>To use our services, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old or have parental consent</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized account access</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate our terms.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Product Listings & Purchases</h2>
          <div className="space-y-3 text-gray-600">
            <h3 className="text-xl font-medium mb-2">3.1 Sellers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Must provide accurate product descriptions and images</li>
              <li>Are responsible for setting fair prices and shipping costs</li>
              <li>Must ship items within the specified timeframe</li>
              <li>Cannot list prohibited items or counterfeit goods</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.2 Buyers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Are responsible for reviewing product descriptions before purchase</li>
              <li>Must make prompt payments for ordered items</li>
              <li>Should contact sellers with questions before purchasing</li>
              <li>Accept our return and refund policies</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Payments & Pricing</h2>
          <div className="space-y-3 text-gray-600">
            <p>We accept payment method:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Major credit and debit cards</li>
            </ul>
            <p>All prices are in the displayed currency and include applicable taxes. Shipping costs are calculated at checkout.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Shipping & Delivery</h2>
          <div className="space-y-3 text-gray-600">
            <ul className="list-disc pl-6 space-y-2">
              <li>Sellers must ship items within 5 business days of order confirmation</li>
              <li>Shipping times vary based on location and selected shipping method</li>
              <li>Buyers are responsible for providing accurate shipping information</li>
              <li>Risk of loss transfers to buyer upon delivery</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Returns & Refunds</h2>
          <div className="space-y-3 text-gray-600">
            <p>Our return policy allows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>14 days to initiate a return from delivery date</li>
              <li>Items must be unused and in original condition</li>
              <li>Buyer pays return shipping unless item is defective</li>
              <li>Refunds processed within 5-7 business days after return receipt</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Privacy & Data Protection</h2>
          <div className="text-gray-600">
            <p className="mb-3">
              We collect and process personal data as outlined in our Privacy Policy. 
              By using our services, you consent to our data collection practices.
            </p>
            <p>We protect your data through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Secure payment processing</li>
              <li>Encrypted data transmission</li>
              <li>Regular security audits</li>
              <li>Strict data access controls</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on this website, including but not limited to text, graphics, logos, images, and software, 
            is the property of Vinted or its content suppliers and is protected by international copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Dispute Resolution</h2>
          <div className="space-y-3 text-gray-600">
            <p>In case of disputes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Buyers and sellers should first attempt direct resolution</li>
              <li>Our support team can mediate unresolved issues</li>
              <li>We reserve the right to make final decisions on disputes</li>
              <li>Legal proceedings subject to local jurisdiction</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-600">
            Vinted shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
            or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
            use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
          <div className="text-gray-600">
            <p className="mb-3">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email notifications</li>
              <li>Website announcements</li>
              <li>App notifications</li>
            </ul>
            <p className="mt-3">
              Continued use of our platform after changes constitutes acceptance of new terms.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p className="text-gray-600">
            For any questions or concerns regarding these terms, please contact our support team at:
            support@affaredoro.com
          </p>
        </section>
      </div>
    </div>
  )}
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
  const [vacationMode, setVacationMode] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  console.log("User Id: ",Cookies.get("userId"));
  const token = Cookies.get("token");
  const id = Cookies.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !token){
          console.log("user is not authenticated");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${id}`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status !== 200){
          console.log("server Error");
          return;
        }

        setProfile(response.data.data);
        setVacationMode(response.data.data.vacation || false);
        setNotificationEnabled(response.data.data.notifications || false);
        
      } catch (error) {
        toast.error("Error in Fetching the Data");
      }
    };
    fetchData();
  }, [id, token]);

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
      if (profile.image) {
        Cookies.set("photoType", "backend")
        Cookies.set("photourl", response?.data?.data.image)
      }

      
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

  const handleVacationModeChange = async (e) => {
    try {
      const newVacationMode = e.target.checked;
      
      if(!token || !id){
        toast.error("You must be logged in to change vacation mode");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${id}`,
        { vacation: newVacationMode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        setVacationMode(newVacationMode);
        toast.success(newVacationMode ? "Vacation mode enabled" : "Vacation mode disabled");
      }
    } catch (error) {
      toast.error("Error updating vacation mode");
    }
  };

  const handleNotificationChange = async (e) => {
    try {
      const newNotificationState = e.target.checked;
      
      if(!token || !id){
        toast.error("You must be logged in to change notification settings");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${id}`,
        { notifications: newNotificationState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        setNotificationEnabled(newNotificationState);
        toast.success(newNotificationState ? "Notifications enabled" : "Notifications disabled");
      }
    } catch (error) {
      toast.error("Error updating notification settings");
    }
  };

  return (
    <div className="mt-0 md:mt-5 flex flex-col md:flex-row w-full mx-auto min-h-screen">
      {/* Mobile Menu Button */}
      <button 
        className={`md:hidden fixed top-22 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg ${isMobileMenuOpen ? 'hidden' : 'block'}`}
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
                  setSelectedPage(page); // Update the selected page state
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
      <main className="flex-1 p-4 md:p-6 mt-10 md:mt-0">
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
                    value={profile.birthDay ? moment(profile.birthDay) : null}
                    onChange={(date) => {
                      const formatted = date ? date.format('YYYY-MM-DD') : null;
                      setProfile({ ...profile, birthDay: formatted });
                    }}
                    className="w-full min-w-0 bg-gray-300 cursor-pointer"
                    placeholder="Select birth date"
                    format="YYYY-MM-DD"
                    style={{ height: '40px' }}
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
          ) : typeof selectedPage.content === "function" ? (
            selectedPage.content({ 
              vacationMode,
              onVacationModeChange: handleVacationModeChange,
              notificationEnabled,
              onNotificationChange: handleNotificationChange
            })
          ) : null}
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
