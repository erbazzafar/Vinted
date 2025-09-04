'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import AddNewCardModal from './stripeCardAddition';
import Link from "next/link";
import Cookies from 'js-cookie'

const CheckoutPage = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    address1: '',
    city: '',
    country: '',
    zipCode: '',
    phone: '',
    price: 0,
    totalPrice: 0,
    vat: 0
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

  const router = useRouter();
  const [checkbox, setCheckbox] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const vat = finalPrice * 0.05;
        const finalInclPrice = vat + finalTotalPrice;

        console.log("vat Price ==> ", vat);
        console.log("Final price ==> ", finalTotalPrice);

        setUserDetails((prevDetails) => ({
          ...prevDetails,
          price: finalPrice,
          totalPrice: finalInclPrice,
          vat: vat
        }));

        console.log("total price in API call: ", userDetails.totalPrice);


        console.log("Matched Bid:", matchedBid);
        console.log("Parsed product info from localStorage:", parsedData);
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
        toUserId: toUserId || "",
        fullName: userDetails.fullName,
        email: userDetails.email,
        address1: userDetails.address1,
        address2: 'Street 2',
        city: userDetails.city,
        country: userDetails.country,
        zipCode: userDetails.zipCode,
        subTotal: userDetails.totalPrice,

        fromUserId: fromUserId || "",
        phone: userDetails.phone,
        vat: userDetails.vat,
        total: userDetails.price,
      }

      // setOrderFormData(payload);

      const requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("user-token")}`, // Pass the token here
        },
        body: JSON.stringify(payload), // Convert formdata to JSON string
      };

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/create`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            toast.success("Order Placed")
            router.push("/")
          } else if (resp.status === "TokenExpiredError") {
            toast.error("Network Error");
          }
          else if (resp.status === "fail") {
            toast.error("Network Error");
          }
        })
        .catch((error) => {
          toast.error("Network Error");
          console.error(error);
        });
      return;
    } catch (error) {
      console.log("Error submitting order:", error);
      toast.error("Error submitting order. Please try again.");
      return
    }
  }

  console.log("orderFormData", orderFormData);

  return (
    <div className="max-w-7xl mx-auto mt-8 py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Address Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <label htmlFor="fullName"
              className='text-black text-md font-semibold'>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={userDetails.fullName}
              onChange={handleChange}
              placeholder="Enter your Full Name"
              className="w-full border rounded-md px-4 py-2"
            />
            <label htmlFor="email"
              className='text-black text-md font-semibold'>
              Email
            </label>
            <input
              type="text"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-full border rounded-md px-4 py-2"
            />
            <label htmlFor="Address"
              className='text-black text-md font-semibold'>
              Address
            </label>
            <input
              type="text"
              name="address1"
              value={userDetails.address1}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border rounded-md px-4 py-2"
            />
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor="city" className='text-black text-md font-semibold'>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={userDetails.city}
                  onChange={handleChange}
                  placeholder="Enter your City"
                  className="w-full border rounded-md px-4 py-2 mt-1"
                />
              </div>

              <div>
                <label htmlFor="country" className='text-black text-md font-semibold'>
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={userDetails.country}
                  onChange={handleChange}
                  placeholder="Enter your Country"
                  className="w-full border rounded-md px-4 py-2 mt-1"
                />
              </div>
            </div>
            <label htmlFor="zipcode"
              className='text-black text-md font-semibold'>
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={userDetails.zipCode}
              onChange={handleChange}
              placeholder="Enter the Zip Code"
              className="w-full border rounded-md px-4 py-2"
            />
            <label htmlFor="phone"
              className='text-black text-md font-semibold'>
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={userDetails.phone}
              onChange={handleChange}
              placeholder="Enter the Phone Number"
              className="w-full border rounded-md px-4 py-2"
            />
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
                height={70}
                unoptimized
                className="w-118 h-70 object-contain rounded-md m-3"
              />
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{productInfo?.name}</h3>

              <div className="flex items-center gap-2 mt-3">
                <h3 className="text-md font-semibold">VAT (5%):</h3>
                <div className="flex items-center gap-1 text-md font-semibold text-teal-600">
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

              <div className="flex items-center gap-2 mt-3">
                <h3 className="text-md font-semibold">Total Price:</h3>
                <div className="flex items-center gap-1 text-md font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={18}
                    height={18}
                    unoptimized
                  />
                  <span>{userDetails.totalPrice?.toFixed(2)}</span>
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
                if (!userDetails.fullName || !userDetails.email || !userDetails.address1 || !userDetails.city || !userDetails.country || !userDetails.zipCode || !userDetails.phone) {
                  toast.error("Please fill in all fields")
                  return
                }
                handleOrderSubmit();
                // setIsCardModalOpen(true)
              }}
              className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition"
            >
              {/* Proceed to Payment */}
              Place Order
            </button>
          </div>
          {/*add card modal*/}
          <Modal open={isCardModalOpen} onClose={() => setIsCardModalOpen(false)}>
            <Box
              className="bg-white p-6 rounded-lg shadow-lg w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <AddNewCardModal formData={orderFormData} />
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage