"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchingProduct = async () => {
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
    }
    fetchingProduct()
  }, [productId])

  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    if (gettingProduct?.image?.[0]) {
      setMainImage(gettingProduct.image[0]);
    }
  }, [gettingProduct]);

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
  const [allUsers, setAllUsers] = useState(null)

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

      // Use the *intended* new value before calling API
      const newReservedValue = !reserve

      const formData = new FormData();
      formData.append("reserved", newReservedValue.toString());

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

      const updatedReserved = response.data.data.reserved;
      setReserved(updatedReserved);

      toast.success(updatedReserved ? "Item is Reserved" : "Item is not reserved anymore");
    } catch (error) {
      console.error("Error updating product visibility:", error);
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
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
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

            {/* Main Image */}
            <div className="w-full px-6 md:px-0 order-1 md:order-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mainImage}`}
                alt="Product"
                width={500}
                height={600}
                unoptimized
                className="w-full h-[530px] object-cover rounded-lg shadow-lg"
              />
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
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
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
                    profileImage: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${gettingProduct?.userId?.image}`,
                    rating: gettingProduct?.userId?.rating,
                    reviews: gettingProduct?.userId?.reviews,
                  }}
                  sellerId={gettingProduct?.userId?._id}
                />

                {/* Bump Modal */}
                <Modal open={isBumpModalOpen} onClose={() => setIsBumpModalOpen(false)}>
                  <Box className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[500px] max-h-[70vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-[13px] font-semibold mb-4">
                      Select how many days you want to bump your product
                    </h2>

                    {/* Options */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {Array.isArray(bumpDays) &&
                        bumpDays?.map((option) => {
                          const isSelected =
                            selectedBumpDays?.day === option.day;
                          const bumpPrice = (
                            (Number(option.percentage) / 100) *
                            Number(gettingProduct?.price || 0)
                          ).toFixed(2);

                          return (
                            <button
                              key={option._id}
                              className={`cursor-pointer min-w-[140px] flex items-center justify-center gap-2 text-[13px] px-3 py-2 rounded-lg border whitespace-nowrap transition-colors duration-200 ${isSelected
                                ? "bg-gray-800 text-white border-gray-900"
                                : "bg-gray-100 text-black border-gray-300"
                                }`}
                              onClick={() => setSelectedBumpDays(option)}
                            >
                              {option.day} days –
                              <div className="flex items-center gap-1">
                                <Image
                                  src="/dirhamlogo.png"
                                  alt="dirham"
                                  height={15}
                                  width={15}
                                />
                                <span>{bumpPrice}</span>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        className="cursor-pointer bg-gray-300 text-[13px] text-black px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setIsBumpModalOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        disabled={bump || !selectedBumpDays}
                        className={`cursor-pointer text-[13px] px-4 py-2 rounded ${bump
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                          }`}
                        onClick={async () => {
                          if (bump) {
                            toast.error("This product is already bumped");
                            return;
                          }
                          await handleBump(selectedBumpDays.day);
                          setIsBumpModalOpen(false);
                        }}
                      >
                        {bump ? "Already Bumped" : "Confirm Bump"}
                      </button>
                    </div>
                  </Box>
                </Modal>
              </>
            ) : (
              <>
                {/* Buy Now */}
                <button
                  className="text-xl mt-5 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-2 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>

                {/* Chat */}
                <button
                  className="text-xl mt-3 flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-7 py-2 rounded-lg hover:bg-gray-300 transition hover:text-gray-950 cursor-pointer"
                  onClick={handleChat}
                >
                  Chat with Seller
                  <MessageCircle size={20} className="shrink-0" />
                </button>

                {/* Seller Info */}
                <SellerButton
                  seller={{
                    username: gettingProduct?.userId?.username,
                    profileImage: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${gettingProduct?.userId?.image}`,
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

      {/* Related Products */}
      <div className="mt-12">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default ProductPage;