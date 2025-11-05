"use client";
import { useEffect, useState } from "react";
import { MapPin, Rss, CheckCircle, Star } from "lucide-react";
import TabsComponent from "../../components/tabsSeller";
import Image from "next/image";
import Cookies from "js-cookie"
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Link from "next/link";


const SellerProfile = () => {

  const token = Cookies.get("user-token")

  const router = useRouter()

  const { id: sellerId } = useParams()

  const loggedInUserId = Cookies.get("userId")

  const isOwnProfile = sellerId === loggedInUserId

  const [seller, setSeller] = useState<any>(null)
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false)
  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false)
  const [followingList, setFollowingList] = useState([])
  const [followerList, setFollowerList] = useState([])
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${sellerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.status !== 200) {
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

  useEffect(() => {
    const alreadyFollower = async () => {
      try {
        if (!loggedInUserId || !token || !sellerId || loggedInUserId === sellerId) {
          return
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${sellerId}`
        )

        const data = response.data.data.follow
        const matchFollower = data.find(user => user._id === loggedInUserId)
        setIsFollowing(!!matchFollower)
      } catch (error) {
        console.log(error);
        return
      }
    }
    alreadyFollower()
  }, [loggedInUserId, token, sellerId])

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
      setIsFollowing((prev) => {
        const updatedState = !prev;
        toast.success(updatedState ? "Followed successfully" : "Unfollowed successfully");
        return updatedState;
      });

      getFollowerList()

    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast.error("Error occurred while updating follow status.");
    }
  };

  const getFollowerList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/viewUser/${sellerId}`
      )

      if (response.status !== 200) {
        toast.error("Error fetching the followers list")
        return
      }

      console.log("Follower List Response: ", response);
      setFollowerList(response.data.data.follow)
      setFollowingList(response.data.data.following)


    } catch (error) {
      console.log("Error fetching the Follower's list", error);
      toast.error("Error fetching the follower list")
      return
    }
  }

  useEffect(() => {
    getFollowerList()
  }, [sellerId])

  // Fetch review statistics
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/seller/${sellerId}`,
          {
            params: {
              page: 1,
              limit: 1 // We only need statistics, not all reviews
            }
          }
        )

        if (response.status === 200 && response.data.status === 'ok') {
          setReviewStats({
            averageRating: response.data.statistics.averageRating || 0,
            totalReviews: response.data.statistics.totalReviews || 0
          })
        }
      } catch (error) {
        console.log("Error fetching review statistics:", error)
        // Keep default values if error
      }
    }

    if (sellerId) {
      fetchReviewStats()
    }
  }, [sellerId])

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={24}
            className="text-yellow-400 fill-yellow-400"
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star size={24} className="text-yellow-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={24}
            className="text-yellow-400"
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {seller ? (
        <div className="mt-0 md:mt-16 max-w-screen-2xl mx-auto lg:px-[50px]">
          {/* Seller Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start bg-white py-13 mb-10">
            {/* Seller Image (Centered on mobile, aligned with "Brand" in Navbar on desktop) */}
            <div className="w-32 h-32 md:w-68 md:h-68 rounded-full overflow-hidden mb-4 md:mb-0">
              <Image
                src={
                  seller?.image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${seller.image}`
                    : Cookies.get("googlePhoto") || "/default-profile.png"
                }
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
                    className={`px-8 md:px-12 py-2 rounded-lg transition cursor-pointer ${isFollowing
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
                {getStarRating(reviewStats.averageRating)}
                <span className="text-gray-600 text-lg ml-2">
                  {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
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
                    <span
                      onClick={() => {
                        if (token) {
                          setIsFollowerModalOpen(true)
                          return
                        } else {
                          toast.error("Login first to view the Follower's list")
                          return
                        }
                      }}
                      className="text-blue-600 cursor-pointer">
                      {seller.follow.length} followers
                    </span>
                    , <span
                      onClick={() => {
                        if (token) {
                          setIsFollowingModalOpen(true)
                          return
                        } else {
                          toast.error("Login first to view the following list")
                          return
                        }
                      }}
                      className="cursor-pointer">
                      {Array.isArray(seller.following) ? seller.following.length : 0} following
                    </span>

                  </span>
                </div>
              </div>

              {/*Following Modal*/}
              <Modal open={isFollowingModalOpen} onClose={() => setIsFollowingModalOpen(false)}>
                <Box className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <h2 className="text-xl font-semibold mb-4">Following List</h2>
                  {followingList?.length === 0 ? (
                    <p className="text-gray-600">No following users found.</p>
                  ) : (
                    <ul className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
                      {followingList.map((user: any, index: number) => (
                        <li key={index} className="border p-2 rounded shadow-sm">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user?.image}` || "/default-avatar.png"}
                              alt="User"
                              width={10}
                              height={10}
                              className="w-10 h-10 rounded-full"
                            />
                            <Link
                              href={`/seller/${user._id}`}
                              className="text-[13px] font-semibold text-gray-800 hover:underline"
                            >
                              {user.fullName}
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Box>
              </Modal>

              {/*Follower Modal*/}
              <Modal open={isFollowerModalOpen} onClose={() => setIsFollowerModalOpen(false)}>
                <Box className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <h2 className="text-xl font-semibold mb-4">Followers List</h2>
                  {followerList?.length === 0 ? (
                    <p className="text-gray-600">No Follower found.</p>
                  ) : (
                    <ul className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
                      {followerList.map((user: any, index: number) => (
                        <li key={index} className="border p-2 rounded shadow-sm">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user?.image}` || "/default-avatar.png"}
                              alt="User"
                              width={10}
                              height={10}
                              className="w-10 h-10 rounded-full"
                            />
                            <Link
                              href={`/seller/${user._id}`}
                              className="text-[13px] font-semibold text-gray-800 hover:underline"
                            >
                              {user.fullName}
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Box>
              </Modal>


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
      )}
    </div>
  );
};

export default SellerProfile;
