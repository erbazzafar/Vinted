import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { Heart, TrendingUpIcon } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import ReviewsList from "./ReviewsList";

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

const TabsComponent = ({ sellerId }: any) => {
  const [product, setProduct] = useState([]);
  const [showTab, setShowTab] = useState("Products");
  const userId = Cookies.get("userId")

  const [wishlistState, setWishlistState] = useState<{ [key: string]: boolean }>({});
  const token = Cookies.get("user-token")

  const handleWishList = async (product: any) => {
    if (!product._id) return;

    if (!token) {
      toast.error("Please log in to add to wishlist");
      return;
    }

    setWishlistState(prev => ({
      ...prev,
      [product._id]: !prev[product._id],
    }));

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
        return;
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error adding to wishlist");
      console.error("Error adding to wishlist", error);
    }
  };

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId && Array.isArray(product)) {
      const newWishlistState: { [key: string]: boolean } = {};
      product.forEach((prod: any) => {
        if (prod.like?.includes(userId)) {
          newWishlistState[prod._id] = true;
        } else {
          newWishlistState[prod._id] = false;
        }
      });
      setWishlistState(newWishlistState);
    }
  }, [product]);

  useEffect(() => {
    const getSellerProducts = async () => {
      try {
        if (!sellerId) {
          console.log("Seller Id not found");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?reserved=show&userId=${sellerId}&admin=${userId === sellerId ? true : false}`
        );

        if (response.status !== 200) {
          toast.error("Cannot find any Products");
          return;
        }

        console.log("Product Fetched ", response.data.data);
        setProduct(response.data.data)

      } catch (error) {
        toast.error("Error Fetching the Products");
        console.log("Error Fetching the Products");
      }
    };

    getSellerProducts();
  }, [sellerId]);

  const tabs = [
    { name: "Products", key: "Products" },
    { name: "Reviews", key: "Reviews" },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-2 text-xl font-medium cursor-pointer ${showTab === tab.key
              ? "border-b-2 border-gray-600 text-gray-800"
              : "text-gray-600 hover:text-gray-600"
              } transition`}
            onClick={() => setShowTab(tab.key)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Display Content Based on Selected Tab */}
      <div className="mt-2 mb-10">
        {showTab === "Products" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            {product.map((product: any) => (
              <div
                key={product._id}
                className="group shadow-md relative w-full max-w-[250px] overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:border-yellow-300"
              >
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
                    className={`absolute right-2 top-2 z-10 rounded-full border border-gray-200 bg-white/90 p-2 shadow-sm transition-colors ${wishlistState[product._id] ? "text-red-600" : "text-gray-700 hover:text-red-500"}`}
                    onClick={() => handleWishList(product)}
                  >
                    <Heart size={16} fill={wishlistState[product._id] ? "red" : "none"} />
                  </button>
                </div>

                {/* Body */}
                <div className="space-y-2 p-3">
                  <Link
                    href={`/product/${product._id}`}
                    className="line-clamp-2 text-[14px] font-semibold capitalize text-gray-900 hover:text-black"
                  >
                    {product.name}
                  </Link>

                  {/* Size & Category chips (match lensDemo.tsx) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
                      {product.sizeId?.name ?? "Size: Other"}
                    </span>
                    {product.categoryId?.[product?.categoryId?.length - 1]?.name ? (
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
            ))}
          </div>
        )}

        {showTab === "Reviews" && <ReviewsList sellerId={sellerId} />}
      </div>
    </div>
  );
};

export default TabsComponent;
