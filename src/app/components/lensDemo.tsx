"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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

// Component for rendering each product card
const ProductCard = ({ product }: { product: any }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[300px]">
      <div className="relative">
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
          alt={product.name}
          className="w-full h-[300px] object-cover rounded-lg"
        />
      </div>

      <div className="mt-3 px-3">
        <div className="flex justify-between items-center">
          <Link
            href={`/product/${product._id}`}
            className="text-lg font-semibold text-gray-800 hover:underline"
          >
            {product.name}
          </Link>

          <button
            className={`cursor-pointer transition-colors ${
              isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-300"
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart size={22} fill={isWishlisted ? "red" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {getStarRating(product.rating)}
        </div>


        <p className="text-md text-gray-500">Size: {product?.sizeId?.name || "None"}</p>
        <p className="text-md text-gray-500">Category: {product.categoryId?.name ?? "N/A"}</p>
        <p className="text-lg font-semibold text-teal-600">
          ${product.price}{" "}
        </p>
        <p className="text-lg font-semibold text-teal-600">
          ${product.inclPrice}{" "}
          <span className="text-xs text-gray-400">incl.</span>
        </p>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const getSellerProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll`
        );

        if (response.status !== 200) {
          toast.error("Cannot find any products");
          return;
        }
        
        setProducts(response.data.data);
      } catch (error) {
        toast.error("Error fetching the products");
        console.error("Error fetching the products", error);
      }
    };

    getSellerProducts();
  }, []);

  return (
    <div className="container mx-auto max-w-screen-2xl py-6">
      <div className="px-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {products.map((product, index) => (
          <ProductCard key={product._id || index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;