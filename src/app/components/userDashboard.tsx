"use client"

import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { DatePicker } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, User, FileText, Camera, PlusCircle, Menu, X, Shield, ShieldCheck, Banknote } from "lucide-react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import KfcSetting from "@/components/kfc-setting";
import UserSettings from "@/components/user-settings";
import UserSettingsTermsCondition from "@/components/user-settings-terms-condition";
import UserAddBank from "./userAddBank";

const AuthenticityTab = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("user-token");

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/imageLogo2.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;
  };

  const statusClasses: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800 border border-gray-200",
    "in review": "bg-yellow-100 text-yellow-800 border border-yellow-200",
    authenticated: "bg-green-100 text-green-800 border border-green-200",
    decline: "bg-red-100 text-red-800 border border-red-200",
    "not authenticated": "bg-orange-100 text-orange-800 border border-orange-200",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    "in review": "In Review",
    authenticated: "Authenticated",
    decline: "Declined",
    "not authenticated": "Not Authenticated",
  };

  const paymentClasses: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    failed: "bg-red-100 text-red-700 border border-red-200",
  };

  const fetchAuthenticityRecords = useCallback(async () => {
    if (!token) {
      setError("Please log in to view authenticity requests.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticity/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecords(response.data?.data || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to fetch authenticity records.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAuthenticityRecords();
  }, [fetchAuthenticityRecords]);

  const renderStatusBadge = (status?: string) => {
    const normalized = status?.toLowerCase() || "pending";
    const className = statusClasses[normalized] || statusClasses.pending;
    const label = statusLabels[normalized] || normalized.replace(/\b\w/g, (char) => char.toUpperCase());
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{label}</span>;
  };

  const renderPaymentBadge = (status?: string) => {
    const normalized = status?.toLowerCase() || "pending";
    const className = paymentClasses[normalized] || "bg-gray-100 text-gray-700 border border-gray-200";
    const label = normalized.replace(/\b\w/g, (char) => char.toUpperCase());
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{label}</span>;
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return moment(date).format("DD MMM YYYY, hh:mm A");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Authenticity Applications</h2>
          <p className="text-sm text-gray-500">Track the verification status of the products you submitted.</p>
        </div>
        <button
          onClick={fetchAuthenticityRecords}
          className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
      ) : records.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-gray-900">No authenticity requests yet</p>
          <p className="mt-2 text-sm text-gray-500">
            Apply for authenticity from a product page. Your applications will appear here once submitted.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {records.map((record) => {
                const product = record?.productId;
                const seller = record?.sellerId;
                const productImage = Array.isArray(product?.image) ? product.image[0] : product?.image;
                return (
                  <tr key={record?._id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={getImageUrl(productImage)}
                            alt={product?.title || "Product image"}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product?.name || "Product"}</p>
                          {product?.price && (
                            <p className="text-sm text-gray-600">AED {Number(product.totalPrice).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                          <Image
                            src={getImageUrl(seller?.image)}
                            alt={seller?.username || "Seller image"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{seller?.username || seller?.fullName || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{renderStatusBadge(record?.status)}</td>
                    <td className="px-4 py-4">{renderPaymentBadge(record?.paymentStatus)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <p>Applied: {formatDate(record?.createdAt)}</p>
                      {record?.updatedAt && <p>Updated: {formatDate(record.updatedAt)}</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const pages = [
  { name: "Profile", icon: User },
  {
    name: "KYC", icon: Shield, content: () => (
      <KfcSetting />
    )
  },
  {
    name: "Authenticity", icon: ShieldCheck, content: () => (
      <AuthenticityTab />
    )
  },
  {
    name: "Settings", icon: Settings, content: ({ vacationMode, onVacationModeChange, notificationEnabled, onNotificationChange }) => (
      <UserSettings
        vacationMode={vacationMode}
        onVacationModeChange={onVacationModeChange}
        notificationEnabled={notificationEnabled}
        onNotificationChange={onNotificationChange}
      />
    )
  },
  // {
  //   name: "Terms & Conditions", icon: FileText, content: () => (
  //     <UserSettingsTermsCondition />
  //   )
  // },
  {
    name: "Add Withdraw Bank", icon: Banknote, content: () => (
      <UserAddBank />
    )
  }
];

export default function Dashboard() {

  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [profile, setProfile] = useState({
    image: null as string | File | null, about: "", country: "United States", city: "", language: "English", phone: "", emailLink: false, fullName: "", gender: "", birthDay: null as string | null,
  });
  const router = useRouter()

  const id = Cookies.get("userId");
  const token = Cookies.get("user-token");

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [phone, setPhoneNumber] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [vacationMode, setVacationMode] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.log("user is not authenticated");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status !== 200) {
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
      if (!id) {
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
      if (response.status !== 200) {
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

      if (!token || !id) {
        console.log("No token | user not authenticated")
        return
      }
      console.log(id)
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/delete/${id}`)
      console.log("response: ", response);


      if (response.status === 200) {
        toast.success("User Deleted Successfully")
        Cookies.remove("user-token")
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

      if (!token || !id) {
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

      if (!token || !id) {
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
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition ${selectedPage.name === page.name ? "bg-gray-300" : ""
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
                    {profile.phone ? profile.phone : "Add Phone Number"} <PlusCircle className="w-5 h-5 md:w-7 md:h-7" />
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
                  <option>Dubai</option>
                  <option>Sharjah</option>
                  <option>Abu Dhabi</option>
                  <option>Ajman</option>
                  <option>Um Al Quwain</option>
                  <option>Ras Al Khaimah</option>
                  <option>Fujairah</option>
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
                  <option>Arabic</option>
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
