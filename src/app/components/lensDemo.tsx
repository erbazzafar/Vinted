"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  image: string[];
  price: number;
  inclPrice: number;
  rating: number;
  sizeId?: { name: string };
  categoryId?: { name: string }[];
  like?: string[];
}

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
const ProductCard = ({ product }: { product: Product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const token = Cookies.get("token")

  const handleWishList = async () => {
    if (!product._id ) return;

    if (!token) {
      toast.error("Please log in to add to wishlist");
      return;
    }

    // Optimistic UI update: set the new like state before API call
    setIsWishlisted(!isWishlisted);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/toggleLike`,
        { productId: product._id, userId: Cookies.get("userId") },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        toast.error("Error adding to wishlist");
        setIsWishlisted(isWishlisted); // revert the UI change if error occurs
        return;
      }

      // If successful, show success message and update the state accordingly
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error adding to wishlist");
      setIsWishlisted(isWishlisted); // revert the UI change if error occurs
      console.error("Error adding to wishlist", error);
    }
  };

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId && Array.isArray(product.like)) {
      const filteredLikes = product.like.filter((id: string | null) => id);
      if (filteredLikes.includes(userId)) {
        setIsWishlisted(true);
      } else {
        setIsWishlisted(false);
      }
    }
  }, [product]);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[300px]">
      <div className="relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
          alt={product.name}
          height={300}
          width={10}
          unoptimized
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
            onClick={() => handleWishList()}
          >
            <Heart size={22} fill={isWishlisted ? "red" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {getStarRating(product.rating)}
        </div>


        <p className="text-md text-gray-500">Size: {product?.sizeId?.name || "None"}</p>
        <p className="text-md text-gray-500">Category: {product.categoryId?.[product.categoryId?.length-1]?.name || "N/A"}</p>
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