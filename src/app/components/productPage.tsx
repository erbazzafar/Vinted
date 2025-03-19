"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCarousel from "./productCorousel";
import SellerButton from "./routeSellerButton";
import Image from "next/image";

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
    "/pexels-boot.jpg",
    "/pexels-alljos-1261422.jpg",
  ], 
};

const ProductPage = () => {
  const [mainImage, setMainImage] = useState(product.image);
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

  const handleContact = () => {
    router.push("/check-out");
  };

  const handleChat = () => {
    router.push("/inbox");
  };


  return (
    <div className="mt-20">
      <div className="container mx-auto  sm:px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
          {/* Left: Product Images */}
          <div className="flex gap-6">
            {/* Thumbnail Images */}
            <div className="flex flex-col gap-4">
              {product.thumbnails.map((thumb, index) => (
                <Image
                  key={index}
                  src={thumb}
                  alt={`Thumbnail ${index}`}
                  width={80}
                  height={50}
                  className={`object-cover rounded-lg cursor-pointer border ${
                    mainImage === thumb ? "border-teal-500" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(thumb)}
                />
              ))}
            </div>

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

            {/* Contact Seller Button */}
            <button
              className="text-xl mt-5 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-2 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleContact}
            >
              <MessageCircle size={20} className="shrink-0" />
              <span>Buy Now</span>
            </button>

            <button
              className="text-xl mt-5 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-2 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
              onClick={handleChat}
            >
              <span>Make an Offer</span>
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

      <div className="mt-12">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default ProductPage;
