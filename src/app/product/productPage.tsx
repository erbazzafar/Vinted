"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import SellerButton from "../components/routeSellerButton";
import ProductCarousel from "../components/productCorousel";
import AuthenticityModal from "../components/authenticityModal";

const ProductPage = () => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [gettingProduct, setGettingProduct] = useState<any>("")
  const router = useRouter();

  const [hidden, setHidden] = useState(false)
  const [sold, setSold] = useState(false)
  const [reserve, setReserved] = useState(false)

  const token = Cookies.get("user-token")
  const loggedInUser = Cookies.get("userId")
  const [bump, setBump] = useState(false);
  const [bumpDayCheck, setBumpDayCheck] = useState(0)


  const { id: productId } = useParams()
  console.log("product id: ", productId)

  const fetchProductDetails = useCallback(async () => {
    try {
      if (!productId) {
        toast.error("Product id not Found")
        return
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status !== 200) {
        toast.error("Error fetching the Product, please try later")
        return
      }
      console.log("Fetching product response: ", response);
      setGettingProduct(response.data.data)
      setBump(response.data.data.bump)
      setBumpDayCheck(response.data.data.bumpDay)
      setHidden(response.data.data.hidden)
      setSold(response.data.data.sold)
      setReserved(response.data.data.reserved)


    } catch (error) {
      console.log("Error fetching that Product");
      return
    }
  }, [productId, token])

  useEffect(() => {
    fetchProductDetails()
  }, [fetchProductDetails])

  const [mainImage, setMainImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gettingProduct?.image?.[0]) {
      setMainImage(gettingProduct.image[0]);
    }
  }, [gettingProduct]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/imageLogo2.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, it's from our system, add backend URL
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;
  };

  const getProductImageUrl = (imagePath: string) => {
    if (!imagePath) return '/vercel.svg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, it's from our system, add backend URL
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.error("Please login to buy the product")
      return
    }
    localStorage.setItem("productsInfo", JSON.stringify(gettingProduct));
    router.push(`/checkout?productId=${productId}&userId=${loggedInUser}&adminUser=${gettingProduct?.userId?._id}`);
  };

  const handleChat = () => {
    if (!token) {
      toast.error("Please login to chat with the seller")
      return
    }
    // return console.log("gettingProduct ", gettingProduct);
    localStorage.setItem("product", JSON.stringify(gettingProduct));
    localStorage.setItem("fromProductPage", "true")
    router.push(`/inbox/${gettingProduct?._id}?id=${gettingProduct?._id}`);
  };

  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);
  const [bumpDays, setBumpDays] = useState<Array<{ _id: string; day: string; percentage: string }>>([]);
  const [selectedBumpDays, setSelectedBumpDays] = useState<{ _id: string; day: string; percentage: string } | null>(null);

  // Reserved modal states
  const [isReservedModalOpen, setIsReservedModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Authenticity modal state
  const [isAuthenticityModalOpen, setIsAuthenticityModalOpen] = useState(false);

  useEffect(() => {
    const getBump = async () => {
      try {
        if (!productId) {
          toast.error("Product not Found");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bump/viewAll`);

        if (response.status !== 200) {
          toast.error("Error fetching the bump prices");
          return;
        }

        setBumpDays(response.data.data);
      } catch (error) {
        console.log("Error fetching the Bump Prices", error);
        toast.error("Error fetching the Bump Prices");
      }
    };

    getBump();
  }, [productId, token, loggedInUser]);

  const handleBump = async (selectedDays: string) => {
    localStorage.setItem("bumpDays", selectedDays)
    localStorage.setItem("percentage", selectedBumpDays.percentage)
    router.push(`/bump?id=${productId}`)
  };

  // Fetch all users for reserved modal
  const fetchAllUsers = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAllUsers(response.data.data);
      } else {
        toast.error("Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    }
  };


  const handleHide = async () => {
    try {
      if (!loggedInUser || !token || !productId) {
        toast.error("Missing user credentials or product ID");
        return;
      }

      // Use the *intended* new value before calling API
      const newHiddenValue = !hidden;

      const formData = new FormData();
      formData.append("hidden", newHiddenValue.toString());

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200 || !response.data?.data) {
        toast.error("Failed to update visibility");
        return;
      }

      const updatedHidden = response.data.data.hidden;
      setHidden(updatedHidden);

      toast.success(updatedHidden ? "Item hidden" : "Item is now visible");
    } catch (error) {
      console.error("Error updating product visibility:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }


  const [isSoldModalOpen, setIsSoldModalOpen] = useState(false)
  const [selectedUserForSold, setSelectedUserForSold] = useState(null)

  const handleSold = async () => {
    try {
      if (!loggedInUser || !token || !productId) {
        toast.error("Missing user credentials or product ID");
        return;
      }

      const userList = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (userList.status !== 200) {
        toast.error("Error fetching the Users")
        return
      }

      setAllUsers(userList.data.data)


      // Use the *intended* new value before calling API
      const newSoldValue = !sold;

      // const formData = new FormData();
      // formData.append("sold", newSoldValue.toString());

      // const response = await axios.put(
      //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${productId}`,
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // );

      // if (response.status !== 200 || !response.data?.data) {
      //   toast.error("Failed to update visibility");
      //   return;
      // }

      // const updatedSold = response.data.data.sold;
      // setSold(updatedSold);

      // toast.success(updatedSold ? "Item marked as sold" : "sold unmarked");
    } catch (error) {
      console.error("Error updating product visibility:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleReserved = async () => {
    try {
      if (!loggedInUser || !token || !productId) {
        toast.error("Missing user credentials or product ID");
        return;
      }

      if (!selectedUser) {
        toast.error("Please select a user");
        return;
      }

      const formData = new FormData();
      formData.append("reserved", "true");
      formData.append("reservedUserId", selectedUser._id);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200 || !response.data?.data) {
        toast.error("Failed to mark as reserved");
        return;
      }

      const updatedReserved = response.data.data.reserved;
      setReserved(updatedReserved);
      setIsReservedModalOpen(false);
      setSelectedUser(null);

      toast.success("Item marked as reserved successfully");

      // Refresh product data
      const refreshResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (refreshResponse.status === 200) {
        setGettingProduct(refreshResponse.data.data);
        setReserved(refreshResponse.data.data.reserved);
      }
    } catch (error) {
      console.error("Error marking product as reserved:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleOpenReservedModal = async () => {
    setIsReservedModalOpen(true);
    await fetchAllUsers();
  };

  const handleUnreserve = async () => {
    try {
      if (!loggedInUser || !token || !productId) {
        toast.error("Missing user credentials or product ID");
        return;
      }

      const formData = new FormData();
      formData.append("reserved", "false");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200 || !response.data?.data) {
        toast.error("Failed to unreserve product");
        return;
      }

      const updatedReserved = response.data.data.reserved;
      setReserved(updatedReserved);

      toast.success("Item unreserved successfully");

      // Refresh product data
      const refreshResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (refreshResponse.status === 200) {
        setGettingProduct(refreshResponse.data.data);
        setReserved(refreshResponse.data.data.reserved);
      }
    } catch (error) {
      console.error("Error unreserving product:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleProductEdit = () => {
    router.push(`/sell?id=${productId}`)
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleProductDelete = async () => {
    try {
      if (!productId) {
        toast.error("Cannot find Product")
        return
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/delete/${productId}`
      )

      if (response.status !== 200) {
        toast.error("Error deleting the Product")
        return
      }

      console.log("Product Delete Response: ", response);
      setIsDeleteModalOpen(false)
      router.push('/')
      toast.success("Product Deleted Successfully")

    } catch (error) {
      console.log("Error deleting the Product", error);
      toast.error("Error deleting the Product")
      return
    }
  }


  return (
    <div className="mt-10">
      <div className="container mx-auto sm:px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
          {/* Left: Product Images */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail Images */}
            <div className="flex flex-row md:flex-col gap-4 px-6 md:px-0 order-2 md:order-1">
              {gettingProduct?.image?.slice(0, 4)?.map((image: any, index: any) => (
                <div key={index} className="relative">
                  <Image
                    src={getProductImageUrl(image)}
                    alt={`Thumbnail ${index}` || "Image"}
                    width={80}
                    height={80}
                    unoptimized
                    className={`object-contain rounded-lg cursor-pointer border ${mainImage === image ? "border-teal-500" : "border-gray-300"
                      }`}
                    onClick={() => setMainImage(image)}
                  />
                  {index === 3 && gettingProduct?.image?.length > 4 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer"
                      onClick={() => setShowCarousel(true)}
                    >
                      <Plus size={24} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="w-full px-6 md:px-0 order-1 md:order-2">
              <div
                ref={imageRef}
                className="relative w-full h-[530px] overflow-hidden rounded-lg shadow-lg cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={getProductImageUrl(mainImage)}
                  alt="Product"
                  width={500}
                  height={600}
                  unoptimized
                  className="w-full h-full object-cover"
                  style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transition: isZoomed ? 'none' : 'transform 0.3s ease-out'
                  }}
                />

                {/* Zoom Indicator */}
                {isZoomed && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Zoomed In
                  </div>
                )}

                {/* Reserved Label - Only show to non-owners when product is reserved */}
                {reserve && gettingProduct?.userId?._id !== loggedInUser && (
                  <div className="absolute bottom-0 left-0 right-0 w-full bg-gray-900 text-white text-center py-3 font-bold text-lg">
                    RESERVED
                  </div>
                )}

                {/* Sold Label - Only show to non-owners when product is sold */}
                {sold && gettingProduct?.userId?._id !== loggedInUser && (
                  <div className="absolute bottom-0 left-0 right-0 w-full bg-red-900 text-white text-center py-3 font-bold text-lg">
                    SOLD
                  </div>
                )}
              </div>
            </div>

            {/* Carousel Modal */}
            <Modal open={showCarousel} onClose={() => setShowCarousel(false)}>
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 rounded-lg shadow-lg w-[95%] md:w-[65%] max-w-xl h-[600px] overflow-hidden">
                <Carousel
                  responsive={{
                    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
                  }}
                  infinite
                  autoPlay={false}
                  keyBoardControl
                  showDots
                  arrows
                >
                  {gettingProduct?.image?.map((image: any, index: any) => (
                    <div
                      key={index}
                      className="w-full h-[600px] flex justify-center items-center"
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={`Product ${index}`}
                        width={950}
                        height={600}
                        unoptimized
                        className="w-full h-[600px] object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </Box>
            </Modal>
          </div>

          {/* Right: Product Details */}
          <div className="bg-white space-y-1 px-6 md:px-0">
            {/* Product Title, Rating, Desc */}
            <div className="border-b border-gray-200 pb-3">
              <h1 className="text-[18px] md:text-[30px] font-bold text-gray-800">
                {gettingProduct?.name || "No name"}
              </h1>
              <p className="text-[13px] sm:text-[15px] text-gray-600 my-[8px]">
                {gettingProduct?.description}
              </p>
            </div>

            {/* Attributes */}
            <div className="border-b border-gray-200 pb-[15px] pt-[10px] space-y-1">
              {gettingProduct?.brandId?.name && (
                <p className="text-[16px] text-gray-600">
                  <span className="font-[700]">Brand:</span>{" "}
                  {gettingProduct?.brandId?.name}
                </p>
              )}
              {gettingProduct?.sizeId?.name && (
                <p className="text-[16px] text-gray-600">
                  <span className="font-[700]">Size:</span>{" "}
                  {gettingProduct?.sizeId?.name}
                </p>
              )}
              {gettingProduct?.colorId?.[0]?.name && (
                <p className="text-[16px] text-gray-600">
                  <span className="font-[700]">Color:</span>{" "}
                  {gettingProduct?.colorId?.[0]?.name}
                </p>
              )}
              <p className="text-[16px] text-gray-600">
                <span className="font-[700]">Category:</span>{" "}
                {gettingProduct?.categoryId?.[
                  gettingProduct?.categoryId?.length - 1
                ]?.name || "Other"}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2 pt-[20px] pb-[10px]">
              {/* {[
                { label: "Product Price", value: gettingProduct?.price },
                { label: "Shipping Cost", value: gettingProduct?.shipPrice },
                { label: "Protection Fee", value: gettingProduct?.inclPrice },
              ].map(({ label, value }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <label className="text-[14px] font-medium text-gray-600">
                    {label}:
                  </label>
                  <div className="flex items-center gap-1 text-[14px] font-semibold text-teal-600">
                    <Image
                      src="/dirhamlogo.png"
                      alt="dirham"
                      width={15}
                      height={15}
                      unoptimized
                    />
                    <span>{value}</span>
                  </div>
                </div>
              ))} */}

              {/* Total */}
              <div className="flex items-center gap-2">
                <label className="text-[20px] font-bold text-gray-700">
                  Product Price:
                </label>
                <div className="flex items-center gap-1 text-[22px] font-bold text-green-700">
                  <Image
                    src="/dirhamlogo.png"
                    alt="dirham"
                    width={22}
                    height={22}
                    unoptimized
                  />
                  <span>{Number(gettingProduct?.price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Seller / Owner Buttons */}
            {gettingProduct?.userId?._id === loggedInUser ? (
              <>
                {/* Bump Button */}
                <button
                  className={`text-lg mt-4 flex items-center justify-center gap-2 w-full px-7 py-2 rounded-lg transition ${bump && bumpDayCheck > 0
                    ? "bg-gray-300 text-green-600 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-300 hover:text-gray-950"
                    }`}
                  disabled={bump && bumpDayCheck > 0}
                  onClick={() => {
                    if (bump && bumpDayCheck > 0) return;
                    if (token) setIsBumpModalOpen(true);
                    else toast.error("Login first to Bump product");
                  }}
                >
                  {bump && bumpDayCheck > 0 ? "Bumped ✅" : "Bump"}
                </button>

                {/* Hide Button */}
                <button
                  className={`text-lg mt-2 flex items-center justify-center gap-2 w-full px-7 py-2 rounded-lg transition ${hidden
                    ? "bg-gray-400 text-gray-950"
                    : "bg-gray-800 text-white hover:bg-gray-300 hover:text-gray-950"
                    }`}
                  onClick={() => (token ? handleHide() : toast.error("Login First"))}
                >
                  {hidden ? "Unhide Product" : "Hide"}
                </button>

                {/* Reserved Button */}
                <button
                  className={`text-lg mt-2 flex items-center justify-center gap-2 w-full px-7 py-2 rounded-lg transition ${reserve
                    ? "bg-orange-500 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-300 hover:text-gray-950"
                    }`}
                  onClick={() => {
                    if (!token) {
                      toast.error("Login First");
                      return;
                    }
                    if (reserve) {
                      // If already reserved, unreserve it directly
                      handleUnreserve();
                    } else {
                      // Open modal to select user
                      handleOpenReservedModal();
                    }
                  }}
                >
                  {reserve ? "Unreserve Product" : "Mark as Reserved"}
                </button>

                {/* Delete Button */}
                <button
                  className="text-lg mt-2 flex items-center justify-center gap-2 w-full px-7 py-2 rounded-lg transition cursor-pointer bg-red-800 text-white hover:bg-red-500"
                  onClick={() =>
                    token
                      ? setIsDeleteModalOpen(true)
                      : toast.error("Login first to Delete")
                  }
                >
                  Delete
                </button>

                {/* Delete Modal */}
                <Modal
                  open={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                >
                  <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h3 className="text-lg text-center font-semibold mb-4">
                      Are you sure you want to delete Your Product?
                    </h3>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full cursor-pointer"
                      onClick={handleProductDelete}
                    >
                      Delete Product
                    </button>
                  </Box>
                </Modal>

                {/* Seller Info */}
                <SellerButton
                  seller={{
                    username: gettingProduct?.userId?.username,
                    profileImage: getImageUrl(gettingProduct?.userId?.image),
                    rating: gettingProduct?.userId?.rating,
                    reviews: gettingProduct?.userId?.reviews,
                  }}
                  sellerId={gettingProduct?.userId?._id}
                />

                {/* Bump Modal */}
                <Modal open={isBumpModalOpen} onClose={() => setIsBumpModalOpen(false)}>
                  <Box className="bg-white rounded-lg shadow-lg w-full max-w-[560px] max-h-[75vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                      <div>
                        <h2 className="text-[16px] font-semibold text-gray-900">Boost your product visibility</h2>
                        <p className="text-[12px] text-gray-600 mt-1">Choose a bump duration. The fee is a small percentage of your price.</p>
                      </div>
                      <button
                        aria-label="Close"
                        className="cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => setIsBumpModalOpen(false)}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-5 space-y-5">
                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.isArray(bumpDays) && bumpDays?.map((option) => {
                          const isSelected = selectedBumpDays?.day === option.day;
                          const basePrice = Number(gettingProduct?.price || 0);
                          const fee = ((Number(option.percentage) / 100) * basePrice);
                          const total = basePrice + fee;
                          return (
                            <button
                              key={option._id}
                              className={`cursor-pointer text-left rounded-lg border transition-colors duration-200 px-4 py-3 focus:outline-none ${isSelected ? "border-gray-900 bg-gray-100" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                              onClick={() => setSelectedBumpDays(option)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-[14px] font-semibold text-gray-900">{option.day} days</p>
                                  <p className="text-[12px] text-gray-600 mt-1">Fee {Number(option.percentage).toFixed(0)}%</p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 justify-end text-[14px] font-semibold text-gray-900">
                                    <Image src="/dirhamlogo.png" alt="dirham" height={16} width={16} />
                                    <span>{fee.toFixed(2)}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-500">Bump fee</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Summary: show only selected bump price */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Bump price</h3>
                        <div className="flex items-center justify-between text-[13px] text-gray-700">
                          <span>{selectedBumpDays ? `${selectedBumpDays.day}-day bump (${Number(selectedBumpDays.percentage).toFixed(0)}%)` : "Select a bump duration"}</span>
                          <div className="flex items-center gap-1 text-gray-900 font-medium">
                            <Image src="/dirhamlogo.png" alt="dirham" height={16} width={16} />
                            <span>{selectedBumpDays ? ((Number(selectedBumpDays.percentage) / 100) * Number(gettingProduct?.price || 0)).toFixed(2) : "—"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3">
                        <button
                          className="cursor-pointer bg-gray-200 text-[13px] text-gray-900 px-4 py-2 rounded hover:bg-gray-300"
                          onClick={() => setIsBumpModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={bump || !selectedBumpDays}
                          className={`cursor-pointer text-[13px] px-4 py-2 rounded ${bump || !selectedBumpDays ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                          onClick={async () => {
                            if (bump) {
                              toast.error("This product is already bumped");
                              return;
                            }
                            if (!selectedBumpDays) return;
                            await handleBump(selectedBumpDays.day);
                            setIsBumpModalOpen(false);
                          }}
                        >
                          {bump ? "Already Bumped" : selectedBumpDays ? `Confirm ${selectedBumpDays.day}-day Bump` : "Select a duration"}
                        </button>
                      </div>
                    </div>
                  </Box>
                </Modal>

                {/* Reserved Modal */}
                <Modal open={isReservedModalOpen} onClose={() => {
                  setIsReservedModalOpen(false);
                  setSelectedUser(null);
                  setUserSearchQuery("");
                  setShowUserDropdown(false);
                }}>
                  <Box className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[500px] max-h-[70vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-xl font-semibold mb-4 text-center">Mark Product as Reserved</h2>

                    {/* Product Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                      <div className="flex items-center gap-3">
                        <Image
                          src={getImageUrl(gettingProduct?.image?.[0])}
                          alt={gettingProduct?.name}
                          width={60}
                          height={60}
                          unoptimized
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{gettingProduct?.name}</p>
                          <p className="text-gray-600 text-sm">Price: AED {gettingProduct?.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* User Search Input */}
                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search User to Reserve For *
                      </label>
                      <input
                        type="text"
                        value={selectedUser ? selectedUser.username : userSearchQuery}
                        onChange={(e) => {
                          setUserSearchQuery(e.target.value);
                          setSelectedUser(null);
                          setShowUserDropdown(e.target.value.length >= 2);
                        }}
                        onFocus={() => {
                          if (userSearchQuery.length >= 2) {
                            setShowUserDropdown(true);
                          }
                        }}
                        placeholder="Type username or full name (min 2 characters)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />

                      {/* User Dropdown List */}
                      {showUserDropdown && userSearchQuery.length >= 2 && !selectedUser && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {allUsers
                            .filter((user: any) =>
                              user._id !== loggedInUser && (
                                user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                user.fullName?.toLowerCase().includes(userSearchQuery.toLowerCase())
                              )
                            )
                            .map((user: any) => (
                              <div
                                key={user._id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserSearchQuery(user.username);
                                  setShowUserDropdown(false);
                                }}
                              >
                                <Image
                                  src={getImageUrl(user.image)}
                                  alt={user.username}
                                  width={40}
                                  height={40}
                                  unoptimized
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-gray-800">{user.username}</p>
                                  {user.fullName && (
                                    <p className="text-sm text-gray-600">{user.fullName}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          }
                          {allUsers.filter((user: any) =>
                            user._id !== loggedInUser && (
                              user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                              user.fullName?.toLowerCase().includes(userSearchQuery.toLowerCase())
                            )
                          ).length === 0 && (
                              <div className="p-3 text-center text-gray-500">
                                No users found
                              </div>
                            )}
                        </div>
                      )}

                      {/* Selected User Display */}
                      {selectedUser && (
                        <div className="mt-2 flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                          <Image
                            src={getImageUrl(selectedUser.image)}
                            alt={selectedUser.username}
                            width={40}
                            height={40}
                            unoptimized
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{selectedUser.username}</p>
                            {selectedUser.fullName && (
                              <p className="text-sm text-gray-600">{selectedUser.fullName}</p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUser(null);
                              setUserSearchQuery("");
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        className="cursor-pointer bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => {
                          setIsReservedModalOpen(false);
                          setSelectedUser(null);
                          setUserSearchQuery("");
                          setShowUserDropdown(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!selectedUser}
                        className={`cursor-pointer px-4 py-2 rounded ${!selectedUser
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}
                        onClick={() => {
                          if (selectedUser) {
                            handleReserved();
                          }
                        }}
                      >
                        Confirm Reservation
                      </button>
                    </div>
                  </Box>
                </Modal>
              </>
            ) : (
              <>
                {/* Apply for Authenticity */}
                {gettingProduct?.categoryId?.[0]?._id === process.env.NEXT_PUBLIC_DESIGNER_ID &&
                  gettingProduct?.price >= 600 &&
                  !gettingProduct?.authenticity && (
                    <button
                      className={`text-[16px] font-[600] mt-5 flex items-center justify-center gap-2 w-full px-7 py-3 rounded-lg transition ${reserve || sold
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer hover:border border-teal-800"
                        }`}
                      onClick={reserve || sold ? undefined : !loggedInUser ? () => toast.error("Please login first") : () => setIsAuthenticityModalOpen(true)}
                      disabled={reserve || sold}
                    >
                      Apply for Authenticity
                    </button>
                  )}

                {/* Buy Now */}
                <button
                  className={`text-[16px] font-[600] mt-3 flex items-center justify-center gap-2 w-full px-7 py-3 rounded-lg transition ${reserve || sold
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-300 hover:text-gray-950 cursor-pointer hover:border border-gray-600"
                    }`}
                  onClick={reserve || sold ? undefined : handleBuyNow}
                  disabled={reserve || sold}
                >
                  Buy Now
                </button>

                {/* Chat */}
                <button
                  className={`text-[16px] font-[600] mt-3 flex items-center justify-center gap-2 w-full px-7 py-3 rounded-lg transition ${sold
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-300 hover:text-gray-950 cursor-pointer hover:border border-gray-600"
                    }`}
                  onClick={sold ? undefined : handleChat}
                  disabled={sold}
                >
                  Chat with Seller
                  {!sold && <MessageCircle size={20} className="shrink-0" />}
                </button>

                {/* Seller Info */}
                <SellerButton
                  seller={{
                    username: gettingProduct?.userId?.username,
                    profileImage: getImageUrl(gettingProduct?.userId?.image),
                    rating: gettingProduct?.userId?.rating,
                    reviews: gettingProduct?.userId?.reviews,
                  }}
                  sellerId={gettingProduct?.userId?._id}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Authenticity Modal */}
      <AuthenticityModal
        open={isAuthenticityModalOpen}
        onClose={() => setIsAuthenticityModalOpen(false)}
        productId={productId as string}
        sellerId={gettingProduct?.userId?._id}
        productTitle={gettingProduct?.title}
        sellerName={gettingProduct?.userId?.username || gettingProduct?.userId?.fullName}
        onPaymentCompleted={fetchProductDetails}
      />

      {/* Related Products */}
      <div className="mt-12">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default ProductPage;