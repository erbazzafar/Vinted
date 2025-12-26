'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from "next/link";
import StripeCheckout from '../components/stripeCardAddition';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Cookies from 'js-cookie';

const BundleCheckout = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    address1: '',
    city: '',
    country: 'AE',
    phone: '',
    phoneCode: '971',
    houseNo: '',
    buildingName: '',
    area: '',
    landmark: '',
  })
  const [phoneNumber, setPhoneNumber] = useState('+971')
  const [bundleProducts, setBundleProducts] = useState<any[]>([])
  const searchParams = useSearchParams()
  const sellerId = searchParams.get('sellerId')
  const [orderFormData, setOrderFormData] = useState<any>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [checkbox, setCheckbox] = useState(false);

  // Constants for calculations
  const shippingCharges = 16.53;
  const vatAmount = 0.83;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value || '+971');

    if (value) {
      try {
        const phoneNumberObj = parsePhoneNumber(value);
        if (phoneNumberObj) {
          const countryCode = phoneNumberObj.countryCallingCode;
          const nationalNumber = phoneNumberObj.nationalNumber;
          setUserDetails(prev => ({
            ...prev,
            phoneCode: countryCode,
            phone: nationalNumber
          }));
        }
      } catch (error) {
        console.error('Error parsing phone number:', error);
      }
    }
  }

  useEffect(() => {
    // Get bundle products from localStorage
    const storedProducts = localStorage.getItem('bundleProducts');
    const storedEmail = localStorage.getItem('userEmail');
    const storedFullName = localStorage.getItem('userFullName');

    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        setBundleProducts(parsedProducts);
      } catch (error) {
        console.error("Error parsing bundle products from localStorage:", error);
        toast.error("Error loading products");
      }
    }

    // Pre-fill email and fullName from localStorage
    if (storedEmail || storedFullName) {
      setUserDetails(prev => ({
        ...prev,
        email: storedEmail || prev.email,
        fullName: storedFullName || prev.fullName
      }));
    }
  }, []);


  // Calculate total products price (sum of all product prices + protection fees)
  const totalProductsPrice = bundleProducts.reduce((sum, product) => {
    return sum + Number(product.price || 0);
  }, 0);

  const totalProtectionFees = bundleProducts.reduce((sum, product) => {
    return sum + Number(product.inclPrice || 0);
  }, 0);


  const handleOrderSubmit = async () => {
    if (!checkbox) {
      toast.error("Accept Terms and Conditions");
      return;
    }

    try {
      // Get product IDs array
      const productIds = bundleProducts.map(product => product._id);

      // Calculate final total (matching the display calculation)
      const finalTotal = (Number(totalProductsPrice.toFixed(2)) + Number(totalProtectionFees.toFixed(2)) + shippingCharges + vatAmount).toFixed(2);

      const payload: any = {
        cardId: '1234567890',
        brand: 'Etc',
        last4: '1234',
        expMonth: '12',
        expYear: '2027',
        productId: productIds,
        fullName: userDetails.fullName,
        email: userDetails.email,
        address1: userDetails.address1,
        city: userDetails.city,
        country: userDetails.country,
        phone: userDetails.phone,
        phoneCode: userDetails.phoneCode,
        houseNo: userDetails.houseNo,
        buildingName: userDetails.buildingName,
        area: userDetails.area,
        landmark: userDetails.landmark,
        subTotal: finalTotal,
        fromUserId: Cookies.get("userId") || "",
        toUserId: sellerId || "",
        vat: vatAmount,
        total: Number(totalProductsPrice.toFixed(2)),
        shipping: shippingCharges,
        isBundle: true,
      }
      setOrderFormData(payload);
      return;
    } catch (error) {
      console.log("Error submitting order:", error);
      toast.error("Error submitting order. Please try again.");
      return
    }
  }

  const handleBuyNow = () => {
    if (!userDetails.fullName || !userDetails.email || !phoneNumber || phoneNumber.length < 4 || !userDetails.houseNo || !userDetails.area || !userDetails.address1 || !userDetails.city) {
      toast.error("Please fill in all required fields")
      return
    }
    if (!checkbox) {
      toast.error("Accept Terms and Conditions");
      return;
    }
    handleOrderSubmit();
    setIsCardModalOpen(true);
  }

  if (bundleProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-8 py-10 px-5 text-center">
        <h2 className="text-2xl font-bold mb-4">No products in bundle</h2>
        <p className="text-gray-600 mb-4">Please go back and select products for your bundle.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Address Form */}
        <div className="bg-white p-6 rounded-xl shadow-md h-[max-content]">
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
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <PhoneInput
                international
                defaultCountry="AE"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="w-full phone-input-custom"
                numberInputProps={{
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                }}
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

        {/* Right Side: Products + Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-[max-content]">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {/* Products List */}
          <div className="space-y-4 mb-6">
            {bundleProducts.map((product: any, index: number) => {
              const productPrice = Number(product.price || 0);
              const protectionFee = Number(product.inclPrice || 0);
              const productTotal = productPrice + protectionFee;

              return (
                <div key={product._id || index} className="border border-gray-200 rounded-lg p-4">
                  {/* Product Image and Name */}
                  <div className="flex gap-4 mb-3">
                    {product.image?.[0] && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
                        alt={product.name || "Product Image"}
                        width={100}
                        height={100}
                        unoptimized
                        className="w-24 h-24 object-contain rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold">Product Price:</span>
                      <div className="flex items-center gap-1 text-[13px] font-semibold text-teal-600">
                        <Image
                          src="/dirhamlogo.png"
                          alt="dirham"
                          width={16}
                          height={16}
                          unoptimized
                        />
                        <span>{productPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold">Protection Fee:</span>
                      <div className="flex items-center gap-1 text-[13px] font-semibold text-teal-600">
                        <Image
                          src="/dirhamlogo.png"
                          alt="dirham"
                          width={16}
                          height={16}
                          unoptimized
                        />
                        <span>{protectionFee.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <span className="text-[14px] font-semibold">Product Total Price:</span>
                      <div className="flex items-center gap-1 text-[14px] font-semibold text-teal-600">
                        <Image
                          src="/dirhamlogo.png"
                          alt="dirham"
                          width={16}
                          height={16}
                          unoptimized
                        />
                        <span>{productTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="border-t border-gray-300 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold">Total Products Price:</span>
              <div className="flex items-center gap-1 text-[18px] font-semibold text-teal-600">
                <Image
                  src="/dirhamlogo.png"
                  alt="dirham"
                  width={20}
                  height={20}
                  unoptimized
                />
                <span>{totalProductsPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold">Products Protection Fees:</span>
              <div className="flex items-center gap-1 text-[18px] font-semibold text-teal-600">
                <Image
                  src="/dirhamlogo.png"
                  alt="dirham"
                  width={20}
                  height={20}
                  unoptimized
                />
                <span>{totalProtectionFees.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold">Shipping:</span>
              <div className="flex items-center gap-1 text-[18px] font-semibold text-teal-600">
                <Image
                  src="/dirhamlogo.png"
                  alt="dirham"
                  width={20}
                  height={20}
                  unoptimized
                />
                <span>{shippingCharges}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold">VAT <span className='text-[14px] text-gray-600'>(5% of shipping)</span>:</span>
              <div className="flex items-center gap-1 text-[18px] font-semibold text-teal-600">
                <Image
                  src="/dirhamlogo.png"
                  alt="dirham"
                  width={20}
                  height={20}
                  unoptimized
                />
                <span>{vatAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
              <span className="text-[20px] font-bold">Total Price:</span>
              <div className="flex items-center gap-1 text-[20px] font-bold text-teal-600">
                <Image
                  src="/dirhamlogo.png"
                  alt="dirham"
                  width={22}
                  height={22}
                  unoptimized
                />
                <span>{(Number(totalProductsPrice.toFixed(2)) + Number(totalProtectionFees.toFixed(2)) + shippingCharges + vatAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[10px] mt-6'>
            <input
              type='checkbox'
              id='checkbox-terms'
              checked={checkbox}
              onChange={() => setCheckbox(!checkbox)}
            />
            <label htmlFor='checkbox-terms' className='text-[14px]'>I have read and accepted <Link href="/terms-and-condition" className='underline font-[600]'>Terms and Conditions</Link></label>
          </div>

          <div className="mt-6">
            <button
              onClick={handleBuyNow}
              className={`w-full py-2 rounded-md transition bg-gray-600 hover:bg-gray-700 text-white cursor-pointer`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Stripe Card Modal */}
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
  )
}

export default BundleCheckout

