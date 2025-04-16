"use client";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Package, Truck, Users, Archive } from "lucide-react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 530,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const initialOrders = [
  {
    id: "1",
    title: "Pistol Table Lamp",
    image: "/pexels-alimadad-1268511.jpg",
    price: "$120",
    status: "Ongoing",
    checkedout: true,
    shipping: true,
    readyToDeliver: false,
    delivered: false,
    estimatedDelivery: "March 25, 2025",
  },
  {
    id: "2",
    title: "Men Shoes",
    image: "/pexels-boot.jpg",
    price: "$80",
    status: "Completed",
    checkedout: false,
    shipping: false,
    readyToDeliver: false,
    delivered: false,
    estimatedDelivery: "March 15, 2025",
  },
  {
    id: "3",
    title: "Mini Palm Tree",
    image: "/images/plant.jpg",
    price: "$35",
    status: "Cancelled",
    checkedout: false,
    shipping: false,
    readyToDeliver: false,
    delivered: false,
    estimatedDelivery: "Refund in process",
  },
  {
    id: "4",
    title: "Gaming Mouse",
    image: "/pexels-kinkate-205926.jpg",
    price: "$50",
    status: "Ongoing",
    checkedout: false,
    shipping: false,
    readyToDeliver: false,
    delivered: false,
    estimatedDelivery: "March 30, 2025",
  },
  {
    id: "5",
    title: "Wireless Keyboard",
    image: "/pexels-garrettmorrow-682933.jpg",
    price: "$90",
    status: "Ongoing",
    checkedout: true,
    shipping: true,
    readyToDeliver: true,
    delivered: true,
    estimatedDelivery: "April 2, 2025",
  },
  
];

