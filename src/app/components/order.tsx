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
  maxWidth: "580px", // Set a maximum width for larger screens
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
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(true)
  const token = Cookies.get("token");
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
      return order.orderStatus === "pending" || order.orderStatus === "shipping" || order.orderStatus === "ready-to-delivered";
    } else if (activeTab === "Completed") {
      return order.orderStatus === "completed" || order.orderStatus === "delivered";
    } else if (activeTab === "Cancelled") {
      return order.orderStatus === "cancel" || order.orderStatus === "cancelled" || order.orderStatus === "Cancelled";
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
    if (order?.orderStatus === "Completed") {
      return "Completed";
    }
    if (order?.orderStatus === "Cancelled") {
      return "Cancelled";
    }
    if (order?.orderStatus === "ready-to-delivered") {
      return "Ready for Delivery";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-4 mt-6">
      {/* Tabs Section */}
      <div className="flex justify-between p-2 rounded-md mb-6 flex-wrap gap-2">
        {["Ongoing", "Completed", "Cancelled"].map((tab) => (
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
                className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-md bg-white gap-4"
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
                      <span className="ml-5 rounded-lg bg-black text-white px-3 py-2 text-sm font-semibold">
                        {order.orderStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Ongoing Tab: Cancel & Track Buttons */}
                {activeTab === "Ongoing" && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleOpen(order)}
                      className="px-3 py-2 border-white bg-gray-800 text-white rounded-md hover:bg-gray-600 cursor-pointer shadow-lg w-full sm:w-auto"
                    >
                      Cancel Order
                    </button>
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

      {/* Track Order Modal */}
      <Modal open={trackOpen} onClose={handleTrackClose} aria-labelledby="track-modal-title">
        <Box sx={modalStyle} className="w-full sm:w-auto">
          {/* Title */}
          <Typography
            id="track-modal-title"
            variant="h6"
            className="text-center text-gray-800 border-b-2 pb-2"
          >
            Order Tracking
          </Typography>

          <Typography sx={{ mt: 2 }} className="text-center font-bold">
            {/* Order Tracking Icons with Dotted Line */}
            <div className="flex items-center justify-center mt-6">
              {/* Step 1 - Pending */}
              <div className="flex flex-col items-center">
                <Package
                  className={`w-10 h-10 ${selectedOrder?.orderStatus === "pending" ||
                      selectedOrder?.orderStatus === "shipping" ||
                      selectedOrder?.orderStatus === "completed" ||
                      selectedOrder?.orderStatus === "delivered" ||
                      selectedOrder?.orderStatus === "ready-to-delivered"
                      ? "text-black"
                      : "text-gray-400"
                    }`}
                />
                <span className="text-sm text-gray-600 mt-1">Pending</span>
              </div>

              {/* Dotted Line */}
              <div
                className={`border-t-2 border-dashed w-16 ${selectedOrder?.orderStatus === "shipping" ||
                    selectedOrder?.orderStatus === "completed" ||
                    selectedOrder?.orderStatus === "delivered" ||
                    selectedOrder?.orderStatus === "ready-to-delivered"
                    ? "border-black"
                    : "border-gray-400"
                  }`}
              ></div>

              {/* Step 2 - Shipping */}
              <div className="flex flex-col items-center">
                <Truck
                  className={`w-10 h-10 ${selectedOrder?.orderStatus === "shipping" ||
                      selectedOrder?.orderStatus === "completed" ||
                      selectedOrder?.orderStatus === "delivered" ||
                      selectedOrder?.orderStatus === "ready-to-delivered"
                      ? "text-black"
                      : "text-gray-400"
                    }`}
                />
                <span className="text-sm text-gray-600 mt-1">Shipping</span>
              </div>

              {/* Dotted Line */}
              <div
                className={`border-t-2 border-dashed w-16 ${selectedOrder?.orderStatus === "completed" ||
                    selectedOrder?.orderStatus === "delivered" ||
                    selectedOrder?.orderStatus === "ready-to-delivered"
                    ? "border-black"
                    : "border-gray-400"
                  }`}
              ></div>

              {/* Step 3 - Ready to Deliver */}
              <div className="flex flex-col items-center">
                <Users
                  className={`w-10 h-10 ${selectedOrder?.orderStatus === "completed" ||
                      selectedOrder?.orderStatus === "delivered" ||
                      selectedOrder?.orderStatus === "ready-to-delivered"
                      ? "text-black"
                      : "text-gray-400"
                    }`}
                />
                <span className="text-sm text-gray-600 mt-1">Ready for Delivery</span>
              </div>

              {/* Dotted Line */}
              <div
                className={`border-t-2 border-dashed w-16 ${selectedOrder?.orderStatus === "delivered"
                    ? "border-black"
                    : "border-gray-400"
                  }`}
              ></div>

              {/* Step 4 - Delivered */}
              <div className="flex flex-col items-center">
                <Archive
                  className={`w-10 h-10 ${selectedOrder?.orderStatus === "delivered"
                      ? "text-black"
                      : "text-gray-400"
                    }`}
                />
                <span className="text-sm text-gray-600 mt-1">Delivered</span>
              </div>
            </div>
          </Typography>

          {/* Tracking Status */}
          <Typography sx={{ mt: 2 }} className="text-center font-bold">
            Your order, <span className="text-gray-600">{selectedOrder?.productId?.[0]?.name}</span>, is currently{" "}
            <span className="text-black">{getOrderStatus(selectedOrder)}</span>.
          </Typography>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleTrackClose}
              className="text-black bg-[#EBEBEB] rounded-lg px-6 py-2 text-lg cursor-pointer shadow-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}