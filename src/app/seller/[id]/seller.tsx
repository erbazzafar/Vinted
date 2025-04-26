"use client";
import { useEffect, useState } from "react";
import { MapPin, Clock, Rss, CheckCircle } from "lucide-react";
import TabsComponent from "../../components/tabsSeller";
import Image from "next/image";
import Cookies from "js-cookie"
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const SellerProfile = () => {

  const token = Cookies.get("token")

  const router = useRouter()

  const params = useParams()
  console.log("Params: ", params);
  
  const {id: sellerId} = useParams()
  console.log("seller id: ", sellerId);
  
  const loggedInUserId = Cookies.get("userId")
  console.log("Logged In User ID: ", loggedInUserId);
  

  const isOwnProfile = sellerId === loggedInUserId

  const photoURl = Cookies.get("photourl")
   const [seller, setSeller] = useState<any>(null)
  
  useEffect(()=> {
    const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${sellerId}`,
        {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status !== 200){
        toast.error("User Data Not found")
        return
      }
      setSeller(response.data.data)
      
    } catch (error) {
      console.log("Error Fetching the Profile");
      
    }
  }
  fetchData()
  }, [sellerId])

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const handleFollow = async () => {
    try {
      if (!token || !loggedInUserId) {
        toast.error("Please log in to follow users.");
        return;
      }
  
      const payload = {
        id: sellerId,
        userId: loggedInUserId
      };
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/toggleFollow`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status !== 200) {
        toast.error("Something went wrong while following/unfollowing.");
        return;
      }
  
      // Toggle follow state
      setIsFollowing((prev) => !prev);
  
      // Update followers count manually
      setFollowersCount((prevCount) => isFollowing ? prevCount - 1 : prevCount + 1);
  
      toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");
  
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast.error("Error occurred while updating follow status.");
    }
  };

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    console.log("Seller Data", seller);
    

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
      {seller ? (
      <div className="mt-0 md:mt-16 max-w-screen-2xl mx-auto px-4 lg:px-[50px]">
        {/* Seller Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white py-13 mb-10">
          {/* Seller Image (Centered on mobile, aligned with "Brand" in Navbar on desktop) */}
          <div className="w-32 h-32 md:w-68 md:h-68 rounded-full overflow-hidden mb-4 md:mb-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${seller.image}`}
              alt={seller?.username}
              className="w-full h-full object-cover"
              width={68}
              height={68}
              unoptimized
            />
          </div>

          {/* Seller Info & Follow Button Container */}
          <div className="md:ml-8 flex-1 w-full text-center md:text-left">
            {/* Seller Name and Follow Button Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-bold">{seller.username}</h1>

              {/* Follow/Edit Button */}
              {!isOwnProfile ? (
                <button
                  className={`px-8 md:px-12 py-2 rounded-lg transition cursor-pointer ${
                    isFollowing
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-800 hover:bg-gray-600"
                  } text-white w-full md:w-auto`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              ) : (
                <button
                  className="px-8 md:px-12 py-2 rounded-lg transition cursor-pointer bg-gray-600 hover:bg-gray-500 text-white w-full md:w-auto flex items-center justify-center gap-2"
                  onClick={() => router.push('/user-setting')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {/* Seller Rating and Reviews */}
            <div className="flex items-center justify-center md:justify-start mt-2">
              {getStarRating(seller.rating)}
              <span className="text-gray-600 text-lg ml-2">
                {seller.reviews} reviews
              </span>
            </div>

            {/* Frequent Uploads */}
            {seller.frequentUploads && (
              <div className="flex items-center text-gray-700 text-lg mt-4 justify-center md:justify-start">
                <CheckCircle size={20} className="text-teal-500 mr-2" />
                <span className="font-medium">Frequent Uploads</span>
                <span className="ml-2 hidden md:inline">Regularly lists 5 or more items.</span>
              </div>
            )}

            {/* About Section */}
            <div className="text-gray-700 text-lg mt-2 flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3">
                <MapPin size={20} />
                <span>{seller.country}</span>
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <Rss size={20} />
                <span>
                  <span className="text-blue-600 cursor-pointer">
                    {followersCount} followers
                  </span>
                  , {Array.isArray(seller.following) ? seller.following.length : 0} following
                </span>
              </div>
            </div>

            {/* Verified Info */}
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-gray-700 text-lg">
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
            <div className="mt-5 text-center md:text-left">
              {seller.about && typeof seller.about === "string" && (
                <p>{seller.about}</p>
              )}
            </div>
          </div>
        </div>

        {/* Updated Tabs Section */}
        <div className="w-full ">
          <TabsComponent sellerId={sellerId} />
        </div>
      </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      ) }
    </div>
  );
};

export default SellerProfile;
