"use client";
import { useState } from "react";
import { MapPin, Clock, Rss, CheckCircle } from "lucide-react";
import TabsComponent from "./tabsSeller";
import Image from "next/image";


const SellerProfile = () => {
  const [seller, setSeller] = useState({
    username: "Erbaz",
    reviews: 4,
    rating: 4.34,
    location: "Los Angeles, CA, United States",
    lastSeen: "9 hours ago",
    followers: 24,
    following: 0,
    frequentUploads: true,
    verifiedGoogle: true,
    verifiedEmail: true,
    profileImage: "/pexels-kowalievska-1127000.jpg",
    description:
      "Welcome to my store! I'm Erbaz, a passionate and dedicated seller committed to providing high-quality products and a seamless shopping experience.",
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(seller.followers);

  const handleFollow = () => {
    setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
    setIsFollowing(!isFollowing);
  };

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-2xl">
        {"★".repeat(fullStars)}
        {halfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div>
      <div className="mt-16 max-w-screen-2xl mx-auto">
        {/* Seller Profile Section */}
        <div className="flex items-start bg-white py-13 mb-10">
          {/* Seller Image (Aligned with "Brand" in Navbar) */}
          <div className="w-68 h-68 rounded-full overflow-hidden">
            <img
              src={seller.profileImage}
              alt={seller.username}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Seller Info & Follow Button Container */}
          <div className="ml-8 flex-1">
            {/* Seller Name and Follow Button Row */}
            <div className="flex justify-between items-center">
              <h1 className="text-5xl font-bold">{seller.username}</h1>

              {/* Follow Button (Aligned with "Sell Now") */}
              <button
                className={`px-12 py-2 rounded-lg transition cursor-pointer ${
                  isFollowing
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-800 hover:bg-gray-600"
                } text-white`}
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>

            {/* Seller Rating and Reviews */}
            <div className="flex items-center mt-2">
              {getStarRating(seller.rating)}
              <span className="text-gray-600 text-lg ml-2">
                {seller.reviews} reviews
              </span>
            </div>

            {/* Frequent Uploads */}
            {seller.frequentUploads && (
              <div className="flex items-center text-gray-700 text-lg mt-4">
                <CheckCircle size={20} className="text-teal-500 mr-2" />
                <span className="font-medium">Frequent Uploads</span>
                <span className="ml-2">Regularly lists 5 or more items.</span>
              </div>
            )}

            {/* About Section */}
            <div className="text-gray-700 text-lg mt-2">
              <div className="flex items-center space-x-3">
                <MapPin size={20} />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <Clock size={20} />
                <span>Last seen {seller.lastSeen}</span>
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <Rss size={20} />
                <span>
                  <span className="text-blue-600 cursor-pointer">
                    {followersCount} followers
                  </span>
                  , {seller.following} following
                </span>
              </div>
            </div>

            {/* Verified Info */}
            <div className="flex items-center space-x-4 mt-2 text-gray-700 text-lg">
              {seller.verifiedGoogle && (
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-teal-500 mr-2" />
                  Google
                </div>
              )}
              {seller.verifiedEmail && (
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-teal-500 mr-2" />
                  Email
                </div>
              )}
            </div>

            {/* Seller Description */}
            <div className="mt-5">
              <p className="text-lg text-gray-800 leading-relaxed">
                {seller.description}
              </p>
            </div>
          </div>
        </div>

        {/* Updated Tabs Section */}
        <div className="w-full">
          <TabsComponent />
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
