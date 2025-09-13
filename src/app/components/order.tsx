"use client";
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Package, Truck, Users, Archive } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";

interface Order {
  id: string;
  productId: string;
  orderStatus: string;
  total: number;
}

// Updated modal styles to make them responsive
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Use percentage for responsive width
  maxWidth: "780px", // Increased from 680px to 780px (+100px)
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};


// src={
//   chatMessage?.adminUser?.image ?    
//   `${process.env.NEXT_PUBLIC_BACKEND_URL}/${chatMessage?.adminUser.image }` : `/imageLogo2.jpg`
// }

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [cancelShippingOpen, setCancelShippingOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancellingShipping, setIsCancellingShipping] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(true)
  const token = Cookies.get("user-token");
  const loggedInUserId = Cookies.get("userId");

  const getUserOrders = async () => {
    if (!token) {
      return;
    }
    setLoader(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/getAll?fromUserId=${loggedInUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        toast.error("Failed to fetch orders. Please try again later.");
        return;
      }

      console.log("All Orders:", response.data.data);
      // Log each order's status
      response.data.data.forEach((order: any) => {
        console.log(`Order ID: ${order._id}, Status: ${order.orderStatus}`);
      });
      setUserOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again later.");
      return;
    } finally {
      setLoader(false)
    }
  };


  useEffect(() => {
    if (token && loggedInUserId) {
      getUserOrders()
    }
  }, [token, loggedInUserId])

  // Filter orders based on selected tab
  const filteredOrders = userOrders.filter((order: any) => {
    console.log(`Checking order ${order._id} with status ${order.orderStatus} for tab ${activeTab}`);
    if (activeTab === "Ongoing") {
      return order.orderStatus === "pending" ||
        order.orderStatus === "Pickup Scheduled" ||
        order.orderStatus === "Pickup Completed" ||
        order.orderStatus === "Inscan At Hub" ||
        order.orderStatus === "Reached At Hub" ||
        order.orderStatus === "Out For Delivery" ||
        order.orderStatus === "order_confirmed" ||
        order.orderStatus === "on_the_way";
    } else if (activeTab === "Completed") {
      return order.orderStatus === "Delivered" ||
        order.orderStatus === "completed" ||
        order.orderStatus === "delivered";
    } else if (activeTab === "Cancelled / Undeliverd") {
      return order.orderStatus === "Undelivered" ||
        order.orderStatus === "cancel" ||
        order.orderStatus === "cancelled" ||
        order.orderStatus === "Cancelled";
    }
    return false;
  });

  // Open modal & set the selected order
  const handleOpen = (order: Order) => {
    setSelectedOrder(order);
    setCancelOpen(true);
  };

  const handleTrack = (order: Order) => {
    setSelectedOrder({ ...order }); // Ensure the correct order object is set
    setTrackOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setCancelOpen(false);
    setSelectedOrder(null);
  };

  // Open Cancel Shipping modal
  const handleOpenCancelShipping = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setCancelShippingOpen(true);
  };

  const handleCloseCancelShipping = () => {
    setCancelShippingOpen(false);
    setSelectedOrder(null);
    setCancelReason("");
  };

  // Submit Cancel Shipping
  const handleSubmitCancelShipping = async () => {
    if (!selectedOrder || !cancelReason?.trim()) {
      toast.error("Please provide a reason.");
      return;
    }
    try {
      setIsCancellingShipping(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/delivery/cancel/${(selectedOrder as any)?._id}`,
        { reason: cancelReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response?.data?.message || "Shipping cancelled successfully");
        await getUserOrders();
        handleCloseCancelShipping();
      } else {
        toast.error("Failed to cancel shipping");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel shipping");
    } finally {
      setIsCancellingShipping(false);
    }
  };

  // Open reason modal for cancelled/undelivered orders
  const handleOpenReason = (order: Order) => {
    setSelectedOrder(order);
    setReasonOpen(true);
  };

  const handleCloseReason = () => {
    setReasonOpen(false);
    setSelectedOrder(null);
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/update/${selectedOrder._id}`,
        {
          orderStatus: "cancelled",
          fromUserId: loggedInUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update the local state to reflect the cancellation
        setUserOrders((prevOrders: any) =>
          prevOrders.map((order: any) =>
            order._id === selectedOrder._id
              ? { ...order, orderStatus: "cancelled" }
              : order
          )
        );
        toast.success("Order cancelled successfully");
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }

    handleClose();
  };

  const handleTrackClose = () => {
    setTrackOpen(false);
    setSelectedOrder(null);
  };

  const getOrderStatus = (order: any) => {
    if (order?.orderStatus === "pending") {
      return "Pending";
    }
    if (order?.orderStatus === "Pickup Scheduled") {
      return "Pickup Scheduled";
    }
    if (order?.orderStatus === "Pickup Completed") {
      return "Pickup Completed";
    }
    if (order?.orderStatus === "Inscan At Hub") {
      return "Inscan At Hub";
    }
    if (order?.orderStatus === "Reached At Hub") {
      return "Reached At Hub";
    }
    if (order?.orderStatus === "Out For Delivery") {
      return "Out For Delivery";
    }
    if (order?.orderStatus === "Delivered") {
      return "Delivered";
    }
    if (order?.orderStatus === "Undelivered") {
      return "Undelivered";
    }
    // Keep existing statuses for backward compatibility
    if (order?.orderStatus === "order_confirmed") {
      return "Order Confirmed";
    }
    if (order?.orderStatus === "on_the_way") {
      return "On the Way";
    }
    if (order?.orderStatus === "completed") {
      return "Completed";
    }
    if (order?.orderStatus === "delivered") {
      return "Delivered";
    }
    if (order?.orderStatus === "cancelled" || order?.orderStatus === "Cancelled") {
      return "Cancelled";
    }
    return order?.orderStatus || "Unknown";
  };

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
      case "on_the_way":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-4 mt-6">
      {/* Tabs Section */}
      <div className="flex justify-between p-2 rounded-md mb-6 flex-wrap gap-2">
        {["Ongoing", "Completed", "Cancelled / Undeliverd"].map((tab) => (
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

      {/* Orders List */}
      <div className="space-y-4">
        {loader ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <svg
              className="animate-spin h-8 w-8 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) :
          filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <div
                key={order._id}
                onClick={() => {
                  if (activeTab === "Cancelled / Undeliverd") {
                    handleOpenReason(order);
                  }
                }}
                className={`flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-md bg-white gap-4 ${activeTab === "Cancelled / Undeliverd" ? "cursor-pointer hover:bg-gray-50" : ""}`}
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${order?.productId?.[0]?.image?.[0]}`}
                    alt={order?.productId?.[0]?.name}
                    width={32}
                    height={32}
                    unoptimized
                    className="w-32 h-32 rounded-md object-cover"
                  />
                  <div className="flex-1 sm:flex-none">
                    <h2 className="text-lg font-semibold ml-4 sm:ml-0">{order?.productId?.[0]?.name}</h2>
                    <p className="m-2 text-gray-600 ml-4 sm:ml-0">
                      ${order?.subTotal}
                      <span className={`ml-5 rounded-lg px-3 py-2 text-sm font-semibold border ${getStatusBackgroundColor(order.orderStatus)}`}>
                        {getOrderStatus(order)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Ongoing Tab: Cancel & Track Buttons */}
                {activeTab === "Ongoing" && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    {/* Only show Cancel Order button if status is pending */}
                    {order.orderStatus === "pending" && (
                      <button
                        onClick={() => handleOpen(order)}
                        className="px-3 py-2 border-white bg-gray-800 text-white rounded-md hover:bg-gray-600 cursor-pointer shadow-lg w-full sm:w-auto"
                      >
                        Cancel Order
                      </button>
                    )}
                    {/* Show Cancel Shipping for in-transit statuses (not pending/cancelled/undelivered/delivered) */}
                    {order.orderStatus !== "pending" &&
                      order.orderStatus !== "Cancelled" &&
                      order.orderStatus !== "cancelled" &&
                      order.orderStatus !== "Undelivered" &&
                      order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "delivered" && (
                        <button
                          onClick={() => handleOpenCancelShipping(order)}
                          className="px-3 py-2 border-white bg-red-600 text-white rounded-md hover:bg-red-500 cursor-pointer shadow-lg w-full sm:w-auto"
                        >
                          Cancel Shipping
                        </button>
                      )}
                    <button
                      onClick={() => handleTrack(order)}
                      className="px-3 py-2 border-1 bg-gray-100 text-black rounded-md hover:bg-gray-200 cursor-pointer shadow-lg w-full sm:w-auto"
                    >
                      Track Order
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No orders in this category.</p>
          )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal open={cancelOpen} onClose={handleClose} aria-labelledby="cancel-modal-title">
        <Box sx={modalStyle} className="w-full sm:w-auto">
          <Typography
            id="cancel-modal-title"
            variant="h6"
            className="text-center text-red-500 border-b-2"
          >
            Confirm Cancellation
          </Typography>
          <Typography sx={{ mt: 2 }} className="text-center font-bold ">
            Are you sure you want to cancel your order?
            <br />
            <span className="text-gray-500 text-center m-6">
              Only 80% of the money you can refund from your payment according to our policy.
            </span>
          </Typography>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleClose}
              className="text-white bg-black rounded-lg text-lg px-4 py-2 cursor-pointer mr-3 hover:bg-gray-700"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              className="text-black bg-[#EBEBEB] rounded-lg px-4 py-2 text-lg cursor-pointer shadow-lg ml-3 hover:bg-gray-200"
            >
              Yes, Cancel
            </button>
          </div>
        </Box>
      </Modal>

      {/* Cancel Shipping Modal */}
      <Modal open={cancelShippingOpen} onClose={handleCloseCancelShipping} aria-labelledby="cancel-shipping-title">
        <Box sx={modalStyle} className="w-full sm:w-auto">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg -m-4 mb-4 p-6">
            <Typography id="cancel-shipping-title" variant="h5" className="text-center font-bold text-white">
              Cancel Shipping
            </Typography>
            <p className="text-center text-red-100 mt-2">Provide a reason to cancel the shipment</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Order</h4>
            <div className="flex items-center gap-3">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedOrder?.productId?.[0]?.image?.[0]}`}
                alt={selectedOrder?.productId?.[0]?.name}
                width={48}
                height={48}
                unoptimized
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <p className="text-gray-800 font-medium">{selectedOrder?.productId?.[0]?.name}</p>
                <p className="text-gray-500 text-sm">ID: {selectedOrder?._id?.slice(-8)}</p>
              </div>
            </div>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={4}
            placeholder="Write your reason here..."
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={handleCloseCancelShipping}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
              disabled={isCancellingShipping}
            >
              Close
            </button>
            <button
              onClick={handleSubmitCancelShipping}
              disabled={isCancellingShipping || !cancelReason?.trim()}
              className={`px-4 py-2 rounded-md text-white cursor-pointer flex items-center justify-center ${isCancellingShipping ? "bg-red-400" : "bg-red-600 hover:bg-red-500"}`}
            >
              {isCancellingShipping ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Cancelling...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </Box>
      </Modal>

      {/* Track Order Modal */}
      <Modal open={trackOpen} onClose={handleTrackClose} aria-labelledby="track-modal-title">
        <Box sx={modalStyle} className="w-full sm:w-auto">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg -m-4 mb-4 p-6">
            <Typography
              id="track-modal-title"
              variant="h5"
              className="text-center font-bold text-white"
            >
              📦 Order Tracking
            </Typography>
            <p className="text-center text-blue-100 mt-2">
              Track your order progress in real-time
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-3">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedOrder?.productId?.[0]?.image?.[0]}`}
                alt={selectedOrder?.productId?.[0]?.name}
                width={60}
                height={60}
                unoptimized
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{selectedOrder?.productId?.[0]?.name}</h3>
                <p className="text-gray-600">Order ID: {selectedOrder?._id?.slice(-8)}</p>
                <p className="text-green-600 font-semibold">${selectedOrder?.subTotal}</p>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white rounded-xl p-6 shadow-inner border">
            <h4 className="text-center text-gray-700 font-semibold mb-6 text-lg">Delivery Progress</h4>

            {/* Order Tracking Icons with Enhanced Styling */}
            <div className="flex items-center justify-center mt-6 overflow-x-auto pb-4 pt-2">
              {/* Step 1 - Pending */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "pending" ||
                  selectedOrder?.orderStatus === "Pickup Scheduled" ||
                  selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "order_confirmed" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-yellow-500 text-white ring-4 ring-yellow-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "pending" ||
                  selectedOrder?.orderStatus === "Pickup Scheduled" ||
                  selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "order_confirmed" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Pending
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${selectedOrder?.orderStatus === "Pickup Scheduled" ||
                  selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "order_confirmed" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "border-blue-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 2 - Pickup Scheduled */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "Pickup Scheduled" ||
                  selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "order_confirmed" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-blue-500 text-white ring-4 ring-blue-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Users className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "Pickup Scheduled" ||
                  selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "order_confirmed" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Pickup Scheduled
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "border-indigo-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 3 - Pickup Completed */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-indigo-500 text-white ring-4 ring-indigo-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "Pickup Completed" ||
                  selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "on_the_way" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Pickup Completed
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "border-purple-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 4 - Inscan At Hub */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-purple-500 text-white ring-4 ring-purple-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "Inscan At Hub" ||
                  selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Inscan At Hub
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "border-violet-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 5 - Reached At Hub */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-violet-500 text-white ring-4 ring-violet-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Package className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "Reached At Hub" ||
                  selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-violet-100 text-violet-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Reached At Hub
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "border-orange-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 6 - Out For Delivery */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-orange-500 text-white ring-4 ring-orange-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Truck className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "Out For Delivery" ||
                  selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Out For Delivery
                </span>
              </div>

              {/* Enhanced Dotted Line */}
              <div
                className={`border-t-3 border-dashed w-20 h-0 ${selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "border-green-400"
                  : "border-gray-300"
                  }`}
              ></div>

              {/* Step 7 - Delivered */}
              <div className="flex flex-col items-center min-w-[90px] relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-green-500 text-white ring-4 ring-green-200"
                  : "bg-gray-200 text-gray-400"
                  }`}>
                  <Archive className="w-7 h-7" />
                </div>
                <span className={`text-xs font-medium mt-2 text-center px-2 py-1 rounded-full ${selectedOrder?.orderStatus === "Delivered" ||
                  selectedOrder?.orderStatus === "completed" ||
                  selectedOrder?.orderStatus === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  Delivered
                </span>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mt-6 border border-gray-200">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Current Status</h4>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusBackgroundColor(selectedOrder?.orderStatus)}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${selectedOrder?.orderStatus === "Delivered" || selectedOrder?.orderStatus === "delivered" || selectedOrder?.orderStatus === "completed"
                  ? "bg-green-500"
                  : selectedOrder?.orderStatus === "Undelivered" || selectedOrder?.orderStatus === "cancelled" || selectedOrder?.orderStatus === "Cancelled"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                  }`}></div>
                {getOrderStatus(selectedOrder)}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleTrackClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>

      {/* Reason View Modal for Cancelled/Undelivered */}
      <Modal open={reasonOpen} onClose={handleCloseReason} aria-labelledby="reason-modal-title">
        <Box sx={modalStyle} className="w-full sm:w-auto">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg -m-4 mb-4 p-6">
            <Typography id="reason-modal-title" variant="h6" className="text-center font-bold text-white">
              Cancellation Details
            </Typography>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
            <div className="flex items-center space-x-3">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedOrder?.productId?.[0]?.image?.[0]}`}
                alt={selectedOrder?.productId?.[0]?.name}
                width={60}
                height={60}
                unoptimized
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{selectedOrder?.productId?.[0]?.name}</h3>
                <p className="text-gray-600">Order ID: {selectedOrder?._id?.slice(-8)}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusBackgroundColor(selectedOrder?.orderStatus)}`}>
                  {getOrderStatus(selectedOrder)}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Reason</h4>
            <p className="text-gray-800 bg-white border rounded-md p-3 min-h-[80px]">
              {selectedOrder?.cancelReason || "No reason provided."}
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleCloseReason}
              className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}