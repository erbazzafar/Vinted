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
  totalPrice: number;
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
  const token = Cookies.get("user-token")

  const handleWishList = async () => {
    if (!product._id) return;

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
            authorization: `Bearer ${Cookies.get("user-token")}`,
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
    <div className="group shadow-md relative w-full max-w-[250px] overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:border-yellow-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Link href={`/product/${product._id}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
            alt={product.name}
            height={240}
            width={320}
            unoptimized
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Wishlist */}
        <button
          aria-label="wishlist"
          className={`absolute right-2 top-2 z-10 rounded-full border border-gray-200 bg-white/90 p-2 shadow-sm transition-colors ${isWishlisted ? "text-red-600" : "text-gray-700 hover:text-red-500"}`}
          onClick={() => handleWishList()}
        >
          <Heart size={16} fill={isWishlisted ? "red" : "none"} />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-2 p-3">
        <Link
          href={`/product/${product._id}`}
          className="line-clamp-2 text-[13px] font-semibold capitalize text-gray-800 hover:text-teal-700"
        >
          {product.name}
        </Link>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:block rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
            {product?.sizeId?.name || "Size: Other"}
          </span>
          {product.categoryId?.[product.categoryId?.length - 1]?.name ? (
            <span className="rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-700">
              {product.categoryId[product.categoryId.length - 1].name}
            </span>
          ) : null}
        </div>

        {/* Price */}
        <div className="mt-1 flex items-center gap-1 text-[14px] font-semibold text-yellow-600">
          <Image src="/dirhamlogo.png" alt="dirham" width={16} height={16} unoptimized />
          <span>{Number(product.price).toFixed(2)}</span>
        </div>
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?website=true&reserved=show`
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
    <div className="lg:px-[50px] container mx-auto px-3 max-w-screen-2xl mb-6">
      {Array.isArray(products) && products.length > 0 ? (
        <>
          <h2 className="text-xl sm:text-3xl rounded-xl font-bold ">
            Our Recent Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center mt-6">
            {products.map((product, index) => (
              <ProductCard key={product._id || index} product={product} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductList;