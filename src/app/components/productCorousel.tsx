"use client";
import { useState } from "react";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

// Dummy Products Data
const products = [
  { id: 1, name: "Laptop", discountedPrice: 999, category: "Shoes", image: "/images/laptop.jpg", rating: 4.5, size: "15-inch" },
  { id: 2, name: "Smart Watch", discountedPrice: 699, category: "Shoes",image: "/pexels-alimadad-1268511.jpg", rating: 4.3, size: "6.5-inch" },
  { id: 3, name: "Headphones", discountedPrice: 199, category: "Shoes", image: "/images/headphones.jpg", rating: 4.0, size: "One Size" },
  { id: 10, name: "Laptop", discountedPrice: 99, category: "Shoes", image: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU", rating: 4.1, size: "Portable" },
  { id: 10, name: "Cotton T-shirt", discountedPrice: 99, category: "Shoes", image: "/pexels-cottonbro-4066293.jpg", rating: 4.1, size: "M" },
  { id: 10, name: "Watch", discountedPrice: 99, image: "/pexels-martinpechy-2078268.jpg", rating: 4.1, size: "Portable" },
  { id: 10, name: "Jewlery", discountedPrice: 99, category: "Shoes", image: "/pexels-jarosz-1687719.jpg", rating: 4.1, size: "Portable" },
  { id: 10, name: "Heels", discountedPrice: 99, category: "Shoes", image: "https://fastly.picsum.photos/id/21/3008/2008.jpg?hmac=T8DSVNvP-QldCew7WD4jj_S3mWwxZPqdF0CNPksSko4", rating: 4.1, size: "Portable" },
  { id: 10, name: "Watch with red ribbon", category: "Shoes", discountedPrice: 99, image: "/pexels-valentinantonucci-691640.jpg", rating: 4.1, size: "Portable" },
  { id: 10, name: "Bluetooth Speaker", category: "Shoes", discountedPrice: 99, image: "/images/speaker.jpg", rating: 4.1, size: "Portable" },
  { id: 10, name: "AZ-Nav Tech Drone",category: "Shoes", discountedPrice: 799, image: "/pexels-k15-photos-233269-744366.jpg", rating: 4.1, size: "64 cm (large)" },
];

// Responsive settings for the carousel
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
  desktop: { breakpoint: { max: 1030, min: 768 }, items: 4 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

// Function to generate star ratings
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

// Product Card Component
const ProductCard = ({ product }: { product: any }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden w-full max-w-[300px] mx-auto">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[250px] object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="mt-3">
        <div className="flex justify-between items-center">
          <Link
            href={`/product/`}
            className="text-lg font-semibold text-gray-800 hover:underline"
          >
            {product.name}
          </Link>

          {/* Wishlist Button */}
          <button
            className={`transition-colors ${
              isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart size={20} fill={isWishlisted ? "red" : "none"} />
          </button>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-1">{getStarRating(product.rating)}</div>

        {/* Size */}
        <p className="text-md text-gray-500">Size: {product.size ?? "N/A"}</p>

        {/* Category */}
        <p className="text-md text-gray-500">Category: {product.category ?? "N/A"}</p>


        {/* Prices */}
        <p className="text-lg font-semibold text-teal-600">
          ${product.discountedPrice} <span className="text-xs text-gray-400">incl.</span>
        </p>
      </div>
    </div>
  );
};


//Custom Button Group
const ButtonGroup = ({ next, previous }: any) => {
  return (
    <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
      <button
        className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-700 pointer-events-auto"
        onClick={previous}
      >
        <ChevronLeft size={30} />
      </button>
      <button
        className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-700 pointer-events-auto"
        onClick={next}
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
};


// Product Carousel Component
const ProductCarousel = () => {
  return (
    <div className="px-1 py-10 max-w-screen-2xl mx-auto">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay={false}
        keyBoardControl
        showDots={false}
        arrows={false}
        customButtonGroup={<ButtonGroup />}
        containerClass="carousel-container overflow-hidden"
        itemClass="p-2 gap-x-4"
      >
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Carousel>
    </div>
  );
};


export default ProductCarousel;
