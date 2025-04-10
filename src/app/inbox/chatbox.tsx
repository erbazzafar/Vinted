import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [counterOffer, setCounterOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const loggedInUser = Cookies.get("userId");
  const router = useRouter();
  const photoURL = Cookies.get("photourl")

  // Fetch chat data based on user ID
  useEffect(() => {
    const getChat = async () => {
      try {
        if (!loggedInUser) {
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatConversation/viewAll?userId=67f030f3496db3aa20293983`
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

  // Auto-select the first chat and set the product ID in the URL when chat data is available
  useEffect(() => {
    if (Array.isArray(chat) && chat.length > 0) {
      const firstChat = chat[0];
      setSelectedChat(firstChat);
      console.log("first chat: ", firstChat);

      // Update the URL with the selected product ID (0th index)
      router.push(`/inbox/${firstChat._id}`);
    }
  }, []);

  const handleMessageSend = () => {
    if (selectedChat && message.trim()) {
      // const newMessage = {
      //   id: messages.length + 1,
      //   text: message,
      //   type: "message",
      //   userId: selectedChat.userId,
      // };
      // setMessages([...messages, newMessage]);
    }
  };

  const handleOfferSubmit = () => {
    if (!offerPrice.trim()) return;
    // const newOffer = {
    //   id: messages.length + 1,
    //   text: `Offer: $${offerPrice}`,
    //   type: "offer",
    //   offerPrice,
    //   userId: selectedChat.userId,
    // };
    // setMessages([...messages, newOffer]);
    setCounterOffer(false);
    setOfferPrice("");
  };

  // Filter messages for the selected product
  const filteredMessages = selectedChat
    ? messages.filter((msg) => msg.userId === selectedChat.userId)
    : [];

  return (
    <div className="flex w-full max-w-6xl mx-auto bg-white border rounded-xl shadow-md mt-15">
      {/* Sidebar */}
      <div className="w-1/4 bg-white text-gray-800 p-4 rounded-l-xl border-r-2">
        <h2 className="text-lg font-bold mb-4 border-b-2">Inbox</h2>
        <ul>
          {chat?.map((chatMessage: any) => (
            <li
              key={chatMessage._id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-md mb-2 transition ${selectedChat?._id === chatMessage._id
                  ? "bg-gray-200 text-black"
                  : "hover:bg-gray-300 text-black"
                }`}
              onClick={() => {
                setSelectedChat(chatMessage);
                // Update the URL when selecting a different chat
                // router.replace(`/inbox/${chatMessage._id}`);
              }}
            >
              <Image
                className="w-10 h-10 object-cover rounded-full"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${chatMessage?.adminUser.image || "/default-avatar.png"}`}
                alt={chatMessage.adminUser.fullName}
                width={10}
                height={10}
              />
              <div className="text-lg">
                {chatMessage.adminUser.username}
                <br />
                {chatMessage?.productId?.slice(0, 1).map((mg) => (
                  <div className="w-[40px] h-[40px] bg-gray-100 rounded-[5px] inline-block overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mg?.image?.[0]}`}
                      alt={"Product"}
                      width={40}
                      height={40}
                      className="object-cover" />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox */}
      <div className="w-3/4 p-4">
        {/* Chat Header */}
        <h2 className="text-lg border-b-2 font-semibold text-gray-800 mb-4 text-center">
          {selectedChat?.adminUser?.username}
        </h2>

        {/* Product Details */}
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-3">
            <img
              className="w-16 h-16 object-cover rounded-lg"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedChat?.productId?.[0]?.image?.[0] || "/default.jpg"}`}
              alt={selectedChat?.productId?.[0]?.name || "Product"}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedChat?.productId?.[0]?.name}
              </h3>
              <p className="text-gray-600 text-sm">${selectedChat?.productId?.[0]?.price}</p>
              <p className="text-teal-800 text-sm">
                ${selectedChat?.productId?.[0]?.inclPrice} <span className="text-teal-800"> incl. of Tax</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setCounterOffer(true)}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-gray-600 cursor-pointer"
          >
            Make an Offer
          </button>
        </div>

        {/* Chat Messages */}
        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto p-2">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <img
                  className="w-10 h-10 object-cover rounded-full"
                  src={msg.userId === loggedInUser ? photo : selectedChat?.adminUser.image}
                  alt={msg.userId === loggedInUser ? "You" : selectedChat?.adminUser.name}
                />
                <div
                  className={`p-3 rounded-lg border max-w-[75%] ${msg.type === "offer"
                      ? "bg-gray-100 text-gray-800 font-semibold"
                      : "bg-gray-200"
                    }`}
                >
                  <p>{msg.text}</p>
                  {msg.type === "offer" && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            router.push(`/check-out/${selectedChat?._id}`);
                            console.log("Offer Accepted");
                          }}
                          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-md cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            console.log("Offer Rejected");
                          }}
                          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-md cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                      <button
                        className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 text-md cursor-pointer"
                        onClick={() => setCounterOffer(true)}
                      >
                        Counter Offer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
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
      </div>

      {/* Offer Popup */}
      {counterOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[450px] min-h-[180px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Make an Offer</h2>
            <input
              type="text"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Enter your offer price"
              className="w-full p-3 border rounded-md focus:outline-none mb-4 text-lg"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-5 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-lg"
                onClick={() => setCounterOffer(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-800 text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-gray-600 cursor-pointer text-lg"
                onClick={handleOfferSubmit}
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;