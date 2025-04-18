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

  const token = Cookies.get("token")
  const loggedInUser = Cookies.get("userId")


  const {id: productId} = useParams()
  console.log("product id: ", productId)

  useEffect(() => {
    const fetchingProduct = async () => {
      try {
        if(!productId){
          toast.error("Product id not Found")
          return
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.status !== 200){
          toast.error("Error fetching the Product, please try later")
          return
        }
        console.log("Fetching product response: ", response);
        setGettingProduct(response.data.data)

        
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
    if(!token) {
      toast.error("Please login to buy the product")
      return
    }
    localStorage.setItem("productsInfo", JSON.stringify(gettingProduct));
    router.push(`/checkout?productId=${productId}&userId=${loggedInUser}&adminUser=${gettingProduct?.userId?._id}`);
  };

  const handleChat = () => {
    if(!token) {
      toast.error("Please login to chat with the seller")
      return
    }
    localStorage.setItem("product", JSON.stringify(gettingProduct));
    localStorage.setItem("fromProductPage", "true")
    router.push(`/inbox/${gettingProduct?._id}`);
  };


  return (
    <div className="mt-20">
      <div className="container mx-auto  sm:px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
          {/* Left: Product Images */}
          <div className="flex gap-6">
            {/* Thumbnail Images */}
            <div className="flex flex-col gap-4 relative">
              {gettingProduct?.image?.slice(0,4)?.map((image: any, index: any) => (
                <div key={index} className="relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className={`object-cover rounded-lg cursor-pointer border ${
                      mainImage === image ? "border-teal-500" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image)} // Change the mainImage on thumbnail click
                  />
                  {/* Plus Icon on 4th Thumbnail */}
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
                        className="w-full h-[600px] object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </Box>
            </Modal>


            {/* Main Image */}
            <div className="w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mainImage}`}
                alt={gettingProduct?.name}
                width={500}
                height={600}
                className="w-full h-[530px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="bg-white space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {gettingProduct.name}
            </h1>

            <div className="flex items-center space-x-2">
              {getStarRating(gettingProduct.ratings)}
              <span className="text-gray-500 text-sm">{gettingProduct.ratings} () (Reviews)</span>
            </div>

            <p className="text-gray-600">{gettingProduct.description}</p>
            
            <label className="text-md font-medium text-gray-600">Brand:</label>
            <span className="text-gray-600">   {gettingProduct?.brandId?.name || "None"}</span>

            {/* Size Selector */}
            <div>
              <label className="text-md font-medium text-gray-600">Size:</label>
              <span className=" text-gray-600">   {gettingProduct?.sizeId?.name || "None"}</span>
            </div>

            {/* Color Selector */}
            <div>
              <label className="text-md font-medium text-gray-600">Color:</label>
              <span className=" text-gray-600">   {gettingProduct?.colorId?.[0].name || "None"}</span>
            </div>

            {/* Category Selector */}
            <div>
              <label className="text-md font-medium text-gray-600">Category:</label>
              <span className=" text-gray-600">   {gettingProduct?.categoryId?.[gettingProduct?.categoryId.length-1]?.name || "None"}</span>
            </div>


            <label className="text-md font-medium text-gray-600">Price:</label>
            <p className="text-lg font-semibold text-teal-600">
              ${gettingProduct?.price}
            </p>

            <label className="text-md font-medium text-gray-600">Price:</label>
            <p className="text-2xl font-semibold text-teal-600">
              ${gettingProduct?.inclPrice}
              <span className="text-xs text-teal-600"> (incl. of tax)  </span> 
            </p>

            {/* Contact Seller Button */}
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
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductCarousel/>
      </div>
    </div>
  );
};

export default ProductPage;