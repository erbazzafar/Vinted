"use client";

import React, { useState } from "react";
import { products } from "./lensDemo";
import Link from "next/link";
import { Heart } from "lucide-react";

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

  return (
    
    <div className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[300px]">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[300px] object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="mt-3">
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
          {product.discountedPrice} <span className="text-xs text-gray-400">incl.</span>
        </p>
      </div>
    </div>
  );
};


const Filter = () => {
  // Assume we're filtering by "gadget" category for now
  const categoryName = "gadget";
  const [filteredProducts, setFilteredProducts] = useState(
    products.filter((product) => product.category === categoryName)
  );

  return (
    <div>
      <div className="mt-15 w-full bg-white">
      {/* Full-width slider container matching the navbar */}
      <div className="container mx-auto max-w-screen-2xl bg-black rounded-xl">
        <div className="relative flex justify-center h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-xl opacity-[0.4]">
          <img 
            src="/eicon.avif" 
            alt="Slider Image"
            className="w-full h-full object-center object-cover rounded-lg"
          />
          <p
           className="absolute left-0 top-0 text-white text-5xl font-bold w-full h-full flex justify-center items-center">
            {
              categoryName.toUpperCase()
            }
          </p>
        </div>
      </div>
    </div>
    <div>
      <h1 className="mt-10 text-2xl container mx-auto max-w-screen-2xl rounded-xl">
        
      {categoryName[0].toUpperCase() + categoryName.slice(1).toLowerCase()}
      </h1>
    </div>
      <div className="container mx-auto max-w-screen-2xl px-1 py-6">
        {/* Category Name as Link */}
        {/* <div className="mb-4">
          <Link
            href={`/category/${categoryName}`}
            className="text-xl font-bold text-blue-600 hover:underline"
          >
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
          </Link>
        </div> */}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="col-span-full text-gray-500 text-center">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
