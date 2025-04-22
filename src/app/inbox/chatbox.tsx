import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Camera, X, Menu } from "lucide-react";
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

  // Get product from localStorage when coming from product page
  useEffect(() => {
    const productFromStorage = localStorage.getItem("product");
    const fromProductPage = localStorage.getItem("fromProductPage");
    
    if (productFromStorage && fromProductPage === "true") {
      try {
        const parsedProduct = JSON.parse(productFromStorage);
        setNewChat(parsedProduct);
        
        // Check if chat already exists for this product
        const existingChat = chat.find((c: any) => 
          c.productId?.[0]?._id === parsedProduct._id && 
          (c.userId?._id === loggedInUser || c.adminUser?._id === loggedInUser)
        );

        if (existingChat) {
          // If chat exists, select it
          setSelectedChat(existingChat);
          getChatFunc(existingChat);
        } else {
          // Create a new chat object
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
          
          // Add new chat to the beginning of the chat list
          setChat(prevChats => [tempChat, ...prevChats]);
          setSelectedChat(tempChat);
          getChatFunc(tempChat);
        }
        
        // Clear the localStorage items
        localStorage.removeItem("product");
        localStorage.removeItem("fromProductPage");
      } catch (error) {
        console.error("Error parsing product from localStorage:", error);
      }
    }
  }, [chat, loggedInUser]);

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
  }, [loggedInUser]);

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
    <div className="mt-0 md:mt-20 flex flex-col md:flex-row w-full mx-auto min-h-screen">
      {/* Mobile Menu Button */}
      <button 
        className={`md:hidden fixed top-32 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg ${selectedChat ? 'block' : 'hidden'}`}
        onClick={() => setSelectedChat(null)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`${selectedChat ? '-translate-x-full' : 'translate-x-0'} 
        md:translate-x-0 fixed md:relative z-40 w-64 bg-white p-5 transition-transform duration-300 ease-in-out
        h-screen md:h-auto`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mt-2 mb-4 border-b-4">Inbox</h2>
          <button 
            className="md:hidden p-2 text-gray-800"
            onClick={() => setSelectedChat(true)}
          >
            <X size={24} />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {chat?.map((chatMessage: any) => {
              const profileImage = chatMessage?.adminUser?.image;
              const username = chatMessage?.adminUser?.username;

              return (
                <li
                  key={chatMessage._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                    selectedChat?._id === chatMessage._id ? "bg-gray-300" : ""
                  }`}
                  onClick={() => {
                    setSelectedChat(chatMessage);
                    getChatFunc(chatMessage);
                  }}
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${profileImage || "/default-avatar.png"}`}
                      alt={username}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm md:text-base">{username}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile menu */}
      {!selectedChat && (
        <div 
          className="fixed inset-0 bg-white/5 z-30 md:hidden"
          onClick={() => setSelectedChat(null)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0">
        {selectedChat ? (
          <>
            <h1 className="text-xl font-semibold mb-4 border-b-4">{selectedChat?.adminUser?.username}</h1>
            <div className="bg-gray-50 gap-y-4 p-4 md:p-6 rounded-lg">
              {/* Product Details */}
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  <Image
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${newChat ? newChat?.image?.[0] : selectedChat?.productId?.[0]?.image?.[0] || "/default-product.png"}`}
                    alt={newChat ? newChat?.name : selectedChat?.productId?.[0]?.name}
                    width={16}
                    height={64}
                    unoptimized
                  />
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">
                      {newChat ? newChat?.name : selectedChat?.productId?.[0]?.name}
                    </h3>
                    <div className="flex flex-col">
                      <p className="text-gray-600 text-sm md:text-base">
                        ${newChat ? newChat?.price : selectedChat?.productId?.[0]?.price}
                      </p>
                      <p className="text-teal-700 text-xs md:text-sm">
                        ${newChat ? newChat?.inclPrice : selectedChat?.productId?.[0]?.inclPrice} incl. of tax
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-gray-800 text-white px-2 md:px-6 py-1 md:py-2 rounded-lg transition duration-300 hover:bg-gray-600 cursor-pointer text-xs md:text-base"
                  onClick={() => setShowOffer(true)}
                >
                  Make an Offer
                </button>
              </div>

              {/* Chat Messages */}
              <div className="mt-4 space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto p-2">
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
                          className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"
                        />
                        <div className={`p-2 md:p-3 rounded-lg border max-w-[75%] ${msg.bidPrice ? "bg-gray-100 text-gray-800 font-semibold" : "bg-gray-200"}`}>
                          {msg.message && <p className="mb-1 text-sm md:text-base">{msg.message}</p>}
                          {msg.image && (
                            <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${msg.image}`}
                            className="mt-2 rounded-md max-h-32 md:max-h-40" 
                            alt="Message Image" 
                            width={225}
                            height={99}
                            unoptimized/>
                          )}
                          {msg.bidPrice && (
                            <div className="mt-2 flex flex-col gap-2">
                              <p className="text-teal-600 font-semibold text-sm md:text-base">Offer: ${msg.bidPrice}</p>

                              {/* Bid Status: Accepted */}
                              {msg.bidStatus === "Accepted" ? (
                                msg.userId === loggedInUser  ? (
                                  <button 
                                    onClick={() => handleBuyNow(msg._id)}
                                    className="px-4 md:px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-fit cursor-pointer text-sm md:text-base">
                                    Buy Now
                                  </button>
                                ) : (
                                  <p className="text-xs md:text-sm text-green-500">You accepted the offer</p>
                                )
                              ) : msg.bidStatus === "Decline" ? (
                                <p className="text-red-500 font-medium text-sm md:text-base">Offer is Declined</p>
                              ) : isSentByCurrentUser ? (
                                <p className="text-xs md:text-sm text-gray-500 text-right">{msg.bidStatus || "Pending"}</p>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleOfferAccept(msg._id, msg.bidPrice)}
                                    className="px-3 md:px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-sm md:text-base"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleOfferReject(msg._id)}
                                    className="px-3 md:px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-sm md:text-base"
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
                    <div key={index} className="relative w-[150px] md:w-[225px] h-full aspect-square overflow-hidden rounded-md border">
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
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 md:p-4">
                <div className="max-w-4xl mx-auto flex items-center">
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
                    <Camera className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message here"
                    className="w-full p-2 border rounded-md focus:outline-none text-sm md:text-base"
                    disabled={image.length > 0}
                  />

                  {/* Send Button */}
                  <button
                    onClick={handleMessageSend}
                    disabled={!message.trim() && image.length === 0}
                    className="bg-gray-800 text-white px-3 md:px-4 py-2 rounded-lg transition duration-300 hover:bg-gray-600 ml-2"
                  >
                    <Send size={18} className="shrink-0 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">Select a chat to start messaging</p>
          </div>
        )}

        {/* Carousel Modal */}
        <Modal open={showOffer} onClose={() => setShowOffer(false)}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg shadow-lg w-[90%] md:w-[52%] max-w-lg h-[200px] overflow-hidden">
            <h3 className="text-lg md:text-xl font-semibold text-center mb-4">Enter Your Offer</h3>
            
            <div className="w-full flex justify-center items-center">
              <input
                type="text"
                placeholder="Enter your offer"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base"
              />
            </div>
            <br />
            <div className="flex justify-center">
              <button
                onClick={() => setShowOffer(false)}
                className="px-3 md:px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleMessageSend();
                  setShowOffer(false);
                }}
                className="ml-4 px-4 md:px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm md:text-base"
              >
                Send Offer
              </button>
            </div>
          </Box>
        </Modal>
      </main>
    </div>
  );
};


export default Chatbox;