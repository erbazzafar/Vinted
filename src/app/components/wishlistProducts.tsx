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
  const token = Cookies.get("token");

  useEffect( () => {
    const getNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/viewAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log(response.status);
        console.log("Notification Response",response);
        
      } catch (error) {
        toast.error("error")
      }
    }
    getNotifications()
  }, [token])

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
    <div className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[250px] z-[10]">
      {/* Product Image */}
      <div className="relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product?.image?.[0]}`}
          alt={product.name}
          height={300}
          width={300}
          unoptimized
          className="w-full h-[200px] object-contain rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="mt-3 px-3">
        <div className="flex justify-between">
          <Link
            href={`/product/${product._id}`}
            className="text-[13px] font-semibold text-gray-800 hover:underline"
          >
            {product.name}
          </Link>

          <button
            className={`text-[11px] transition-colors ${
              isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            onClick={handleWishList}
          >
            <Heart size={17} fill={isWishlisted ? "red" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {getStarRating(product.rating)}
        </div>

        <p className="text-[12px] text-gray-500">Size: {product.sizeId?.name ?? "N/A"}</p>
        <p className="text-[12px] text-gray-500">
          Category: {product.categoryId?.[product.categoryId.length - 1]?.name ?? "N/A"}
        </p>
        <p className="text-[12px] font-semibold text-teal-600">
          ${product.price}
        </p>
        <p className="text-[12px] font-semibold text-teal-600">
          ${product.inclPrice} <span className="text-xs text-gray-400">incl.</span>
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/getLike`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
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