'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from "next/link";
import StripeCheckout from './stripeCardAddition';

const CheckoutPage = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    address1: '',
    city: '',
    country: 'AE',
    zipCode: '',
    phone: '',
    phoneCode: '971',
    houseNo: '',
    buildingName: '',
    area: '',
    landmark: '',
    price: 0,
    totalPrice: 0,
    vat: 0,
    shipPrice: 0,
    protectionFee: 0
  })
  const [productInfo, setProductInfo] = useState<any>(null)
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const fromUserId = searchParams.get('userId')
  const toUserId = searchParams.get('adminUser')
  const [orderFormData, setOrderFormData] = useState<any>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const bids = productInfo?.bid || [];
  const matchedBid = bids.find((bid: any) => bid?.userId?.toString() === fromUserId?.toString());

  const [checkbox, setCheckbox] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const storedData = localStorage.getItem('productsInfo');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProductInfo(parsedData);

        const bids = parsedData?.bid || [];
        const matchedBid = bids.find((bid: any) => bid?.userId?.toString() === fromUserId?.toString());

        const finalPrice = matchedBid?.price || parsedData?.price;
        const finalTotalPrice = matchedBid?.totalPrice || parsedData?.totalPrice;
        const vat = parsedData?.vat || 0.7;
        const shipPrice = parsedData?.shipPrice || 0.7;
        const finalInclPrice = finalTotalPrice;
        const protectionFee = matchedBid?.inclPrice || parsedData?.inclPrice || 0;

        setUserDetails((prevDetails) => ({
          ...prevDetails,
          price: finalPrice,
          totalPrice: finalInclPrice,
          vat: vat,
          shipPrice,
          protectionFee
        }));

      } catch (error) {
        console.error("Error parsing product info from localStorage:", error);
      }
    }
  }, [productId, fromUserId, toUserId]);

  const handleOrderSubmit = async () => {

    if (!checkbox) {
      toast.error("Accept Terms and Condtions");
      return;
    }

    // Ideally send data to backend or Stripe here
    try {

      const payload: any = {
        cardId: '1234567890',
        brand: 'Etc',
        last4: '1234',
        expMonth: '12',
        expYear: '2027',
        productId: [`${productId}`],
        fullName: userDetails.fullName,
        email: userDetails.email,
        address1: userDetails.address1,
        city: userDetails.city,
        country: userDetails.country,
        zipCode: userDetails.zipCode,
        phone: userDetails.phone,
        phoneCode: userDetails.phoneCode,
        houseNo: userDetails.houseNo,
        buildingName: userDetails.buildingName,
        area: userDetails.area,
        landmark: userDetails.landmark,
        subTotal: userDetails.totalPrice,
        fromUserId: fromUserId || "",
        toUserId: toUserId || "",
        vat: userDetails.vat,
        total: userDetails.price,
        shipPrice: userDetails.shipPrice,
      }
      setOrderFormData(payload);
      return;
    } catch (error) {
      console.log("Error submitting order:", error);
      toast.error("Error submitting order. Please try again.");
      return
    }
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Address Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

          {/* Personal Information */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={userDetails.phone}
                onChange={handleChange}
                placeholder="Enter phone number (e.g., +971501234567)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House/Villa Number *
                </label>
                <input
                  type="text"
                  name="houseNo"
                  value={userDetails.houseNo}
                  onChange={handleChange}
                  placeholder="House/Villa number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Name
                </label>
                <input
                  type="text"
                  name="buildingName"
                  value={userDetails.buildingName}
                  onChange={handleChange}
                  placeholder="Building name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Community *
                </label>
                <input
                  type="text"
                  name="area"
                  value={userDetails.area}
                  onChange={handleChange}
                  placeholder="Area/Community"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={userDetails.landmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address1"
                value={userDetails.address1}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={userDetails.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={userDetails.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                disabled
                type="text"
                name="country"
                value={userDetails.country}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Product Preview + Card Input */}
        <div className=" grid-cols-2 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex flex-col mb-4">
            {productInfo?.image?.[0] && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${productInfo?.image[0]}`}
                alt={productInfo?.name || "Product Image"}
                width={200}
                height={100}
                unoptimized
                className="w-118 h-100 object-contain rounded-md m-3 shadow-lg"
              />
            )}
            <div className="mt-4">
              <h3 className="text-[23px] font-bold">{productInfo?.name}</h3>

              <div className="flex items-center gap-2 mt-3">
                <h3 className="text-[15px] font-semibold">Product Price:</h3>
                <div className="flex items-center gap-1 text-[15px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={18}
                    height={18}
                    unoptimized
                  />
                  <span>{userDetails.price?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <h3 className="text-[15px] font-semibold">Shipping Charges:</h3>
                <div className="flex items-center gap-1 text-[15px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={18}
                    height={18}
                    unoptimized
                  />
                  <span>{userDetails.shipPrice?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <h3 className="text-[15px] font-semibold">VAT <span className='text-[12px] text-gray-600'>(5% of shipping charges)</span>:</h3>
                <div className="flex items-center gap-1 text-[15px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={18}
                    height={18}
                    unoptimized
                  />
                  <span>{userDetails.vat?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <h3 className="text-[15px] font-semibold">Protection Fee:</h3>
                <div className="flex items-center gap-1 text-[15px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={18}
                    height={18}
                    unoptimized
                  />
                  <span>{userDetails.protectionFee?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 border-y border-gray-300 py-2">
                <h3 className="text-[18px] font-semibold">Total Price:</h3>
                <div className="flex items-center gap-1 text-[18px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={20}
                    height={20}
                    unoptimized
                  />
                  <span>{userDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[10px]'>
            <input type='checkbox' id='checkbox-terms' onChange={() => setCheckbox(!checkbox)} />
            <label htmlFor='checkbox-terms' className='text-[14px]'>I have read and accepted <Link href="/terms-and-condition" className='underline font-[600]'>Terms and Conditions</Link></label>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={() => {
                if (!userDetails.fullName || !userDetails.email || !userDetails.phone || !userDetails.houseNo || !userDetails.area || !userDetails.address1 || !userDetails.city || !userDetails.zipCode) {
                  toast.error("Please fill in all required fields")
                  return
                }
                handleOrderSubmit();
                setIsCardModalOpen(true)
              }}
              className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition"
            >
              {/* Proceed to Payment */}
              Place Order
            </button>
          </div>
          {/*add card modal*/}
          <Modal
            open={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)}
            className="flex justify-center items-center p-4 sm:p-6 backdrop-blur-sm bg-black/40"
          >
            <Box
              className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6 overflow-y-auto max-h-[90vh]"
            >
              <StripeCheckout formData={orderFormData} />
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage