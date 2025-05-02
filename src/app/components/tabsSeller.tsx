import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { Heart, TrendingUpIcon } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";

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
  const [reviews, setReviews] = useState([
    { id: 1, user: "John Doe", rating: 5, comment: "Amazing seller, highly recommended!" },
    { id: 2, user: "Jane Smith", rating: 4, comment: "Good experience, but shipping took time." },
    { id: 3, user: "Mike Johnson", rating: 3, comment: "Product quality is average." },
    { id: 4, user: "Mike Tyson", rating: 4, comment: "Good Service, Early delivery." },
  ]);

  const [wishlistState, setWishlistState] = useState<{ [key: string]: boolean }>({});
  const token = Cookies.get("token")

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
            authorization: `Bearer ${Cookies.get("token")}`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?userId=${sellerId}&admin=${userId === sellerId ? true : false}`
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
    // { name: "Reviews", key: "Reviews" },
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
      <div className="mt-2">
        {showTab === "Products" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {product.map((product: any) => (
              <div
                key={product._id}
                className=" shadow-md rounded-xl overflow-hidden p-3 relative w-full max-w-[250px] mx-auto"
              >
                <div className="relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`} // Assuming the first image in the array
                    alt={product.name}
                    height={300}
                    width={300}
                    className="w-full h-[200px] object-contain rounded-lg"
                  />
                </div>

                <div >
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/product/${product._id}`}
                      className="text-[13px] font-semibold text-gray-800 hover:underline"
                    >
                      {product.name}
                    </Link>

                    <button
                      className={`mr-3 transition-colors ${wishlistState[product._id] ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                      onClick={() => handleWishList(product)}
                    >
                      <Heart size={18} fill={wishlistState[product._id] ? "red" : "none"} />
                    </button>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mt-1">{getStarRating(product.rating)}</div>

                  {/* Size */}
                  <p className="text-[12px] text-gray-500">Size: {product.sizeId?.name ?? "N/A"}</p>

                  {/* Category */}
                  <p className="text-[12px] text-gray-500">Category: {product.categoryId?.[product?.categoryId?.length - 1]?.name ?? "N/A"}</p>

                  {/* Prices */}
                  <p className="mt-1 text-[12px] font-semibold text-teal-600 flex items-center gap-1">
                    <Image
                      src={`/dirhamlogo.png`}
                      alt="dirham"
                      width={15}
                      height={15}
                      unoptimized
                    />
                    {product.totalPrice}
                    <span className="text-[10px] text-teal-600">incl.</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="mb-4 border-b pb-3">
                  <p className="font-medium">{review.user}</p>
                  <p className="text-yellow-500">
                    {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;
