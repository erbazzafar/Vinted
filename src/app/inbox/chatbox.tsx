import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const loggedInUser: any = Cookies.get("userId");
  const router = useRouter();
  const [image, setImage] = useState<any>({});
  const [showOffer, setShowOffer] = useState(false)
  const photoURL = Cookies.get("photourl")
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

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

  const handleMessageSend = async () => {
    const formData = new FormData();
    formData.append("productId", selectedChat?.productId?.[0]?._id)
    formData.append("adminUser", selectedChat?.adminUser?._id)
    formData.append("userId", selectedChat?.userId?._id)
    formData.append("senderId", loggedInUser)
    formData.append("sendBy", loggedInUser === selectedChat?.adminUser?._id ? "admin": "user")
    if(message !== ""){
      formData.append("message", message);
    }
    if(Object.keys(image)?.length > 0){
      formData.append("image", image);
    }
    if(offerPrice !== ""){
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
   } catch (error) {
    console.log("error Creating a message");
    return
   }
  };

  // Filter messages for the selected product
  const filteredMessages = selectedChat
  ? messages.filter(
      (msg) =>
        msg.productId?._id === selectedChat?.productId?.[0]?._id &&
        (msg.userId === selectedChat.userId || msg.adminUser === selectedChat.adminUser)
    )
  : [];

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
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedChat?.productId?.[0]?.image?.[0] || "/default.jpg"}`}
              alt={selectedChat?.productId?.[0]?.name || "Product"}
              width={16}
              height={64}
              unoptimized
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedChat?.productId?.[0]?.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedChat?.productId?.[0]?.price}
              </p>
              <p className="text-teal-800 text-sm">
                {selectedChat?.productId?.[0]?.inclPrice} <span className="text-teal-800"> incl. of Tax</span>
              </p>
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
            messages.map((msg, index) => {
              const isSentByCurrentUser = msg.senderId === loggedInUser;
              const senderImage = isSentByCurrentUser ? photoURL : selectedChat?.photoURL;

              return (
                <div key={index} className={`flex items-start gap-3 ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                  <Image
                    className="w-10 h-10 object-cover rounded-full"
                    src={senderImage}
                    alt={isSentByCurrentUser ? "You" : "Other"}
                    width={10}
                    height={10}
                    unoptimized
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
                        <p className="text-teal-600 font-semibold">Offer: {msg.bidPrice}</p>
                        {!isSentByCurrentUser && (
                          <>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  router.push(`/check-out/${selectedChat?._id}`);
                                  console.log("Offer Accepted");
                                }}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Offer Rejected");
                                }}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                              >
                                Reject
                              </button>
                            </div>
                          </>
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

        {/* Message Input */}
        <div className="mt-4 flex items-center border-t pt-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message here"
            className="w-full p-2 border rounded-md focus:outline-none"
          />
          <button
            onClick={handleMessageSend}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-gray-600 cursor-pointer ml-2"
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