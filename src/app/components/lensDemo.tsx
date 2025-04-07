"use client"
import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

// Sample product list
export const products = [
  {
    id: 1,
    name: "Controller-XBOX",
    image: "/pexels-stasknop-1298601.jpg",
    size: "Normal",
    originalPrice: "$150",
    discountedPrice: "$120",
    rating: 4.5,
    category: "gadget"
  },
  {
    id: 2,
    name: "Watch",
    image: "/pexels-pixabay-277390.jpg",
    size: "10",
    originalPrice: "$180",
    discountedPrice: "$140",
    rating: 4.2,
    category: "gadget"
  },
  {
    id: 3,
    name: "Gold Rings",
    image: "/pexels-pixabay-248077.jpg",
    size: "16",
    originalPrice: "$130",
    discountedPrice: "$100",
    rating: 3.8,
    category: "Jewelery"
  },
  {
    id: 4,
    name: "Rider Watch",
    image: "/pexels-anthony-derosa-39577-236915.jpg",
    size: "9",
    originalPrice: "$90",
    discountedPrice: "$75",
    rating: 4.0,
    category: "gadget"
  },
  {
    id: 5,
    name: "Reebok Classic",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX0FcIaWxjHcy8ojw98mYFf9ULVT6F50MYPw&s",
    size: "8",
    originalPrice: "$100",
    discountedPrice: "$80",
    rating: 4.1,
    category: "Shoes", 
    subCategory: "Shoes",
    subSubCategory: "joggers",
    
  },
  {
    id: 5,
    name: "Bomber Jacket",
    image: "/pexels-kowalievska-1127000.jpg",
    size: "8",
    originalPrice: "$100",
    discountedPrice: "$80",
    rating: 4.1,
    category: "Clothings"
  },
  {
    id: 5,
    name: "Rings Pair",
    image: "/pexels-megapixelstock-17834.jpg",
    size: "8",
    originalPrice: "$100",
    discountedPrice: "$80",
    rating: 4.1,
    category: "Jewelery"
  },
  {
    id: 5,
    name: "K240 Headphones",
    image: "/pexels-kinkate-205926.jpg",
    size: "8",
    originalPrice: "$100",
    discountedPrice: "$80",
    rating: 4.1,
    category: "gadget"
  },
  {
    id: 6,
    name: "Sweat Shirt",
    image: "/pexels-dom.jpg",
    size: "9",
    originalPrice: "$85",
    discountedPrice: "$70",
    rating: 4.3,
    category: "clothing"
  },
  {
    id: 6,
    name: "Sweat Shirt",
    image: "/pexels-cottonbro-4066293.jpg",
    size: "9",
    originalPrice: "$85",
    discountedPrice: "$70",
    rating: 4.3,
    category: "clothing"
  },
  {
    id: 6,
    name: "Sweat Shirt",
    image: "/pexels-valentinantonucci-691640.jpg",
    size: "9",
    originalPrice: "$85",
    discountedPrice: "$70",
    rating: 4.3,
    category: "gadget"
  },
];

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


  const ProductCard = ({ product }: { product: any }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

//wishlist functionality


  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[300px] ">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[300px] object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="mt-3 ">
        <div className="flex justify-between">
          {/* Product Name */}
          <Link
            href={`/product/`}
            className="text-lg font-semibold text-gray-800 hover:underline"
          >
            {product.name}
          </Link>

          {/* Wishlist Button */}
          <button
            className={`cursor-pointer mr-3 transition-colors ${
              isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-300"
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart size={22} fill={isWishlisted ? "red" : "none"} />
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
          {product.discountedPrice} <span className="text-xs text-gray-400">incl.</span>
        </p>
      </div>
    </div>
  );
};

const ProductList = () => {
  return (
    <div className="container mx-auto max-w-screen-2xl  py-6">
      <div className="px-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

