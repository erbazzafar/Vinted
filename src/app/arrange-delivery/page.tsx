"use client";

import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";
import React, { useEffect, useState, Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function ArrangeDeliveryContent() {

    const router = useRouter();

    const userId = Cookies.get("userId");
    const token = Cookies.get("user-token");

    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('+971');

    const [formData, setFormData] = useState({
        delivery_type: "Next Day",
        load_type: "Non-document",
        consignment_type: "FORWARD",
        description: "",
        weight: 5,
        payment_type: "Prepaid",
        cod_amount: "",
        num_pieces: "1",
        customer_reference_number: "",
        pickup_option: "",
        dropoff_to_hub: false,
        origin_address_name: "",
        origin_address_mob_no_country_code: "971",
        origin_address_mobile_number: "",
        origin_address_alt_ph_country_code: "",
        origin_address_alternate_phone: "",
        origin_address_house_no: "",
        origin_address_building_name: "",
        origin_address_area: "",
        origin_address_landmark: "",
        origin_address_city: "Dubai",
        origin_address_type: "Normal",
        destination_address_name: "",
        destination_address_mob_no_country_code: "971",
        destination_address_mobile_number: "",
        destination_details_alt_ph_country_code: "",
        destination_details_alternate_phone: "",
        destination_address_house_no: "",
        destination_address_building_name: "",
        destination_address_area: "",
        destination_address_landmark: "",
        destination_address_street: "",
        destination_address_city: "Dubai",
        destination_address_type: "Normal",
        pickup_date: "",
        status: "",
        productId: "",
        orderId: "",
        sellerId: "",
        customerId: ""
    });

    useEffect(() => {
        if (!userId || !token) {
            router.push("/");
            return;
        } else if (!orderId) {
            router.push("/wallet");
            return;
        } else {
            fn_getOrderDetails(orderId);
        }
    }, [userId, token, orderId]);

    // Load saved origin address fields from localStorage
    useEffect(() => {
        try {
            const originStorageKey = `jeebly_origin_address_${userId || 'anon'}`;
            const savedOrigin = localStorage.getItem(originStorageKey);
            if (savedOrigin) {
                const originData = JSON.parse(savedOrigin);

                // Restore phone number if saved
                if (originData.phoneNumber) {
                    setPhoneNumber(originData.phoneNumber);
                }

                setFormData(prev => ({
                    ...prev,
                    origin_address_name: originData.origin_address_name || prev.origin_address_name,
                    origin_address_mobile_number: originData.origin_address_mobile_number || prev.origin_address_mobile_number,
                    origin_address_mob_no_country_code: originData.origin_address_mob_no_country_code || prev.origin_address_mob_no_country_code,
                    origin_address_house_no: originData.origin_address_house_no || prev.origin_address_house_no,
                    origin_address_building_name: originData.origin_address_building_name || prev.origin_address_building_name,
                    origin_address_area: originData.origin_address_area || prev.origin_address_area,
                    origin_address_landmark: originData.origin_address_landmark || prev.origin_address_landmark,
                    origin_address_city: originData.origin_address_city || prev.origin_address_city,
                }));
            }

        } catch (err) {
            console.error('Error loading saved pickup data:', err);
        }
    }, [userId]);

    // Set default pickup date based on current time
    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();
        let defaultPickupDate;

        // If after 4PM (>= 16), set to tomorrow
        if (currentHour >= 16) {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            defaultPickupDate = formatLocalDate(tomorrow);
        } else {
            // If before 4PM, set to today
            defaultPickupDate = formatLocalDate(now);
        }

        setFormData(prev => ({
            ...prev,
            pickup_date: prev.pickup_date || defaultPickupDate
        }));
    }, []);

    // Persist origin address fields to localStorage whenever they change
    useEffect(() => {
        try {
            const originStorageKey = `jeebly_origin_address_${userId || 'anon'}`;
            const originFields = {
                origin_address_name: formData.origin_address_name,
                origin_address_mobile_number: formData.origin_address_mobile_number,
                origin_address_mob_no_country_code: formData.origin_address_mob_no_country_code,
                origin_address_house_no: formData.origin_address_house_no,
                origin_address_building_name: formData.origin_address_building_name,
                origin_address_area: formData.origin_address_area,
                origin_address_landmark: formData.origin_address_landmark,
                origin_address_city: formData.origin_address_city,
                phoneNumber: phoneNumber, // Save the full phone number for restoring
            };
            localStorage.setItem(originStorageKey, JSON.stringify(originFields));
        } catch (err) {
            console.error('Error saving origin address data:', err);
        }
    }, [
        formData.origin_address_name,
        formData.origin_address_mobile_number,
        formData.origin_address_mob_no_country_code,
        formData.origin_address_house_no,
        formData.origin_address_building_name,
        formData.origin_address_area,
        formData.origin_address_landmark,
        formData.origin_address_city,
        phoneNumber,
        userId,
    ]);



    const fn_getOrderDetails = async (orderId: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status !== 200) {
                toast.error("Error fetching order details");
                return;
            }
            setOrder(response.data.data);

            if (response.data.data) {
                const orderData = response.data.data;

                // Calculate default pickup date based on current time
                const now = new Date();
                const currentHour = now.getHours();
                let defaultPickupDate;

                // If after 4PM, default to tomorrow
                if (currentHour >= 16) {
                    const tomorrow = new Date(now);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    defaultPickupDate = formatLocalDate(tomorrow);
                } else {
                    // If before 4PM, default to today
                    defaultPickupDate = formatLocalDate(now);
                }

                setFormData(prev => ({
                    ...prev,
                    description: orderData?.productId?.[0]?.name || "",
                    cod_amount: orderData.subTotal || "",
                    customer_reference_number: orderData._id || "",
                    // Customer address fields are kept in formData but not displayed for privacy
                    destination_address_name: orderData.fullName || "",
                    destination_address_mob_no_country_code: orderData.phoneCode || "971",
                    destination_address_mobile_number: orderData.phone || "",
                    destination_address_house_no: orderData.houseNo || "",
                    destination_address_building_name: orderData.buildingName || "",
                    destination_address_area: orderData.area || "",
                    destination_address_landmark: orderData.landmark || "",
                    destination_address_street: orderData.address1 || "",
                    destination_address_city: orderData.city || "Dubai",
                    pickup_date: defaultPickupDate
                }));
            }
        } catch (error) {
            console.log("Error fetching order details: ", error);
            toast.error(error?.response?.data?.message || "Error fetching order details");
            return;
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value || '+971');

        // Extract country code and phone number using the library's parser
        if (value) {
            try {
                const phoneNumberObj = parsePhoneNumber(value);

                if (phoneNumberObj) {
                    // Get the country calling code (e.g., "971" for UAE)
                    const countryCode = phoneNumberObj.countryCallingCode;

                    // Get the national number (phone without country code)
                    const nationalNumber = phoneNumberObj.nationalNumber;

                    setFormData(prev => ({
                        ...prev,
                        origin_address_mob_no_country_code: countryCode,
                        origin_address_mobile_number: nationalNumber
                    }));
                }
            } catch (error) {
                console.error('Error parsing phone number:', error);
            }
        }
    };

    const formatDateForAPI = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    // Helper function to format date in local timezone (YYYY-MM-DD)
    const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate pickup date (only same day or next day allowed)
            const now = new Date();
            const currentHour = now.getHours();
            const selectedDateStr = formData.pickup_date;

            // Get today and tomorrow as YYYY-MM-DD strings using local time
            const todayStr = formatLocalDate(now);
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = formatLocalDate(tomorrow);

            // If after 4PM, only next day is allowed
            if (currentHour >= 16) {
                if (selectedDateStr !== tomorrowStr) {
                    toast.error("Orders placed after 4PM can only be scheduled for tomorrow");
                    setLoading(false);
                    return;
                }
            } else {
                // If before 4PM, only today or tomorrow is allowed
                if (selectedDateStr !== todayStr && selectedDateStr !== tomorrowStr) {
                    toast.error("Pickup date must be today or tomorrow");
                    setLoading(false);
                    return;
                }
            }

            const newOrderStatus = "Pickup Scheduled";
            formData.status = newOrderStatus;
            formData.productId = order?.productId;
            formData.orderId = orderId;
            formData.sellerId = order?.toUserId;
            formData.customerId = order?.fromUserId;
            formData.weight = 5;
            formData.origin_address_type = "Normal";
            formData.pickup_option = 'rider';
            formData.dropoff_to_hub = false;

            // Format pickup date to YYYY-MM-DD format
            formData.pickup_date = formatDateForAPI(formData.pickup_date);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delivery/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Delivery request created successfully!");
                const resp = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/update/${orderId}`, { orderStatus: "Pickup Scheduled", arrangeDelivery: true }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (resp.status === 200) {
                    router.push("/wallet");
                }
            }
        } catch (error) {
            console.error("Error creating delivery request:", error);
            toast.error(error?.response?.data?.message || "Failed to create delivery request");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white mt-[-18px] sm:mt-15 w-full">
            <div className="container mx-auto max-w-screen-2xl lg:px-[50px] py-8">
                {order ? (
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
                                    <p className="capitalize"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
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

                        {/* Delivery Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-white border rounded-lg p-6">
                                <h2 className="text-2xl font-bold mb-6">Arrange Delivery</h2>

                                {/* Package Details */}
                                <div className="mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Pieces *
                                        </label>
                                        <input
                                            type="number"
                                            name="num_pieces"
                                            value={formData.num_pieces}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Package Description */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Package Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe the package contents"
                                        required
                                    />
                                </div>

                                {/* Pickup Date */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pickup Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="pickup_date"
                                        value={formData.pickup_date}
                                        onChange={handleInputChange}
                                        min={(() => {
                                            const now = new Date();
                                            const currentHour = now.getHours();
                                            // If after 4PM (16:00), minimum date is tomorrow
                                            if (currentHour >= 16) {
                                                const tomorrow = new Date(now);
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                return formatLocalDate(tomorrow);
                                            }
                                            // If before 4PM, minimum date is today
                                            return formatLocalDate(now);
                                        })()}
                                        max={(() => {
                                            const now = new Date();
                                            const currentHour = now.getHours();
                                            // If after 4PM (16:00), maximum date is tomorrow (only next day allowed)
                                            if (currentHour >= 16) {
                                                const tomorrow = new Date(now);
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                return formatLocalDate(tomorrow);
                                            }
                                            // If before 4PM, maximum date is tomorrow (same day or next day allowed)
                                            const tomorrow = new Date(now);
                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                            return formatLocalDate(tomorrow);
                                        })()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(() => {
                                            const now = new Date();
                                            const currentHour = now.getHours();
                                            if (currentHour >= 16) {
                                                return "Select tomorrow";
                                            }
                                            return "Select today or tomorrow";
                                        })()}
                                    </p>
                                </div>
                            </div>

                            {/* Origin Address (Seller's Address) */}
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Pickup Address (Your Address)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="origin_address_name"
                                            value={formData.origin_address_name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number *
                                        </label>
                                        <PhoneInput
                                            international
                                            defaultCountry="AE"
                                            value={phoneNumber}
                                            onChange={handlePhoneChange}
                                            placeholder="Enter mobile number"
                                            className="w-full phone-input-custom"
                                            numberInputProps={{
                                                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            House Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="origin_address_house_no"
                                            value={formData.origin_address_house_no}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="House/Villa number"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Building Name
                                        </label>
                                        <input
                                            type="text"
                                            name="origin_address_building_name"
                                            value={formData.origin_address_building_name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Building name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Area *
                                        </label>
                                        <input
                                            type="text"
                                            name="origin_address_area"
                                            value={formData.origin_address_area}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Area/Community"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Landmark
                                        </label>
                                        <input
                                            type="text"
                                            name="origin_address_landmark"
                                            value={formData.origin_address_landmark}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nearby landmark"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <select
                                            name="origin_address_city"
                                            value={formData.origin_address_city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="Dubai">Dubai</option>
                                            <option value="Abu Dhabi">Abu Dhabi</option>
                                            <option value="Sharjah">Sharjah</option>
                                            <option value="Ajman">Ajman</option>
                                            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                                            <option value="Fujairah">Fujairah</option>
                                            <option value="Umm Al Quwain">Umm Al Quwain</option>
                                        </select>
                                    </div>
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
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Creating Delivery..." : "Create Delivery Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading order details...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ArrangeDelivery() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ArrangeDeliveryContent />
        </Suspense>
    );
}

export default ArrangeDelivery;