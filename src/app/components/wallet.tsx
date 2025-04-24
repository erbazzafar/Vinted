"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Eye } from "lucide-react";

interface Products {
  _id: string;
  fullName: string
  productId: {
    _id: string;
    name: string;
    image: string[];
  }[];
  total: number;
  orderStatus: string;
  buyerFee: string,
  subTotal: string,
  country: string,
  city: string,
  address1: string

}

function Wallet() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Credit Card", last4: "4242", brand: "Visa" },
    { id: 2, type: "Bank Account", last4: "1234", name: "Main Account" },
  ]);
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");
  const router = useRouter();

  const [wallet, setWallet] = useState<{
    wallet: {
      available: number;
      pending: number;
    };
  } | null>(null);

  const [soldProducts, setSoldProducts] = useState<Products[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

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

  // New state to track updated status for each product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/update/${orderId}`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Status updated successfully.");
        setIsProductModalOpen(false);
        setSelectedProduct(null);
        fetchSoldProducts(); // Refresh the list with updated status
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      toast.error("Error updating status. Please try again later.");
    }
  };


  return (
    <div className="bg-white mt-15 w-full">
      <div className="container mx-auto max-w-screen-2xl lg:px-[50px] py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  onClick={() => console.log("Withdrawal requested")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Withdraw Funds
                </button>
              )}
            </div>
          </div>

          {/* Pending Balance Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Balance</h2>
            <p className="text-4xl font-bold text-red-500">-${wallet?.wallet?.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Will be available in 1-3 business days</p>
          </div>
        </div>

        {/* Sold Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sold Products</h2>
          </div>

          {soldProducts.length > 0 ? (
            <div className="space-y-4">
              {soldProducts.map((soldProd: Products) => {
                // Check if status is updated for this product

                return (
                  <div
                    key={soldProd?._id}
                    className="flex items-center justify-between p-1 border rounded-lg shadow-md bg-white"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${soldProd?.productId?.[0]?.image?.[0]}`}
                        alt={soldProd?.productId?.[0]?.name}
                        width={32}
                        height={32}
                        unoptimized
                        className="w-18 h-18 rounded-md object-cover"
                      />
                      <div>
                        <h2 className="text-[13px] font-semibold ml-4">{soldProd?.productId?.[0]?.name}</h2>
                        <p className="m-1 text-red-500 ml-4 text-[12px]">Price : ${soldProd?.total}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <p className="bg-green-600 text-gray-50 rounded-md px-3 py-2">
                        {soldProd?.orderStatus}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedProduct(soldProd);
                          setIsProductModalOpen(true);
                        }}
                        className="bg-gray-600 shadow-lg rounded-lg text-white px-3 py-2 flex items-center gap-2 mr-5 cursor-pointer hover:bg-gray-500 transition transform hover:scale-105 duration-300"
                      >
                        <Eye size={20} className="text-white" />

                      </button>
                    </div>

                    {/* Phone Number Modal */}
                    <Modal open={isProductModalOpen} onClose={() => { setIsProductModalOpen(false) }}>
                      <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedProduct?.productId?.[0]?.image?.[0]}`}
                          alt={selectedProduct?.productId?.[0]?.name || "Product Image"}
                          width={55}
                          height={50}
                          unoptimized
                          className="w-full h-66 rounded-md object-contain"
                        />

                        <div className="bg-gray-100 grid grid-cols-2 border-2 my-4">
                          <div className="p-3">
                            <h2 className="text-[13px] font-semibold ">Seller Information:</h2>
                            <p className="text-[13px] text-gray-700">Product Name: {selectedProduct?.productId?.[0]?.name}</p>
                            <p className="text-[13px] text-gray-700">Price: {selectedProduct?.total}</p>
                            <p className="text-[13px] text-gray-700">Platform Fee: {selectedProduct?.buyerFee}</p>
                            <p className="text-[13px] mb-1 text-green-700">Recieveable: {selectedProduct?.subTotal || selectedProduct?.total}</p>
                          </div>
                          <div className="p-3" >
                            <h2 className="text-[13px] font-semibold ">Buyer Information:</h2>
                            <p className="text-[13px] text-gray-700">Name: {selectedProduct?.fullName}</p>
                            <p className="text-[13px] text-gray-700">Address: {selectedProduct?.address1}</p>
                            <p className="text-[13px] text-gray-700">City: {selectedProduct?.city || "N/A"}</p>
                            <p className="text-[13px] text-gray-700">Country: {selectedProduct?.country || "N/A"}</p>
                            <p></p>
                          </div>
                        </div>


                        <p className="text-[13px] text-red-600">Update Status</p>
                        <select
                          value={selectedProduct?.orderStatus}
                          onChange={(e) => handleStatusUpdate(selectedProduct?._id, e.target.value)}
                          className="cursor-pointer text-[13px] w-full border p-2 rounded mb-4 "
                        >
                          <option value="pending">Pending</option>
                          <option value="shipping">Shipping</option>
                          <option value="ready-to-delivered">Ready for Delivered</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </Box>
                    </Modal>
                  </div>

                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">No Products Sold / No Pending Balance.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;