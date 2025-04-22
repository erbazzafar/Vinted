import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

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
  const [product, setProduct] = useState<any[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showTab, setShowTab] = useState("Products");
  const [reviews, setReviews] = useState([
    { id: 1, user: "John Doe", rating: 5, comment: "Amazing seller, highly recommended!" },
    { id: 2, user: "Jane Smith", rating: 4, comment: "Good experience, but shipping took time." },
    { id: 3, user: "Mike Johnson", rating: 3, comment: "Product quality is average." },
    { id: 4, user: "Mike Tyson", rating: 4, comment: "Good Service, Early delivery." },
  ]);

  useEffect(() => {
    const getSellerProducts = async () => {
      try {
        if (!sellerId) {
          console.log("Seller Id not found");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?userId=${sellerId}`
        );

        if (response.status !== 200) {
          toast.error("Cannot find any Products");
          return;
        }

        console.log("Product Fetched ", response.data.data);
        setProduct(response.data.data);
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
            className={`px-6 py-2 text-xl font-medium cursor-pointer ${
              showTab === tab.key
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
      <div className="mt-6">
        {showTab === "Products" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {product.map((product: any) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-xl overflow-hidden p-3 relative w-full max-w-[300px] mx-auto"
              >
                <div className="relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`} // Assuming the first image in the array
                    alt={product.name}
                    height={300}
                    width={300}
                    className="w-full h-[300px] object-cover rounded-lg"
                  />
                </div>

                <div className="mt-3">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/product/${product._id}`}
                      className="text-lg font-semibold text-gray-800 hover:underline"
                    >
                      {product.name}
                    </Link>

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
                  <p className="text-md text-gray-500">Size: {product.size?.name ?? "N/A"}</p>

                  {/* Category */}
                  <p className="text-md text-gray-500">Category: {product.category?.name ?? "N/A"}</p>

                  {/* Prices */}
                  <p className="text-lg font-semibold text-teal-600">
                    {product.discountedPrice ?? product.price}{" "}
                    <span className="text-xs text-gray-400">incl.</span>
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
