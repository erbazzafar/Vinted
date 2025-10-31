"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
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




const ProductCard = ({ product, onRemove }: { product: any; onRemove: (id: string) => void }) => {
  const [isWishlisted, setIsWishlisted] = useState(true);
  const token = Cookies.get("user-token");

  const handleWishList = async () => {
    if (!product._id) return;

    if (!token) {
      toast.error("Please log in to modify wishlist");
      return;
    }

    setIsWishlisted(false); // Optimistically update UI

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/toggleLike`,
        { productId: product._id, userId: Cookies.get("userId") },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Removed from wishlist");
        onRemove(product._id); // Notify parent to remove from UI
      } else {
        setIsWishlisted(true); // Revert
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      setIsWishlisted(true); // Revert
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="group shadow-md relative w-full max-w-[250px] overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:border-yellow-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Link href={`/product/${product._id}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product?.image?.[0]}`}
            alt={product.name}
            height={240}
            width={320}
            unoptimized
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>
        {/* Labels */}
        {product.sold && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-red-600 text-white px-2 py-0.5 text-[10px] font-medium">
            Sold
          </span>
        )}
        {product.reserved && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-orange-500 text-white px-2 py-0.5 text-[10px] font-medium">
            Reserved
          </span>
        )}

        {/* Wishlist */}
        <button
          aria-label="wishlist"
          className={`absolute right-2 top-2 z-10 rounded-full border border-gray-200 bg-white/90 p-2 shadow-sm transition-colors ${isWishlisted ? "text-red-600" : "text-gray-700 hover:text-red-500"}`}
          onClick={handleWishList}
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
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
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
          <Image
            src={`/dirhamlogo.png`}
            alt="dirham"
            width={16}
            height={16}
            unoptimized
          />
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/getLike`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("user-token")}`,
            },
          }
        );

        if (response.status !== 200) {
          toast.error("Cannot find any liked products");
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

  const removeProductFromList = (id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="relative z-[20] container mx-auto max-w-screen-2xl py-6">
      <div className="px-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            onRemove={removeProductFromList}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList