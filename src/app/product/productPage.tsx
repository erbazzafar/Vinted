"use client";
import { useEffect, useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import SellerButton from "../components/routeSellerButton";
import ProductCarousel from "../components/productCorousel";

const ProductPage = () => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [gettingProduct, setGettingProduct] = useState<any>("")
  const router = useRouter();

  const [hidden, setHidden] = useState(false)

  const token = Cookies.get("token")
  const loggedInUser = Cookies.get("userId")
  const [bump, setBump] = useState(false);
  const [bumpDayCheck, setBumpDayCheck] = useState(0)


  const { id: productId } = useParams()
  console.log("product id: ", productId)

  useEffect(() => {
    const fetchingProduct = async () => {
      try {
        if (!productId) {
          toast.error("Product id not Found")
          return
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.status !== 200) {
          toast.error("Error fetching the Product, please try later")
          return
        }
        console.log("Fetching product response: ", response);
        setGettingProduct(response.data.data)
        setBump(response.data.data.bump)
        setBumpDayCheck(response.data.data.bumpDay)
        setHidden(response.data.data.hidden)


      } catch (error) {
        console.log("Error fetching that Product");
        return
      }
    }
    fetchingProduct()
  }, [productId])

  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    if (gettingProduct?.image?.[0]) {
      setMainImage(gettingProduct.image[0]);
    }
  }, [gettingProduct]);

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-lg">
        {"★".repeat(fullStars)}
        {halfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.error("Please login to buy the product")
      return
    }
    localStorage.setItem("productsInfo", JSON.stringify(gettingProduct));
    router.push(`/checkout?productId=${productId}&userId=${loggedInUser}&adminUser=${gettingProduct?.userId?._id}`);
  };

  const handleChat = () => {
    if (!token) {
      toast.error("Please login to chat with the seller")
      return
    }
    // return console.log("gettingProduct ", gettingProduct);
    localStorage.setItem("product", JSON.stringify(gettingProduct));
    localStorage.setItem("fromProductPage", "true")
    router.push(`/inbox/${gettingProduct?._id}?id=${gettingProduct?._id}`);
  };

  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);
  const [bumpDays, setBumpDays] = useState<Array<{ _id: string; day: string; percentage: string }>>([]);
  const [selectedBumpDays, setSelectedBumpDays] = useState<{ _id: string; day: string; percentage: string } | null>(null);

  useEffect(() => {
    const getBump = async () => {
      try {
        if (!productId) {
          toast.error("Product not Found");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bump/viewAll`);

        if (response.status !== 200) {
          toast.error("Error fetching the bump prices");
          return;
        }

        setBumpDays(response.data.data);
      } catch (error) {
        console.log("Error fetching the Bump Prices", error);
        toast.error("Error fetching the Bump Prices");
      }
    };

    getBump();
  }, [productId, token, loggedInUser]);

  const handleBump = async (selectedDays: string) => {
    localStorage.setItem("bumpDays", selectedDays)
    localStorage.setItem("percentage", selectedBumpDays.percentage)
    router.push(`/bump?id=${productId}`)
  };


  const handleHide = async () => {
    try {
      if (!loggedInUser || !token || !productId) {
        toast.error("Missing user credentials or product ID");
        return;
      }

      // Use the *intended* new value before calling API
      const newHiddenValue = !hidden;

      const formData = new FormData();
      formData.append("hidden", newHiddenValue.toString());

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200 || !response.data?.data) {
        toast.error("Failed to update visibility");
        return;
      }

      const updatedHidden = response.data.data.hidden;
      setHidden(updatedHidden);

      toast.success(updatedHidden ? "Item hidden" : "Item is now visible");
    } catch (error) {
      console.error("Error updating product visibility:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="mt-10">
      <div className="container mx-auto sm:px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
          {/* Left: Product Images */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail Images - Below main image on mobile, to the left on desktop */}
            <div className="flex flex-row md:flex-col gap-4 px-6 md:px-0 order-2 md:order-1">
              {gettingProduct?.image?.slice(0, 4)?.map((image: any, index: any) => (
                <div key={index} className="relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    unoptimized
                    className={`object-contain rounded-lg cursor-pointer border ${mainImage === image ? "border-teal-500" : "border-gray-300"
                      }`}
                    onClick={() => setMainImage(image)}
                  />
                  {index === 3 && gettingProduct?.image?.length > 4 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer"
                      onClick={() => setShowCarousel(true)}
                    >
                      <Plus size={24} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full px-6 md:px-0 order-1 md:order-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mainImage}`}
                alt={"Product"}
                width={500}
                height={600}
                unoptimized
                className="w-full h-[530px] object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Carousel Modal */}
            <Modal open={showCarousel} onClose={() => setShowCarousel(false)}>
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 rounded-lg shadow-lg w-[95%] md:w-[65%] max-w-xl h-[600px] overflow-hidden">
                <Carousel
                  responsive={{
                    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
                  }}
                  infinite
                  autoPlay={false}
                  keyBoardControl
                  showDots
                  arrows
                >
                  {gettingProduct?.image?.map((image: any, index: any) => (
                    <div key={index} className="w-full h-[600px] flex justify-center items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                        alt={`Product ${index}`}
                        width={950}
                        height={600}
                        unoptimized
                        className="w-full h-[600px] object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </Box>
            </Modal>
          </div>

          {/* Right: Product Details */}
          <div className="bg-white space-y-1 px-6 md:px-0">
            <div className=" border-b border-gray-200 pb-3">
              <h1 className="text-[14px] md:text-[14px] font-bold text-gray-800">
                {gettingProduct?.name}
              </h1>

              <div className="flex items-center space-x-2 mt-1">
                {getStarRating(gettingProduct.ratings)}
                <span className="text-[12px] text-gray-500">{gettingProduct?.ratings} (Reviews)</span>
              </div>
              <p className="text-[12px] text-gray-600">{gettingProduct?.description}</p>
            </div>

            {/* === Set 2: Description, Brand, Size, Color, Category === */}
            <div className=" border-b border-gray-200 pb-2">

              <div>
                <label className="text-[13px] font-medium text-gray-600">Brand:</label>
                <span className="text-[13px] text-gray-600 ml-1">{gettingProduct?.brandId?.name || "None"}</span>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">Size:</label>
                <span className="text-[13px] text-gray-600 ml-1">{gettingProduct?.sizeId?.name || "N/A"}</span>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">Color:</label>
                <span className="text-[13px] text-gray-600 ml-1">{gettingProduct?.colorId?.[0].name || "N/A"}</span>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">Category:</label>
                <span className="text-[13px] text-gray-600 ml-1">{gettingProduct?.categoryId?.[gettingProduct?.categoryId.length - 1]?.name || "Other"}</span>
              </div>
            </div>

            {/* === Set 3: Pricing Section === */}
            <div className="space-y-2">
              {/* Product Price */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] font-medium text-gray-600">Product Price:</label>
                <div className="flex items-center gap-1 text-[14px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={15}
                    height={15}
                    unoptimized />
                  <span>{gettingProduct?.price}</span>
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] font-medium text-gray-600">Shipping Cost:</label>
                <div className="flex items-center gap-1 text-[14px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={15}
                    height={15}
                    unoptimized />
                  <span>{gettingProduct.shipPrice}</span>
                </div>
              </div>

              {/* Protection Fee */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] font-medium text-gray-600">Protection Fee:</label>
                <div className="flex items-center gap-1 text-[14px] font-semibold text-teal-600">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={15}
                    height={15}
                    unoptimized />
                  <span>{gettingProduct.inclPrice}</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-300">
                <label className="text-[16px] font-bold text-gray-700">Total Price:</label>
                <div className="flex items-center gap-1 text-[18px] font-bold text-green-700">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={17}
                    height={17}
                    unoptimized />
                  <span>{gettingProduct.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Contact Seller Button */}
            {gettingProduct?.userId?._id === loggedInUser ? (
              <>
                <button
                  className={`text-lg mt-4 flex items-center justify-center gap-2 w-full px-7 py-2 rounded-lg transition
                    ${bump && bumpDayCheck > 0 ? 
                      "bg-gray-300 text-green-600 cursor-not-allowed" : 
                      "bg-gray-800 text-white hover:bg-gray-300 hover:text-gray-950 cursor-pointer"}
  `               }
                  disabled={bump && bumpDayCheck > 0}
                  onClick={() => {
                    if (bump && bumpDayCheck > 0) return; // already bumped, do nothing

                    if (token) {
                      setIsBumpModalOpen(true);
                    } else {
                      toast.error("Login first to Bump product");
                    }
                  }}
                >
                  <span>{bump && bumpDayCheck > 0 ? "Bumped ✅" : "Bump"}</span>
                </button>

                <button
                  className={`text-lg mt-2 flex items-center justify-center gap-2 w-full text-white px-7 py-2 rounded-lg transition cursor-pointer 
                    ${hidden ? 
                      "bg-gray-400 text-gray-950" : 
                      "bg-gray-800 hover:bg-gray-300 hover:text-gray-950"
                    }`}
                  onClick={handleHide}
                >
                  <span>{hidden ? "Unhide Product" : "Hide"}</span>
                </button>

                <SellerButton
                  seller={{
                    username: gettingProduct?.userId?.username,
                    profileImage: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${gettingProduct?.userId?.image}`,
                    rating: gettingProduct?.userId?.rating,
                    reviews: gettingProduct?.userId?.reviews,
                  }}
                  sellerId={gettingProduct?.userId?._id}
                />

                {/*Bump Modal*/}
                <Modal open={isBumpModalOpen} onClose={() => setIsBumpModalOpen(false)}>
                  <Box className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[500px] max-h-[70vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-[13px] font-semibold mb-4">Select how many days you want to bump your product</h2>

                    {/* Horizontal bump day options */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {Array.isArray(bumpDays) &&
                        bumpDays.map((option) => {
                          const isSelected = selectedBumpDays?.day === option.day;
                          const bumpPrice = ((Number(option.percentage) / 100) * Number(gettingProduct?.price || 0)).toFixed(2);

                          return (
                            <button
                              key={option._id}
                              className={`cursor-pointer min-w-[140px] flex items-center justify-center gap-2 text-[13px] px-3 py-2 rounded-lg border whitespace-nowrap transition-colors duration-200 ${isSelected
                                ? 'bg-gray-800 text-white border-gray-900'
                                : 'bg-gray-100 text-black border-gray-300'
                                }`}
                              onClick={() => setSelectedBumpDays(option)}
                            >
                              {option.day} days  –
                              <div className="flex items-center gap-1">
                                <Image
                                  src="/dirhamlogo.png"
                                  alt="dirham"
                                  height={15}
                                  width={15}
                                />
                                <span>{bumpPrice}</span>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        className="cursor-pointer bg-gray-300 text-[13px] text-black px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setIsBumpModalOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        disabled={bump || !selectedBumpDays}
                        className={`cursor-pointer text-[13px] px-4 py-2 rounded ${bump
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                        onClick={async () => {
                          if (bump) {
                            toast.error("This product is already bumped");
                            return;
                          }

                          await handleBump(selectedBumpDays.day);
                          setIsBumpModalOpen(false);
                        }}
                      >
                        {bump ? "Already Bumped" : "Confirm Bump"}
                      </button>
                    </div>
                  </Box>
                </Modal>
              </>
            ) : (
              <>
                <button
                  className="text-xl mt-5 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-2 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
                  onClick={handleBuyNow}
                >
                  <span>Buy Now</span>
                </button>

                <button
                  className="text-xl mt-3 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-2 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
                  onClick={handleChat}
                >
                  <span>Chat with Seller</span>
                  <MessageCircle size={20} className="shrink-0" />
                </button>

                <SellerButton
                  seller={{
                    username: gettingProduct?.userId?.username,
                    profileImage: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${gettingProduct?.userId?.image}`,
                    rating: gettingProduct?.userId?.rating,
                    reviews: gettingProduct?.userId?.reviews,
                  }}
                  sellerId={gettingProduct?.userId?._id}
                />
              </>
            )}

          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default ProductPage;