import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Camera, X } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Chatbox = () => {
  const [messages, setMessages] = useState<any>([]);
  const [offerPrice, setOfferPrice] = useState<any>("");
  const [message, setMessage] = useState<any>("");
  const [chat, setChat] = useState<any>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const loggedInUser: any = Cookies.get("userId");
  const [image, setImage] = useState<File []>([]);
  const [newChat, setNewChat] = useState<any>(null)
  const [showOffer, setShowOffer] = useState(false)
  const photoURL = Cookies.get("photourl")
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to the bottom of the chat box
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch chat data based on user ID
  useEffect(() => {
    const getChat = async () => {
      try {
        if (!loggedInUser) {
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatConversation/viewAll?userId=${loggedInUser} `
        );

        if (response.status !== 200) {
          toast.error("Error Connecting to Seller");
          return;
        }
        setChat(response.data.data);
      } catch (error) {
        toast.error("Error Occurred. Try again later");
        console.log("Error Fetching the Chat");
      }
    };
    getChat();
  }, []);

  const getChatFunc = async (firstChat: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/viewAll?userId=${firstChat?.userId?._id}&adminUser=${firstChat?.adminUser?._id}&productId=["${firstChat?.productId?.[0]?._id}"]`
    )
    if (response.status !== 200){
      toast.error("Error in fetching the Chat")
    };
    console.log("response from getchat :", response);
    setMessages(response.data.data)
  }

  // Auto-select the first chat and set the product ID in the URL when chat data is available
  useEffect(() => {
    if (Array.isArray(chat) && chat.length > 0) {
      const firstChat = chat[0];
      setSelectedChat(firstChat);
      console.log("first chat: ", firstChat);
      getChatFunc(firstChat)
    }
  }, [chat]);

  // Get product from localStorage when coming from product page
  useEffect(() => {
    const productFromStorage = localStorage.getItem("product");
    const fromProductPage = localStorage.getItem("fromProductPage");
    
    if (productFromStorage && fromProductPage === "true") {
      try {
        const parsedProduct = JSON.parse(productFromStorage);
        setNewChat(parsedProduct);
        
        // Create a temporary chat object
        const tempChat = {
          productId: [parsedProduct],
          userId: {
            _id: parsedProduct?.userId?._id
          },
          adminUser: {
            _id: parsedProduct?.userId?._id,
            username: parsedProduct?.userId?.username,
            image: parsedProduct?.userId?.image
          }
        };
        
        setSelectedChat(tempChat);
        getChatFunc(tempChat);
        
        // Clear the localStorage items
        localStorage.removeItem("product");
        localStorage.removeItem("fromProductPage");
      } catch (error) {
        console.error("Error parsing product from localStorage:", error);
      }
    }
  }, []);

  const handleMessageSend = async () => {
    const formData = new FormData();
    formData.append("productId", selectedChat?.productId?.[0]?._id)
    formData.append("adminUser", selectedChat?.adminUser?._id)
    formData.append("userId", selectedChat?.userId?._id)
    formData.append("senderId", loggedInUser)
    formData.append("sendBy", loggedInUser === selectedChat?.adminUser?._id ? "admin": "user")
    image.forEach((img) => formData.append("image", img));
    if(message !== ""){
      formData.append("message", message);
    }

    if(offerPrice !== ""){
      formData.append("bidStatus", "pending");
      formData.append("bidPrice", offerPrice);
    }
   try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/create`,
      formData
    )
    getChatFunc(selectedChat)
    console.log("Response status from Chat Creating: ", response.data);
    setMessage("")
    setOfferPrice("")
    setImage([])
   } catch (error) {
    console.log("error Creating a message");
    return
   }
  };

  const handleOfferAccept = async (id: any, bidPrice: Number) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/update/${id}`,
        { bidStatus: "Accepted" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      
      if (response.status !== 200){
        toast.error("Error while accepting the offer")
        return
      }
      console.log("offer accept response", response);
      getChatFunc(selectedChat)
      const responseforBID = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/updateBid?productId=${selectedChat?.productId?.[0]?._id}&userId=${selectedChat?.userId?._id}&price=${bidPrice}`
      )
      if (responseforBID.status !== 200){
        toast.error("Error while updating the bid")
        return
      }
      console.log("response for bid update", responseforBID);
      toast.success("Offer Accepted Successfully")
    } catch (error) {
      console.log("Error accepting offer: ", error);
      toast.error("Error accepting the offer. Please try again later.");
      return
    }
    
  }

  const handleOfferReject = async (id: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/update/${id}`,
        { bidStatus: "Decline" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status !== 200){
        toast.error("Error while Rejecting the offer")
        return
      }
      console.log("offer Reject response", response);
      getChatFunc(selectedChat)
    } catch (error) {
      console.log("error in rejecting the offer");
      toast.error("Error!! try again later")
      return
    }
  }

  const handleBuyNow = async (id: any) => {
    localStorage.setItem("productsInfo", JSON.stringify(selectedChat?.productId?.[0]))
    router.push(`/checkout?productId=${selectedChat?.productId?.[0]?._id}&userId=${selectedChat?.userId?._id}&adminUser=${selectedChat?.adminUser?._id}`);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const newImages = [...image]; // Clone the current image state array
        for (let i = 0; i < files.length; i++) {
          if (newImages.length < 2) {
            newImages.push(files[i]); // Push each selected file to the array
          } else {
            toast.error("You can upload up to 2 images only.");
            break;
          }
        }
        setImage(newImages); // Update the state with the new array of images
      }
    };
  
    const handleRemoveImage = (index: number) => {
      const updatedImages = image.filter((_, i) => i !== index); // Remove the image at the given index
      setImage(updatedImages); // Update the state with the new images array
    };


  return  (
    <div className="flex w-full max-w-6xl mx-auto bg-white border rounded-xl shadow-md mt-15">
      {/* Sidebar */}
      <div className="w-1/4 bg-white text-gray-800 p-4 rounded-l-xl border-r-2">
        <h2 className="text-lg font-bold mb-4 border-b-2">Inbox</h2>
        <ul>
          {chat?.map((chatMessage: any) => (
            <li
              key={chatMessage._id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-md mb-2 transition ${
                selectedChat?._id === chatMessage._id
                  ? "bg-gray-200 text-black"
                  : "hover:bg-gray-300 text-black"
              }`}
              onClick={() => {
                setSelectedChat(chatMessage);
                getChatFunc(chatMessage)
              }}
            >
              <Image
                className="w-10 h-10 object-cover rounded-full"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${chatMessage?.adminUser.image || "/default-avatar.png"}`}
                alt={chatMessage.adminUser.fullName}
                width={40}
                height={40}
              />
              <div className="text-lg">
                {chatMessage.adminUser.username}
                <br />
                {chatMessage?.productId?.slice(0, 1).map((mg: any) => (
                  <div key={mg._id} className="w-[40px] h-[40px] bg-gray-100 rounded-[5px] inline-block overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mg?.image?.[0]}`}
                      alt={"Product"}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox */}
      <div className="w-3/4 p-4">
        <h2 className="text-lg border-b-2 font-semibold text-gray-800 mb-4 text-center">
          {selectedChat?.adminUser?.username}
        </h2>

        {/* Product Details */}
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-3">
            <Image
              className="w-16 h-16 object-cover rounded-lg"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${newChat ? newChat?.image?.[0] : selectedChat?.productId?.[0]?.image?.[0] || "/default-product.png"}`}
              alt={newChat ? newChat?.name : selectedChat?.productId?.[0]?.name}
              width={16}
              height={64}
              unoptimized
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {newChat ? newChat?.name : selectedChat?.productId?.[0]?.name}
              </h3>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 text-sm">
                    Price: ${newChat ? newChat?.price : selectedChat?.productId?.[0]?.price}
                  </p>
                  <p className="text-teal-700 text-sm">
                    (${newChat ? newChat?.inclPrice : selectedChat?.productId?.[0]?.inclPrice} incl. of tax)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="bg-gray-800 text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-gray-600 cursor-pointer"
            onClick={() => setShowOffer(true)}
          >
            Make an Offer
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          className="mt-4 space-y-3 max-h-96 overflow-y-auto p-2 ">
          {messages.length > 0 ? (
            messages.map((msg: any, index: any) => {
              const isSentByCurrentUser = msg.senderId === loggedInUser;
              const senderImage = isSentByCurrentUser ? photoURL : selectedChat?.photoURL;

              return (
                <div key={index} className={`flex items-start gap-3 ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                  <Image
                    src={senderImage}
                    alt={isSentByCurrentUser ? "You" : "Other"}
                    width={10}
                    height={10}
                    unoptimized
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className={`p-3 rounded-lg border max-w-[75%] ${msg.bidPrice ? "bg-gray-100 text-gray-800 font-semibold" : "bg-gray-200"}`}>
                    {msg.message && <p className="mb-1">{msg.message}</p>}
                    {msg.image && (
                      <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${msg.image}`}
                      className="mt-2 rounded-md max-h-40" 
                      alt="Message Image" 
                      width={225}
                      height={99}
                      unoptimized/>
                    )}
                    {msg.bidPrice && (
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-teal-600 font-semibold">Offer: ${msg.bidPrice}</p>

                        {/* Bid Status: Accepted */}
                        {msg.bidStatus === "Accepted" ? (
                          // Only show Buy Now if current user is the original offer sender (buyer)
                          msg.userId === loggedInUser  ? (
                            <button 
                              onClick={() => handleBuyNow(msg._id)}
                              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-fit cursor-pointer">
                              Buy Now
                            </button>
                          ) : (
                            <p className="text-sm text-green-500">You accepted the offer</p> // for seller
                          )
                        ) : msg.bidStatus === "Decline" ? (
                          // Show Rejected status to everyone
                          <p className="text-red-500 font-medium">Offer is Declined</p>
                        ) : isSentByCurrentUser ? (
                          // Pending view for buyer
                          <p className="text-sm text-gray-500 text-right">{msg.bidStatus || "Pending"}</p>
                        ) : (
                          // Show Accept/Reject buttons to seller
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOfferAccept(msg._id, msg.bidPrice)}
                              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleOfferReject(msg._id)}
                              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No messages yet.</p>
          )}
        </div>

        {/* Image Upload */}
      {image.length > 0 && (
        <div className="flex gap-2 p-2">
          {image.map((img, index) => (
            <div key={index} className="relative w-225 h-full aspectp-square overflow-hidden rounded-md border">
              <Image
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                width={225}
                height={99}
                className="object-cover w-full h-full rounded-md"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(img))}
              />
              <button
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                onClick={() => handleRemoveImage(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input */}
      <div className="mt-2 flex items-center border-t pt-3 sticky bottom-0 bg-white px-2">
        {/* Hidden Image Input */}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        {/* Camera Icon */}
        <button
          className="text-gray-500 mr-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={message.trim().length > 0}
        >
          <Camera className="w-6 h-6" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message here"
          className="w-full p-2 border rounded-md focus:outline-none"
          disabled={image.length > 0}
        />

        {/* Send Button */}
        <button
          onClick={handleMessageSend}
          disabled={!message.trim() && image.length === 0}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-gray-600 ml-2"
        >
          <Send size={22} className="shrink-0" />
        </button>
        </div>

        {/* Carousel Modal */}
        <Modal open={showOffer} onClose={() => setShowOffer(false)}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg shadow-lg w-[50%] md:w-[52%] max-w-lg h-[200px] overflow-hidden">
            <h3 className="text-xl font-semibold text-center mb-4">Enter Your Offer</h3>
            
            <div className="w-full flex justify-center items-center">
              <input
                type="text"
                placeholder="Enter your offer"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <br />
            <div 
              className="flex justify-center">
            <button
              onClick={() => setShowOffer(false)}
              className="  px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleMessageSend();
                setShowOffer(false);
              }}
              className="ml-4 px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Send Offer
            </button>
            </div>
          </Box>
        </Modal>
      </div>
      </div>
  );
};


export default Chatbox;