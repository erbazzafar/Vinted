"use client";
import { useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import SellerButton from "./routeSellerButton";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const product = {
  id: 1,
  title: "The Atelier Tailored Boot",
  price: 29.5,
  ratings: 4.5,
  image: "/pexels-boot.jpg",
  sizes: "M",
  colors: "White",
  category: "Boots",
  description:
    "Sleek, purified, and boasting an impeccably modern fit, this is a 2-button tailored coat that’s a must-have.",
  thumbnails: [
    "/pexels-boot.jpg",
    "/pexels-alljos-1261422.jpg",
    "/pexels-boot.jpg",
    "/pexels-anthony-derosa-39577-236915.jpg",
    "/pexels-dom.jpg",
    
    "/pexels-martinpechy-2078268.jpg",
  ], 
};

const SellerProductPage = () => {
  const [mainImage, setMainImage] = useState(product.image);
  const [showCarousel, setShowCarousel] = useState(false);
  const router = useRouter();

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

  const handleBump = () => {
    router.push("/inbox");
  };

  const handleReserved = () => {

  }

  const handleSold = () => {

  }

  const handleEdit = () => {

  }

  const handleHide = () => {

  }

  const handleDelete = () => {

  }


  return (
    <div className="mt-20">
      <div className="container mx-auto  sm:px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
          {/* Left: Product Images */}
          <div className="flex gap-6">
            {/* Thumbnail Images */}
            <div className="flex flex-col gap-4 relative">
              {product.thumbnails.slice(0, 4).map((thumb, index) => (
                <div key={index} className="relative">
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className={`object-cover rounded-lg cursor-pointer border ${
                      mainImage === thumb ? "border-teal-500" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(thumb)}
                  />
                  {/* Plus Icon on 4th Thumbnail */}
                  {index === 3 && product.thumbnails.length > 4 && (
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
                  {product.thumbnails.map((image, index) => (
                    <div key={index} className="w-full h-[600px] flex justify-center items-center">
                      <Image
                        src={image}
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
                src={mainImage}
                alt={product.title}
                width={500}
                height={500}
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="bg-white space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.title}
            </h1>

            <div className="flex items-center space-x-2">
              {getStarRating(product.ratings)}
              <span className="text-gray-500 text-sm">{product.ratings} (35 Reviews)</span>
            </div>

            <p className="text-gray-600">{product.description}</p>

            <p className="text-3xl font-semibold text-teal-600">
              ${product.price.toFixed(2)}
            </p>

            {/* Size Selector */}
            <div>
              <label className="text-sm font-medium text-gray-600">Size:</label>
              <div className="text-lg text-gray-700">{product.sizes}</div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="text-sm font-medium text-gray-600">Color:</label>
              <div className="text-lg text-gray-700">{product.colors}</div>
            </div>


            <button
              className="text-md mt-5 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-3 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleBump}>
                Bump
            </button>
            
            <button
              className="text-md mt-2 flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 px-7 py-3 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleSold}>       
              Mark as Sold
            </button>
            
            <button
              className="text-md mt-2 flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 px-7 py-3 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleReserved}>       
              Mark as Reserved
            </button>
            
            <button
              className="text-md mt-2 flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 px-7 py-3 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleHide}>       
              Hide
            </button>
            
            <button
              className="text-md mt-2 flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 px-7 py-3 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleEdit}>       
              Edit Listing
            </button>
            
            <button
              className="text-md mt-2 flex items-center justify-center gap-2 w-full bg-red-100 text-red-800 px-7 py-3 rounded-lg hover:bg-red-200 transition hover:text-gray-950 cursor-pointer"
              onClick={handleDelete}>       
              Delete
            </button>
            
            

            <SellerButton
              seller={{
                username: "Erbaz",
                profileImage: "/pexels-kowalievska-1127000.jpg",
                rating: 4.5,
                reviews: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductPage;
