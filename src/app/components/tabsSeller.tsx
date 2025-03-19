import { useState } from "react";
import ProductList from "./lensDemo";

const TabsComponent = () => {
  const [showTab, setShowTab] = useState("Products");

  const tabs = [
    { name: "Products", key: "Products" },
    { name: "Reviews", key: "Reviews" },
  ];

  const [reviews, setReviews] = useState([
    { id: 1, user: "John Doe", rating: 5, comment: "Amazing seller, highly recommended!" },
    { id: 2, user: "Jane Smith", rating: 4, comment: "Good experience, but shipping took time." },
    { id: 3, user: "Mike Johnson", rating: 3, comment: "Product quality is average." },
    { id: 4, user: "Mike Tyson", rating: 4, comment: "Good Service, Early delivery." },
  ]);  

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
          <ProductList />
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