export default function MyOrders() {
  const [orders, setOrders] = useState<any>(initialOrders);
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false)

  // Filter orders based on selected tab
  const filteredOrders = orders.filter((order: any) => order.status === activeTab);

  // Open modal & set the selected order
  const handleOpen = (order: any) => {
    setSelectedOrder(order);
    setCancelOpen(true);
  };

  const handleTrack = (order: any) => {
    setSelectedOrder({ ...order }); // Ensure the correct order object is set
    setTrackOpen(true);
  };


  // Close modal
  const handleClose = () => {
    setCancelOpen(false);
    setSelectedOrder(null);
  };

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (selectedOrder) {
      setOrders((prevOrders: any) =>
        prevOrders.map((order: any) =>
          order.id === selectedOrder.id && order.status === "Ongoing"
            ? { ...order, status: "Cancelled", estimatedDelivery: "Refund in process" }
            : order
        )
      );
    }
    handleClose();
  };

  const handleTrackClose = () => {
    setTrackOpen(false);
    setSelectedOrder(null);
  };

  const getOrderStatus = (order: any) => {
    if (order?.checkedout === true && order?.shipping === true && order?.readyToDeliver === true && order?.delivered === true){
      return "Order Delivered"
    }
    if (order?.checkedout === true && order?.shipping === true && order?.readyToDeliver === true && order?.delivered === false){
      return "Ready to be Delivered"
    }
    if (order?.checkedout === true && order?.shipping === true && order?.readyToDeliver === false && order?.delivered === false){
      return "Shipping"
    }
    if (order?.checkedout === true && order?.shipping === false && order?.readyToDeliver === false && order?.delivered === false){
      return " CheckedOut"
    }
    if (order?.checkedout === false && order?.shipping === false && order?.readyToDeliver === false && order?.delivered === false){
      return "Under Process"
    }
  }


  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tabs Section */}
      <div className="flex justify-between p-2 rounded-md mb-6">
        {["Ongoing", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 rounded-md font-medium cursor-pointer ${
              activeTab === tab ? "border-b-2 border-gray-800 text-gray-700" : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white"
            >
              <div className="flex items-center space-x-4">
                <img src={order.image} alt={order.title} className="w-32 h-32 rounded-md object-cover" />
                <div>
                  <h2 className="text-lg font-semibold">{order.title}</h2>
                  <p className="m-2 text-gray-600">{order.price} <span className={`ml-5 px-5 py-1 text-sm rounded-lg ${order.status === "Cancelled" ? "bg-gray-800 text-gray-200" : "bg-gray-800 text-gray-200"}`}>
                    {order.status === "Cancelled" ? "Refunded" : "Paid"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Ongoing Tab: Cancel & Track Buttons */}
              {activeTab === "Ongoing" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpen(order)}
                    className="px-3 py-2 border-white bg-gray-800 text-white rounded-md hover:bg-gray-600 cursor-pointer shadow-lg"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => handleTrack(order)}
                    className="px-3 py-2 border-1 bg-gray-100 text-black rounded-md hover:bg-gray-200 cursor-pointer shadow-lg"
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
        <Box sx={modalStyle}>
          <Typography id="cancel-modal-title" variant="h6" className="text-center text-red-500 border-b-2">
            Confirm Cancellation
          </Typography>
          <Typography sx={{ mt: 2 }}
            className="text-center font-bold ">
            Are you sure you want to cancel your order?
            <br />
            <span
             className="text-gray-500 text-center m-6">
               Only 80% of the money you can refund from your payment according to our policy. 
            </span>
          </Typography>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={handleClose} className="text-white bg-black rounded-lg text-lg px-4 py-2 cursor-pointer mr-3 hover:bg-gray-700">
              Keep Order
            </button>
            <button onClick={handleCancelOrder} className="text-black bg-[#EBEBEB] rounded-lg px-4 py-2 text-lg cursor-pointer shadow-lg ml-3 hover:bg-gray-200">
              Yes, Cancel
            </button>
          </div>
        </Box>
      </Modal>  


       {/* Track Order Modal */}
       <Modal open={trackOpen} onClose={handleTrackClose} aria-labelledby="track-modal-title">
      <Box sx={modalStyle} className="bg-white p-6 rounded-lg shadow-lg">
        
        {/* Title */}
        <Typography id="track-modal-title" variant="h6" className="text-center text-gray-800 border-b-2 pb-2">
          Order Tracking
        </Typography>
        
        <Typography sx={{ mt: 2 }} className="text-center font-bold">
        {/* Order Tracking Icons with Dotted Line */}
        <div className="flex items-center justify-center mt-6">
          {/* Step 1 - Checked Out */}
          <div className="flex flex-col items-center">
            <Package className={`w-10 h-10 ${selectedOrder?.checkedout ? "text-black" : "text-gray-400"}`} />
            <span className="text-sm text-gray-600 mt-1">Checked Out</span>
          </div>

          {/* Dotted Line */}
          <div className={`border-t-2 border-dashed w-16 ${selectedOrder?.shipping ? "border-black" : "border-gray-400"}`}></div>

          {/* Step 2 - Shipping */}
          <div className="flex flex-col items-center">
            <Truck className={`w-10 h-10 ${selectedOrder?.shipping ? "text-black" : "text-gray-400"}`} />
            <span className="text-sm text-gray-600 mt-1">Shipping</span>
          </div>

          {/* Dotted Line */}
          <div className={`border-t-2 border-dashed w-16 ${selectedOrder?.readyToDeliver ? "border-black" : "border-gray-400"}`}></div>

          {/* Step 3 - Ready to Deliver */}
          <div className="flex flex-col items-center">
            <Users className={`w-10 h-10 ${selectedOrder?.readyToDeliver ? "text-black" : "text-gray-400"}`} />
            <span className="text-sm text-gray-600 mt-1">Ready for Delivery</span>
          </div>

          {/* Dotted Line */}
          <div className={`border-t-2 border-dashed w-16 ${selectedOrder?.delivered ? "border-black" : "border-gray-400"}`}></div>

          {/* Step 4 - Delivered */}
          <div className="flex flex-col items-center">
            <Archive className={`w-10 h-10 ${selectedOrder?.delivered ? "text-black" : "text-gray-400"}`} />
            <span className="text-sm text-gray-600 mt-1">Delivered</span>
          </div>
        </div>
        </Typography>

        {/* Tracking Status */}
        <Typography sx={{ mt: 2 }} className="text-center font-bold">
          Your order, <span className="text-gray-600">{selectedOrder?.title}</span>, is currently <span className="text-black">{getOrderStatus(selectedOrder)}</span>.
        </Typography>
        
        {/* Estimated Delivery */}
        <Typography sx={{ mt: 2 }} className="text-center text-gray-500">
          Estimated Delivery: <span className="font-semibold">{selectedOrder?.estimatedDelivery}</span>
        </Typography>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button onClick={handleTrackClose} className="text-black bg-[#EBEBEB] rounded-lg px-6 py-2 text-lg cursor-pointer shadow-lg hover:bg-gray-200">
            Close
          </button>
        </div>
      </Box>
    </Modal>


    </div>
  );
}
