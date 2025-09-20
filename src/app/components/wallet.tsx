"use client";

import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Backdrop } from "@mui/material";
import { Eye, Package, Truck, Users, Archive, Tag } from "lucide-react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

function Wallet() {

  const router = useRouter();

  const userId = Cookies.get("userId");
  const token = Cookies.get("user-token");

  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)

  const [accountNumber, setAccountNo] = useState("")
  const [routingNumber, setRoutingNo] = useState("")
  const [fullName, setFullName] = useState<string>("")

  const [wallet, setWallet] = useState<{
    wallet: {
      available: number;
      pending: number;
    };
  } | null>(null);

  const [soldProducts, setSoldProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  const [labelPdf, setLabelPdf] = useState(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Tab state for filtering sold products
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const getUserWallet = async () => {
      try {
        if (!userId || !token) {
          toast.error("User ID or token is missing. Please log in again.");
          router.push("/signup");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/get?id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          toast.error("Failed to fetch user wallet data. Please try again later.");
          return;
        }

        setWallet(response.data.data);
      } catch (error) {
        toast.error("Error fetching user wallet data. Please try again later.");
      }
    };
    getUserWallet();
  }, [userId, token]);

  const fetchSoldProducts = async () => {
    try {
      if (!userId || !token) {
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/getAll?toUserId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        toast.error("Failed to fetch sold products. Please try again later.");
        return;
      }

      setSoldProducts(response.data.data);

    } catch (error) {
      toast.error("Error listing the sold Products. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSoldProducts();
  }, [userId, token]);



  const handleAddBank = async () => {
    try {
      if (!userId || !token) {
        toast.error("token Expires. Login again")
        return
      }
      if (!accountNumber || !routingNumber) {
        toast.error("All fields are required");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/add-bank`,
        {
          accountNumber,
          routingNumber,
          userId,
          fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("Error adding the bank")
      toast.error("Error adding the bank")
      return
    }
  }

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pickup Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pickup Completed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Inscan At Hub":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Reached At Hub":
        return "bg-violet-100 text-violet-800 border-violet-200";
      case "Out For Delivery":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Undelivered":
        return "bg-red-100 text-red-800 border-red-200";
      // Keep existing statuses for backward compatibility
      case "order_confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "on_the_way":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOrderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "Pickup Scheduled":
        return "Pickup Scheduled";
      case "Pickup Completed":
        return "Pickup Completed";
      case "Inscan At Hub":
        return "Inscan At Hub";
      case "Reached At Hub":
        return "Reached At Hub";
      case "Out For Delivery":
        return "Out For Delivery";
      case "Delivered":
        return "Delivered";
      case "Undelivered":
        return "Undelivered";
      // Keep existing statuses for backward compatibility
      case "order_confirmed":
        return "Order Confirmed";
      case "cancelled":
        return "Cancelled";
      case "returned":
        return "Returned";
      case "on_the_way":
        return "On the Way";
      case "delivered":
        return "Delivered";
      default:
        return status || "Unknown";
    }
  };

  // Function to get return status display text
  const getReturnStatus = (order: any) => {
    if (!order?.returnStatus || order?.returnStatus.trim() === '') {
      return "No Return";
    }
    return order.returnStatus;
  };

  // Function to get return status background color
  const getReturnStatusBackgroundColor = (returnStatus: string) => {
    switch (returnStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pickup Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pickup Completed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Inscan At Hub":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Reached At Hub":
        return "bg-violet-100 text-violet-800 border-violet-200";
      case "Out For Delivery":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Undelivered":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Function to get the appropriate status for tracking (returnStatus for Returns tab, orderStatus for others)
  const getTrackingStatus = (order: any) => {
    if (activeTab === "Returns" && order?.returnStatus) {
      return order.returnStatus;
    }
    return order?.orderStatus;
  };

  const CustomBackdrop = (props: any) => (
    <Backdrop
      {...props}
      className="!bg-[rgba(0,0,0,0.1)] !backdrop-blur-sm"
    />
  );

  const LabelBackdrop = (props: any) => (
    <Backdrop
      {...props}
      className="!bg-[rgba(0,0,0,0.5)]"
    />
  );

  const fn_getLabel = async (orderId: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delivery/label/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status === 200) {
        const data = response?.data?.data;
        setLabelPdf(data)
        // Try to fetch the PDF as a blob for preview and download (supports auth)
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.labelPath || ""}`;
        try {
          const blobResp = await axios.get(pdfUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          });
          const objectUrl = URL.createObjectURL(blobResp.data);
          setPdfBlobUrl(objectUrl);
        } catch (blobErr) {
          // Fallback to direct URL if blob fetch fails
          setPdfBlobUrl(null);
        }
        setIsLabelModalOpen(true);
        toast.success(response?.data?.message || "Label generated successfully.");
      }
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Error generating label. Please try again later.");
    }
  }

  const handleDownloadLabel = async () => {
    try {
      if (pdfBlobUrl) {
        const link = document.createElement("a");
        link.href = pdfBlobUrl;
        link.download = `${labelPdf?.trackingNumber || "label"}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }
      const directUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${labelPdf?.labelPath || ""}`;
      const blobResp = await axios.get(directUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      const objectUrl = URL.createObjectURL(blobResp.data);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${labelPdf?.trackingNumber || "label"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      toast.error("Failed to download label. Please try again.");
    }
  }

  const closeLabelModal = () => {
    setIsLabelModalOpen(false);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  }

  // Filter sold products based on selected tab
  const filteredSoldProducts = soldProducts.filter((soldProd: any) => {
    if (activeTab === "All") {
      return true;
    } else if (activeTab === "Ongoing") {
      return soldProd.orderStatus === "pending" ||
        soldProd.orderStatus === "Pickup Scheduled" ||
        soldProd.orderStatus === "Pickup Completed" ||
        soldProd.orderStatus === "Inscan At Hub" ||
        soldProd.orderStatus === "Reached At Hub" ||
        soldProd.orderStatus === "Out For Delivery" ||
        soldProd.orderStatus === "order_confirmed" ||
        soldProd.orderStatus === "on_the_way";
    } else if (activeTab === "Completed") {
      return (soldProd.orderStatus === "Delivered" ||
        soldProd.orderStatus === "completed" ||
        soldProd.orderStatus === "delivered") &&
        (!soldProd.returnStatus || soldProd.returnStatus.trim() === '');
    } else if (activeTab === "Cancelled / Undelivered") {
      return soldProd.orderStatus === "Undelivered" ||
        soldProd.orderStatus === "cancel" ||
        soldProd.orderStatus === "cancelled" ||
        soldProd.orderStatus === "Cancelled";
    } else if (activeTab === "Returns") {
      return soldProd.returnStatus && soldProd.returnStatus.trim() !== '';
    }
    return true;
  });


  return (
    <div className="bg-white mt-[-18px] sm:mt-15 w-full">
      <div className="container mx-auto max-w-screen-2xl lg:px-[50px] py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4 sm:m-0 mb-6">
          {/* Available Balance Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Balance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-900">${wallet?.wallet?.available}</p>
                <p className="text-sm text-gray-500 mt-1">Ready to withdraw</p>
              </div>
              {wallet?.wallet?.available > 0 && (
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Add Bank
                </button>
              )}
            </div>
          </div>


          {/* Add Bank Modal */}
          <Modal open={isBankModalOpen} onClose={() => setIsBankModalOpen(false)}>
            <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h3 className="text-xl font-semibold mb-4 text-center">Add Bank Information</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddBank();
                }}
                className="space-y-4"
              >
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    placeholder="Enter your routing number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNo(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition cursor-pointer"
                >
                  Submit
                </button>
              </form>
            </Box>
          </Modal>

          {/* Pending Balance Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Balance</h2>
            <p className="text-4xl font-bold text-red-500">${wallet?.wallet?.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Will be available in 1-3 business days</p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex justify-between p-2 rounded-md mb-8 mt-8 flex-wrap gap-2">
          {["All", "Ongoing", "Completed", "Cancelled / Undelivered", "Returns"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 rounded-md font-medium cursor-pointer sm:text-sm sm:py-1 ${activeTab === tab ? "border-b-2 border-gray-800 text-gray-700" : "text-gray-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sold Products */}
        <div className="bg-white rounded-lg shadow-md px-4 py-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sold Products</h2>
          </div>

          {filteredSoldProducts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredSoldProducts.map((soldProd: any) => (
                <div
                  key={soldProd?._id}
                  className="flex justify-between items-center px-2 py-1 border rounded-lg shadow bg-white"
                >
                  {/* Image + Name & Price */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${soldProd?.productId?.[0]?.image?.[0]}`}
                      alt={soldProd?.productId?.[0]?.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-[13px] font-semibold">{soldProd?.productId?.[0]?.name}</h2>
                      <p className="text-[12px] text-red-500">Price: ${soldProd?.total}</p>
                    </div>
                  </div>

                  {/* Status + Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    {!soldProd?.arrangeDelivery && (
                      <button
                        className="bg-[#333333] h-[30px] text-[13px] font-[500] px-[15px] rounded-[10px] text-white cursor-pointer hover:bg-[#4e4e4e] transition duration-300"
                        onClick={() => router.push(`/arrange-delivery?orderId=${soldProd?._id}`)}
                      >
                        <Package size={16} className="inline-block mt-[-2px] me-[7px]" />
                        Arrange Delivery
                      </button>
                    )}
                    {soldProd?.arrangeDelivery && soldProd?.orderStatus !== "Cancelled" && soldProd?.orderStatus !== "Delivered" && (
                      <button
                        className="bg-[#741e1e] h-[30px] text-[13px] font-[500] px-[15px] rounded-[10px] text-white cursor-pointer hover:bg-[#6f4141] transition duration-300"
                        onClick={() => fn_getLabel(soldProd?._id)}
                      >
                        <Tag size={16} className="inline-block mt-[-2px] me-[7px]" />
                        Generate Label
                      </button>
                    )}
                    <span className={`text-[12px] sm:text-[13px] rounded-md px-2 py-1 sm:px-3 border ${activeTab === "Returns" && soldProd?.returnStatus ? getReturnStatusBackgroundColor(soldProd?.returnStatus) : getStatusBackgroundColor(soldProd?.orderStatus)}`}>
                      {activeTab === "Returns" && soldProd?.returnStatus ? getReturnStatus(soldProd) : getOrderStatus(soldProd?.orderStatus)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOrderForTracking(soldProd);
                        setIsTrackModalOpen(true);
                      }}
                      className="cursor-pointer text-white text-[12px] sm:text-[13px] bg-blue-600 px-2 py-1 sm:px-3 rounded-md hover:bg-blue-700 transition duration-300"
                      title="Track Order"
                    >
                      <Truck size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(soldProd);
                        setIsProductModalOpen(true);
                      }}
                      className="cursor-pointer text-white text-[12px] sm:text-[13px] bg-gray-600 px-2 py-1 sm:px-3 rounded-md hover:bg-gray-500 transition duration-300"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  {/* Product View Modal */}
                  <Modal
                    open={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    closeAfterTransition
                    slots={{ backdrop: CustomBackdrop }}
                  >
                    <Box className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[92%] sm:w-[500px] max-h-[90vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedProduct?.productId?.[0]?.image?.[0]}`}
                        alt={selectedProduct?.productId?.[0]?.name || "Product Image"}
                        width={55}
                        height={50}
                        unoptimized
                        className="w-full h-48 sm:h-64 rounded-md object-contain"
                      />

                      <div className="bg-gray-100 grid grid-cols-1 sm:grid-cols-2 border-2 my-4">
                        <div className="p-3">
                          <h2 className="text-[13px] font-semibold">Seller Information:</h2>
                          <p className="text-[13px] text-gray-700">Product Name: {selectedProduct?.productId?.[0]?.name}</p>
                          <p className="text-[13px] text-gray-700">Price: {selectedProduct?.total}</p>
                          <p className="text-[13px] text-gray-700">Platform Fee: {selectedProduct?.buyerFee}</p>
                          <p className="text-[13px] mb-1 text-green-700">Receivable: {selectedProduct?.subTotal || selectedProduct?.total}</p>
                        </div>
                        <div className="p-3">
                          <h2 className="text-[13px] font-semibold">Buyer Information:</h2>
                          <p className="text-[13px] text-gray-700">Name: {selectedProduct?.fullName}</p>
                          <p className="text-[13px] text-gray-700">Address: {selectedProduct?.address1}</p>
                          <p className="text-[13px] text-gray-700">City: {selectedProduct?.city || "N/A"}</p>
                          <p className="text-[13px] text-gray-700">Country: {selectedProduct?.country || "N/A"}</p>
                        </div>
                      </div>


                    </Box>
                  </Modal>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {activeTab === "All"
                ? "No Products Sold / No Pending Balance."
                : `No products found in ${activeTab.toLowerCase()} category.`
              }
            </p>
          )}
        </div>
      </div>

      {/* Label PDF Modal */}
      <Modal
        open={isLabelModalOpen}
        onClose={closeLabelModal}
        closeAfterTransition
        slots={{ backdrop: LabelBackdrop }}
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[80%] h-[85vh]">
          <div className="bg-white rounded-md shadow-lg h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              {labelPdf && (
                <iframe
                  src={pdfBlobUrl || `${process.env.NEXT_PUBLIC_BACKEND_URL}${labelPdf?.labelPath || ""}`}
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="p-3 flex items-center justify-end gap-2">
              <button
                onClick={closeLabelModal}
                className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleDownloadLabel}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Track Order Modal */}
      <Modal open={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} aria-labelledby="track-modal-title">
        <Box className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[92%] sm:w-[780px] max-h-[90vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Header with gradient background */}
          <div className={`text-white rounded-t-lg -m-4 mb-4 p-6 ${activeTab === "Returns" ? "bg-gradient-to-r from-orange-600 to-red-600" : "bg-gradient-to-r from-blue-600 to-purple-600"}`}>
            <h3 className="text-center font-bold text-white text-xl">
              {activeTab === "Returns" ? "🔄 Return Tracking" : "📦 Order Tracking"}
            </h3>
            <p className="text-center text-blue-100 mt-2">
              {activeTab === "Returns" ? "Track your return progress in real-time" : "Track your order progress in real-time"}
            </p>
          </div>

          {/* Order Info Card */}
          <div className={`bg-gray-50 rounded-lg p-4 mb-6 border-l-4 ${activeTab === "Returns" ? "border-orange-500" : "border-blue-500"}`}>
            <div className="flex items-center space-x-3">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedOrderForTracking?.productId?.[0]?.image?.[0]}`}
                alt={selectedOrderForTracking?.productId?.[0]?.name}
                width={60}
                height={60}
                unoptimized
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{selectedOrderForTracking?.productId?.[0]?.name}</h3>
                <p className="text-gray-600">Order ID: {selectedOrderForTracking?._id?.slice(-8)}</p>
                <p className="text-green-600 font-semibold">${selectedOrderForTracking?.total}</p>
                {/* Show return status for Returns tab */}
                {activeTab === "Returns" && selectedOrderForTracking?.returnStatus && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReturnStatusBackgroundColor(selectedOrderForTracking.returnStatus)}`}>
                      Return Status: {getReturnStatus(selectedOrderForTracking)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white rounded-xl p-6 shadow-inner border">
            <h4 className="text-center text-gray-700 font-semibold mb-6 text-lg">
              {activeTab === "Returns" ? "Return Progress" : "Delivery Progress"}
            </h4>

            {/* Order Tracking Icons with Enhanced Styling */}
            <div className="flex items-center justify-center mt-6 overflow-x-auto pb-4 pt-2">
              {/* Step 1 - Pending */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "pending" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Scheduled" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "order_confirmed" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-yellow-500 text-white ring-4 ring-yellow-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "pending" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Scheduled" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "order_confirmed" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Pending
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${getTrackingStatus(selectedOrderForTracking) === "Pickup Scheduled" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "order_confirmed" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "border-blue-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 2 - Pickup Scheduled */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "Pickup Scheduled" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "order_confirmed" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-blue-500 text-white ring-4 ring-blue-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Users className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "Pickup Scheduled" ||
                  getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "order_confirmed" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Pickup Scheduled
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "border-indigo-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 3 - Pickup Completed */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-indigo-500 text-white ring-4 ring-indigo-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "Pickup Completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "on_the_way" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Pickup Completed
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "border-purple-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 4 - Inscan At Hub */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-purple-500 text-white ring-4 ring-purple-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "Inscan At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Inscan At Hub
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "border-violet-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 5 - Reached At Hub */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-violet-500 text-white ring-4 ring-violet-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "Reached At Hub" ||
                  getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-violet-100 text-violet-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Reached At Hub
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "border-orange-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 6 - Out For Delivery */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-orange-500 text-white ring-4 ring-orange-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Truck className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "Out For Delivery" ||
                  getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Out For Delivery
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "border-green-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 7 - Delivered */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-green-500 text-white ring-4 ring-green-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Archive className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${getTrackingStatus(selectedOrderForTracking) === "Delivered" ||
                  getTrackingStatus(selectedOrderForTracking) === "completed" ||
                  getTrackingStatus(selectedOrderForTracking) === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Delivered
                </span>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          <div className={`bg-gradient-to-r from-gray-50 rounded-lg p-4 mt-6 border border-gray-200 ${activeTab === "Returns" ? "to-orange-50" : "to-blue-50"}`}>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {activeTab === "Returns" ? "Current Return Status" : "Current Status"}
              </h4>
              {activeTab === "Returns" && selectedOrderForTracking?.returnStatus ? (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getReturnStatusBackgroundColor(selectedOrderForTracking.returnStatus)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${selectedOrderForTracking?.returnStatus === "pending"
                    ? "bg-yellow-500 animate-pulse"
                    : selectedOrderForTracking?.returnStatus === "Pickup Scheduled"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                    }`}></div>
                  {getReturnStatus(selectedOrderForTracking)}
                </div>
              ) : (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusBackgroundColor(getTrackingStatus(selectedOrderForTracking))}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${getTrackingStatus(selectedOrderForTracking) === "Delivered" || getTrackingStatus(selectedOrderForTracking) === "delivered" || getTrackingStatus(selectedOrderForTracking) === "completed"
                    ? "bg-green-500"
                    : getTrackingStatus(selectedOrderForTracking) === "Undelivered" || getTrackingStatus(selectedOrderForTracking) === "cancelled" || getTrackingStatus(selectedOrderForTracking) === "Cancelled"
                      ? "bg-red-500"
                      : "bg-yellow-500 animate-pulse"
                    }`}></div>
                  {activeTab === "Returns" ? getReturnStatus(selectedOrderForTracking) : getOrderStatus(getTrackingStatus(selectedOrderForTracking))}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsTrackModalOpen(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Wallet;