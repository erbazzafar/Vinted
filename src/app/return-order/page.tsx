"use client";

import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Upload } from "lucide-react";

function ReturnOrderContent() {
    const router = useRouter();
    const userId = Cookies.get("userId");
    const token = Cookies.get("user-token");
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [images, setImages] = useState<File[]>([]);

    // Predefined return reasons
    const returnReasons = [
        "Product is damaged",
        "Product is different from description",
        "Wrong product received",
        "Product doesn't work as expected"
    ];

    useEffect(() => {
        if (!userId || !token) {
            router.push("/");
            return;
        } else if (!orderId) {
            router.push("/orders");
            return;
        } else {
            fetchOrderDetails(orderId);
        }
    }, [userId, token, orderId]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 200) {
                toast.error("Error fetching order details");
                router.push("/orders");
                return;
            }

            const orderData = response.data.data;

            // Check if order status is "Delivered"
            if (orderData.orderStatus !== "Delivered" && orderData.orderStatus !== "delivered" && orderData.orderStatus !== "completed") {
                toast.error("This order cannot be returned. Only delivered orders can be returned.");
                router.push("/");
                return;
            }

            setOrder(orderData);
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Error fetching order details");
            router.push("/orders");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = [...images];
            for (let i = 0; i < files.length; i++) {
                if (newImages.length < 10) {
                    newImages.push(files[i]);
                } else {
                    toast.error("You can upload up to 10 images only.");
                    break;
                }
            }
            setImages(newImages);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const handleReasonSelect = (reason: string) => {
        setReturnReason(reason);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!returnReason.trim()) {
            toast.error("Please provide a reason for return.");
            return;
        }

        if (images.length === 0) {
            toast.error("Please upload at least one supporting image.");
            return;
        }

        setSubmitting(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Add the required fields to FormData
            formData.append('customerId', order.fromUserId?._id);
            formData.append('sellerId', order.toUserId);
            formData.append('returnReason', returnReason);
            formData.append('orderId', orderId || '');

            // Append images
            images.forEach((image) => {
                formData.append('images', image);
            });

            // Console log the data as requested
            console.log("Return Order Data:", {
                orderId: orderId,
                customerId: order.fromUserId,
                sellerId: order.toUserId,
                returnReason: returnReason,
                images: images.map(img => img.name)
            });

            // Call the API
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Return request submitted successfully!");
                router.push("/orders");
            } else {
                toast.error("Failed to submit return request");
            }
        } catch (error: any) {
            console.error("Error submitting return request:", error);
            toast.error(error?.response?.data?.message || "Failed to submit return request");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <p className="text-gray-600">Order not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white mt-[-18px] sm:mt-15 w-full">
            <div className="container mx-auto max-w-screen-2xl lg:px-[50px] py-8">
                <div className="space-y-8">
                    {/* Order Details Section */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                                <p><span className="font-semibold">Total Amount:</span> AED {order.subTotal}</p>
                                <p><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="capitalize"><span className="font-semibold">Status:</span> {order.orderStatus}</p>
                                <p><span className="font-semibold">Completed:</span> {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Product Details</h3>
                                {order?.isBundle ? (
                                    <div className="space-y-3">
                                        {order?.productId?.map((product: any, index: number) => (
                                            <div key={product._id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0">
                                                        {product?.image?.[0] && (
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
                                                                alt={product?.name || `Product ${index + 1}`}
                                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                                width={80}
                                                                height={80}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-lg text-gray-900 mb-1">
                                                            {product?.name || `Product ${index + 1}`}
                                                        </p>
                                                        {product?.price && (
                                                            <p className="text-gray-600 flex items-center gap-1">
                                                                <span>Price:</span>
                                                                <span className="font-semibold text-yellow-600 flex items-center gap-1">
                                                                    <Image src="/dirhamlogo.png" alt="dirham" width={14} height={14} unoptimized />
                                                                    {Number(product.price).toFixed(2)}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">
                                                {order?.productId?.[0]?.image?.[0] && (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${order.productId[0].image[0]}`}
                                                        alt={order.productId[0].name || 'Product Image'}
                                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                        width={80}
                                                        height={80}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg text-gray-900 mb-1">
                                                    {order?.productId?.[0]?.name || 'Product Name Not Available'}
                                                </p>
                                                {order?.productId?.[0]?.price && (
                                                    <p className="text-gray-600 flex items-center gap-1">
                                                        <span>Price:</span>
                                                        <span className="font-semibold text-yellow-600 flex items-center gap-1">
                                                            <Image src="/dirhamlogo.png" alt="dirham" width={14} height={14} unoptimized />
                                                            {Number(order.productId[0].price).toFixed(2)}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Return Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-white border rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-6">Return Order</h2>

                            {/* Reason Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Reason of Return *
                                </label>

                                {/* Main Reason Textarea */}
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Please explain why you want to return this order..."
                                    required
                                />

                                {/* Hint Buttons */}
                                <p className="text-[13px] font-[500] text-gray-500 mt-2">Hints (for reference):</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    {returnReasons.map((reason, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleReasonSelect(reason)}
                                            className="p-3 text-left text-[13px] font-[500] border border-gray-300 cursor-pointer rounded-lg transition-colors bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Supporting Images */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Supporting Images *
                                </label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Upload one or more images as proof that the order was not delivered correctly
                                </p>

                                {/* Image Upload Button */}
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Images
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        You can upload up to 10 images (Max 5MB each)
                                    </p>
                                </div>

                                {/* Image Preview Grid */}
                                {images.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative w-36 h-36 rounded-lg overflow-hidden shadow-md">
                                                <Image
                                                    src={URL.createObjectURL(img)}
                                                    alt="Supporting evidence"
                                                    height={96}
                                                    width={96}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition duration-200 cursor-pointer"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !returnReason.trim() || images.length === 0}
                                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting..." : "Submit Return Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ReturnOrder() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ReturnOrderContent />
        </Suspense>
    );
}

export default ReturnOrder;
