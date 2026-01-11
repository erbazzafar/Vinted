import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Send, Camera, X, ChevronsLeft } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Chatbox = () => {

  const queryPrams = useSearchParams()
  const id = queryPrams.get("id")
  const pathname = usePathname()

  console.log("===>", id);


  const [messages, setMessages] = useState<any>([]);
  const [offerPrice, setOfferPrice] = useState<any>("");
  const [message, setMessage] = useState<any>("");
  const [chat, setChat] = useState<any>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const loggedInUser: any = Cookies.get("userId");
  const [image, setImage] = useState<File[]>([]);
  const [newChat, setNewChat] = useState<any>(null)
  const [showOffer, setShowOffer] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstState, setFirstState] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [hasOrders, setHasOrders] = useState(false);
  const token = Cookies.get("user-token");
  const [affaredoroChat, setAffaredoroChat] = useState<any>(null);
  const [affaredoroUnreadCount, setAffaredoroUnreadCount] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        // Use requestAnimationFrame for smooth scrolling
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    };

    // Use setTimeout to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

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

  // Check if user has orders received as a seller (like in wallet screen)
  useEffect(() => {
    const checkUserOrders = async () => {
      try {
        if (!loggedInUser || !token) {
          return;
        }
        // Check for orders where user is the seller (toUserId) - same as wallet screen
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/getAll?toUserId=${loggedInUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 && response.data?.data) {
          setHasOrders(response.data.data.length > 0);
        }
      } catch (error) {
        console.log("Error checking user orders:", error);
        setHasOrders(false);
      }
    };
    checkUserOrders();
  }, [loggedInUser, token]);

  // Fetch Affaredoro unread count
  const fetchAffaredoroUnreadCount = async () => {
    try {
      if (!loggedInUser || !token || !hasOrders) {
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-seller-chat/seller/${loggedInUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data?.status === 'ok') {
        const chatData = response.data.data;
        setAffaredoroUnreadCount(chatData?.unreadCount?.seller || 0);
      }
    } catch (error) {
      // If no chat exists, unread count is 0
      setAffaredoroUnreadCount(0);
    }
  };

  // Fetch chat data based on user ID
  useEffect(() => {
    getChat();
    setTimeout(() => setFirstState(true), 1000);
    if (id) {
      setNewChat(JSON.parse(localStorage.getItem('product')));
    }
  }, []);

  // Fetch Affaredoro unread count when orders are available
  useEffect(() => {
    if (hasOrders && loggedInUser && token) {
      fetchAffaredoroUnreadCount();
    }
  }, [hasOrders, loggedInUser, token]);

  const getChatFunc = async (firstChat: any, updateNewChat: Boolean) => {
    // Skip if it's a temporary chat (will be created when first message is sent)
    if (firstChat?._id?.startsWith('temp-')) {
      setIsLoadingMessages(false);
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    try {
      // Handle Affaredoro chat differently
      if (firstChat?._id === 'affaredoro') {
        await getAffaredoroChat();
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/viewAll2?userId=${firstChat?.userId?._id}&adminUser=${firstChat?.adminUser?._id}&productId=["${firstChat?.productId?.[0]?._id}"]`
      )
      if (response.status !== 200) {
        toast.error("Error in fetching the Chat")
      };
      console.log("response from getchat :", response);
      if (updateNewChat) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.log("Error fetching chat:", error);
      toast.error("Error in fetching the Chat");
    } finally {
      setIsLoadingMessages(false);
    }
  }

  // Get Affaredoro chat messages
  const getAffaredoroChat = async () => {
    setIsLoadingMessages(true);
    try {
      if (!loggedInUser || !token) {
        setIsLoadingMessages(false);
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-seller-chat/seller/${loggedInUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data?.status === 'ok') {
        const chatData = response.data.data;
        setAffaredoroChat(chatData);
        // Format messages for display
        if (chatData?.messages && Array.isArray(chatData.messages)) {
          // Sort messages by createdAt (oldest first)
          const sortedMessages = [...chatData.messages].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
          });
          setMessages(sortedMessages);
        } else {
          setMessages([]);
        }
        // Update unread count
        setAffaredoroUnreadCount(chatData?.unreadCount?.seller || 0);
        // Mark messages as read when viewing
        if (chatData?.unreadCount?.seller > 0) {
          await markAffaredoroMessagesAsRead();
          // Refresh unread count after marking as read
          setAffaredoroUnreadCount(0);
          // Also refresh the unread count in the background
          fetchAffaredoroUnreadCount();
        }
      } else if (response.status === 200 && response.data?.message === "No previous chat found") {
        setAffaredoroChat(null);
        setMessages([]);
        setAffaredoroUnreadCount(0);
      }
    } catch (error) {
      console.log("Error fetching Affaredoro chat:", error);
      setAffaredoroChat(null);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Mark Affaredoro messages as read
  const markAffaredoroMessagesAsRead = async () => {
    try {
      if (!loggedInUser || !token) {
        return;
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-seller-chat/read-seller/${loggedInUser}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("Error marking messages as read:", error);
    }
  };

  // Auto-select the first chat and set the product ID in the URL when chat data is available
  useEffect(() => {
    if (newChat) {
      // If newChat exists (from query id), create a temporary chat object to show the chat interface
      if (Array.isArray(chat) && chat.length > 0) {
        // Find matching chat
        const existingChat = chat.find((c) =>
          c?.adminUser?._id === newChat?.userId?._id &&
          c?.userId?._id === loggedInUser &&
          c?.productId?.[0]?._id === newChat?._id
        );

        if (existingChat) {
          setSelectedChat(existingChat);
          getChatFunc(existingChat, true);
          // Ensure mobile view is properly set for new chats
          setIsMobileChatOpen(true);
        } else {
          // No matching chat found - create a temporary chat object to show the interface
          const tempChat = {
            _id: 'temp-' + Date.now(),
            adminUser: {
              _id: newChat?.userId?._id,
              username: newChat?.userId?.username || 'User',
              image: newChat?.userId?.image || null
            },
            userId: {
              _id: loggedInUser
            },
            productId: [newChat]
          };
          setSelectedChat(tempChat);
          setIsMobileChatOpen(true);
        }
      } else {
        // Chat list not loaded yet, but newChat exists - create temporary chat object
        const tempChat = {
          _id: 'temp-' + Date.now(),
          adminUser: {
            _id: newChat?.userId?._id,
            username: newChat?.userId?.username || 'User',
            image: newChat?.userId?.image || null
          },
          userId: {
            _id: loggedInUser
          },
          productId: [newChat]
        };
        setSelectedChat(tempChat);
        setIsMobileChatOpen(true);
      }
    } else if (Array.isArray(chat) && chat.length > 0 && !firstState) {
      const firstChat = chat[0];
      setSelectedChat(firstChat);
      getChatFunc(firstChat, true);
    }
  }, [chat, newChat, firstState]);

  // Add a new useEffect to handle mobile view for new chats
  useEffect(() => {
    if (newChat) {
      setIsMobileChatOpen(true);
    }
  }, [newChat]);

  const handleMessageSend = async () => {
    // Handle Affaredoro chat differently
    if (selectedChat?._id === 'affaredoro') {
      await sendAffaredoroMessage();
      return;
    }

    const formData = new FormData();
    const adminUserId = newChat ? newChat?.userId?._id : selectedChat?.adminUser?._id;
    formData.append("productId", newChat ? newChat?._id : selectedChat?.productId?.[0]?._id)
    formData.append("adminUser", adminUserId)
    formData.append("userId", newChat ? loggedInUser : selectedChat?.userId?._id)
    formData.append("senderId", loggedInUser)
    formData.append("sendBy", loggedInUser === adminUserId ? "admin" : "user")
    image.forEach((img) => formData.append("image", img));
    if (message !== "") {
      formData.append("message", message);
    }

    if (offerPrice !== "") {
      formData.append("bidStatus", "Pending");
      formData.append("bidPrice", offerPrice);
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/create`, formData);
      if (response?.status === 200) {
        // Refresh conversations list
        const chatConResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chatConversation/viewAll?userId=${loggedInUser} `);
        setChat(chatConResponse.data.data);

        if (newChat) {
          // Wait a bit for the conversation to be created in the backend
          await new Promise(resolve => setTimeout(resolve, 300));

          // Refresh conversations list again to get the newly created conversation
          const refreshedChatResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chatConversation/viewAll?userId=${loggedInUser} `);
          setChat(refreshedChatResponse.data.data);

          // Find the matching conversation based on product, adminUser, and userId
          const matchingChat = refreshedChatResponse.data.data.find((c: any) =>
            c?.adminUser?._id === newChat?.userId?._id &&
            c?.userId?._id === loggedInUser &&
            c?.productId?.[0]?._id === newChat?._id
          );

          if (matchingChat) {
            setSelectedChat(matchingChat);
            await getChatFunc(matchingChat, true);
          } else {
            // If not found, select the first chat (newly created should be first)
            const newFirstChat = refreshedChatResponse?.data?.data?.[0];
            if (newFirstChat) {
              setSelectedChat(newFirstChat);
              await getChatFunc(newFirstChat, true);
            }
          }

          setNewChat(null);
          localStorage.removeItem('product');
          router.replace(pathname);
          // Ensure mobile view is properly set
          setIsMobileChatOpen(true);
        } else {
          // For existing chat, just refresh messages
          getChatFunc(selectedChat, true);
        }
        setMessage("")
        setOfferPrice("")
        setImage([])
      }
    } catch (error) {
      console.log("error Creating a message");
      return
    }
  };

  // Send message to Affaredoro
  const sendAffaredoroMessage = async () => {
    try {
      if (!loggedInUser || !token || !message.trim()) {
        if (!message.trim() && image.length === 0) {
          toast.error("Please enter a message");
        }
        return;
      }

      // Note: AdminSellerChat API doesn't support images, so we'll only send text messages
      if (image.length > 0) {
        toast.error("Image upload is not supported for Affaredoro chat");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-seller-chat/send-seller`,
        {
          sellerId: loggedInUser,
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data?.status === 'ok') {
        const chatData = response.data.data;
        setAffaredoroChat(chatData);
        // Update messages
        if (chatData?.messages && Array.isArray(chatData.messages)) {
          // Sort messages by createdAt (oldest first)
          const sortedMessages = [...chatData.messages].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
          });
          setMessages(sortedMessages);
        }
        // Refresh unread count after sending
        setAffaredoroUnreadCount(0);
        setMessage("");
        setImage([]);
        toast.success("Message sent successfully");
      }
    } catch (error: any) {
      console.log("Error sending message to Affaredoro:", error);
      toast.error(error?.response?.data?.message || "Error sending message. Please try again.");
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

      if (response.status !== 200) {
        toast.error("Error while accepting the offer")
        return
      }
      console.log("offer accept response", response);
      getChatFunc(selectedChat, true)
      const responseforBID = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/updateBid?productId=${selectedChat?.productId?.[0]?._id}&userId=${selectedChat?.userId?._id}&price=${bidPrice}`
      )
      if (responseforBID.status !== 200) {
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
      if (response.status !== 200) {
        toast.error("Error while Rejecting the offer")
        return
      }
      console.log("offer Reject response", response);
      getChatFunc(selectedChat, true)
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

  // Format time for message display
  const formatMessageTime = (createdAt: string | Date) => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

    // If today, just show time
    if (diffInHours < 24 && date.getDate() === now.getDate()) {
      return timeString;
    }

    // If yesterday
    if (diffInHours < 48 && date.getDate() === now.getDate() - 1) {
      return `Yesterday ${timeString}`;
    }

    // If within a week, show day name
    if (diffInHours < 168) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]} ${timeString}`;
    }

    // Otherwise show date and time
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${timeString}`;
  };


  return (
    <div className="flex w-full max-w-6xl mx-auto border border-gray-200 rounded-xl shadow-lg mt-4 md:mt-10 mb-4 md:mb-10 h-[calc(100vh-220px)] md:h-auto overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/4 text-gray-800 p-4 rounded-l-xl border-r border-gray-200 bg-white ${isMobileChatOpen ? "hidden" : "block"
          } md:block h-full flex flex-col overflow-hidden`}
      >
        <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-3 text-black flex-shrink-0">Inbox</h2>
        <ul className="overflow-y-auto flex-1 min-h-0">
          {/* Affaredoro Conversation - Only show if user has orders */}
          {hasOrders && (
            <li
              className={`flex items-center gap-3 cursor-pointer rounded-lg mb-2 p-2 transition ${selectedChat?._id === 'affaredoro'
                ? 'bg-gray-100 text-black'
                : 'hover:bg-gray-50 text-black'
                }`}
              onClick={async () => {
                setNewChat(null);
                setMessages([]); // Clear previous messages
                // Create a special chat object for Affaredoro
                const affaredoroChatObj = {
                  _id: 'affaredoro',
                  adminUser: {
                    _id: 'affaredoro',
                    username: 'Affaredoro',
                    image: null
                  },
                  userId: {
                    _id: loggedInUser
                  },
                  productId: []
                };
                setSelectedChat(affaredoroChatObj);
                setIsMobileChatOpen(true);
                // Fetch Affaredoro chat messages
                await getAffaredoroChat();
              }}
            >
              {/* Affaredoro Icon/Image */}
              <Image
                className="w-11 h-11 ml-2 object-contain rounded-full border"
                src="/affaredoro.jpg"
                alt="Affaredoro"
                width={30}
                height={30}
              />
              <div className="font-semibold text-[13px] flex-1">
                <div className="flex items-center justify-between">
                  <span>Affaredoro</span>
                  {affaredoroUnreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {affaredoroUnreadCount}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 font-normal mt-0.5">For Orders</div>
              </div>
            </li>
          )}
          {chat?.map((chatMessage: any) => (
            <li
              key={chatMessage._id}
              className={`flex items-center gap-3 cursor-pointer rounded-lg mb-2 p-2 transition ${selectedChat?._id === chatMessage._id
                ? 'bg-gray-100 text-black'
                : 'hover:bg-gray-50 text-black'
                }`}
              onClick={() => {
                setNewChat(null);
                setSelectedChat(chatMessage);
                setMessages([]); // Clear previous messages
                getChatFunc(chatMessage, true);
                setIsMobileChatOpen(true); // Open chat in mobile view
              }}
            >
              {/* User Image  */}
              <Image
                className="w-11 h-11 ml-2 object-cover rounded-full"
                src={
                  chatMessage?.adminUser?._id === loggedInUser
                    ? (chatMessage?.userId?.image
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${chatMessage?.userId?.image}`
                      : `/imageLogo2.jpg`
                    )
                    : (chatMessage?.adminUser?.image
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${chatMessage?.adminUser?.image}`
                      : `/imageLogo2.jpg`
                    )
                }
                alt={chatMessage.adminUser?.fullName}
                width={30}
                height={30}
              />
              <div className="font-semibold text-[13px]">
                {chatMessage.adminUser?._id === loggedInUser ? chatMessage?.userId?.username : chatMessage?.adminUser?.username}
                <br />
                {chatMessage?.productId?.slice(0, 1).map((mg: any) => (
                  <div key={mg?._id} className="mt-1 w-[33px] h-[33px] bg-gray-100 rounded-[5px] inline-block overflow-hidden">
                    {/* product image  */}
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mg?.image?.[0]}`}
                      alt="Product"
                      width={40}
                      height={40}
                      className=" object-contain"
                    />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox */}
      <div
        className={`w-full md:w-3/4 relative bg-white flex flex-col h-full overflow-hidden ${isMobileChatOpen ? "block" : "hidden"
          } md:block`}
      >
        <div className="flex items-center border-b border-gray-200 p-3 bg-white h-[50px]">
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileChatOpen(false)}
          >
            <ChevronsLeft size={24} className="cursor-pointer" />
          </button>
          <h2 className="text-lg font-semibold text-black text-center flex-1">
            {!selectedChat
              ? 'Select a conversation'
              : selectedChat?._id === 'affaredoro'
                ? 'Affaredoro'
                : (newChat ? newChat?.userId?.username : selectedChat?.adminUser?._id === loggedInUser ? selectedChat?.userId?.username : selectedChat?.adminUser?.username)
            }
          </h2>
        </div>

        {/* Product Details - Hide for Affaredoro chat - 60px */}
        {selectedChat && selectedChat?._id !== 'affaredoro' ? (
          <div className="px-4 py-1 flex justify-between items-center border-b border-gray-200 bg-white h-[60px]">
            <div className="flex items-center gap-3">
              <Image
                className="w-12 h-12 object-cover rounded-lg"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${newChat ? newChat?.image?.[0] : selectedChat?.productId?.[0]?.image?.[0] || "/default-product.png"}`}
                alt={"Product image"}
                width={16}
                height={64}
                unoptimized
              />
              <div>
                <h3 className="text-[13px] font-semibold text-gray-800">
                  {newChat ? newChat?.name : selectedChat?.productId?.[0]?.name}
                </h3>
                {(() => {
                  const product = newChat ? newChat : selectedChat?.productId?.[0]
                  const userBid = product?.bid?.find((bidProduct: any) => bidProduct?.userId === selectedChat?.userId?._id);

                  return userBid ? (
                    <>

                      <p className="mt-1 text-[12px] font-semibold text-teal-600 flex items-center gap-1">
                        <Image
                          src={`/dirhamlogo.png`}
                          alt="dirham"
                          width={15}
                          height={15}
                          unoptimized
                        />
                        {userBid?.price}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-[12px] font-semibold text-teal-600 flex items-center gap-1">
                        <Image
                          src={`/dirhamlogo.png`}
                          alt="dirham"
                          width={15}
                          height={15}
                          unoptimized
                        />
                        {product?.price}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
            <button
              className={`text-xs px-4 py-2 rounded-lg transition-colors ${(newChat?.reserved || selectedChat?.productId?.[0]?.reserved)
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                }`}
              onClick={() => {
                if (newChat?.reserved || selectedChat?.productId?.[0]?.reserved) {
                  toast.error("This product is reserved");
                  return;
                }
                setShowOffer(true);
              }}
              disabled={newChat?.reserved || selectedChat?.productId?.[0]?.reserved}
            >
              Make an Offer
            </button>
          </div>
        ) : (
          <div className="px-4 py-1 flex justify-between items-center border-b border-gray-200 bg-white h-[60px]">
            <p className="text-xs text-gray-500 text-center w-full">This chat is between you and affaredoro team, you can direct write issue if anything you want to ask</p>
          </div>
        )}

        {/* Chat Messages  - 500px */}
        <div
          ref={messagesContainerRef}
          className="bg-gray-50 h-[500px] flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4 min-h-0"
          style={{
            WebkitOverflowScrolling: 'touch'
          }}>
          {!selectedChat ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 font-medium">Select a conversation to start chatting</p>
                <p className="text-xs text-gray-400">Choose a chat from the sidebar to view messages</p>
              </div>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : messages.length > 0 ? (
            (() => {
              // Handle Affaredoro chat messages differently
              const isAffaredoroChat = selectedChat?._id === 'affaredoro';
              // Don't reverse Affaredoro chat messages, only reverse regular chat messages
              const messagesToDisplay = isAffaredoroChat ? messages : [...messages]?.reverse();
              return messagesToDisplay.map((msg: any, index: any) => {
                let isSentByCurrentUser: boolean;
                let senderImage: string;

                if (isAffaredoroChat) {
                  // For Affaredoro chat, check senderType
                  isSentByCurrentUser = msg.senderType === 'seller';
                  senderImage = isSentByCurrentUser
                    ? `/imageLogo2.jpg` // User's image - you can enhance this later
                    : `/affaredoro.jpg`; // Affaredoro's image
                } else {
                  // Regular chat logic
                  isSentByCurrentUser = msg.senderId === loggedInUser;
                  senderImage = isSentByCurrentUser
                    ? (msg?.userId?.image?.includes("uploads/") ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${msg.userId?.image}` : msg?.userId?.image || `/imageLogo2.jpg`)
                    : (msg?.adminUser?.image?.includes("uploads/") ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${msg.adminUser.image}` : msg?.adminUser?.image || `/imageLogo2.jpg`);
                }


                return (
                  <div key={index} className={`flex items-start gap-3 ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                    <Image
                      src={senderImage}
                      alt={isSentByCurrentUser ? "You" : "Other"}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 object-cover rounded-full border border-gray-200 flex-shrink-0"
                    />
                    <div className={`rounded-lg max-w-[75%] md:max-w-[60%] ${msg?.bidPrice
                      ? "bg-gray-100 border border-gray-200 p-3"
                      : isSentByCurrentUser
                        ? "bg-black text-white p-3"
                        : "bg-white border border-gray-200 text-black p-3"
                      }`}>
                      {msg.message && (
                        <p className={`text-sm ${isSentByCurrentUser && !msg?.bidPrice ? "text-white" : "text-black"}`}>
                          {msg?.message}
                        </p>
                      )}
                      {/* Show time for all messages */}
                      {msg.createdAt && (
                        <p className={`text-[10px] mt-1.5 ${isSentByCurrentUser && !msg?.bidPrice ? "text-gray-300" : "text-gray-500"}`}>
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      )}
                      {/* Only show images for regular chat, not Affaredoro chat */}
                      {!isAffaredoroChat && msg.image && (
                        <div className="mt-2 rounded-md overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${msg.image}` || `/imageLogo2.jpg`}
                            className="rounded-md max-h-40 w-auto"
                            alt="Message Image"
                            width={225}
                            height={99}
                            unoptimized
                          />
                        </div>
                      )}
                      {/* Only show bid price for regular chat, not Affaredoro chat */}
                      {!isAffaredoroChat && msg.bidPrice && (
                        <div className="mt-3 flex flex-col gap-2">
                          <p className="text-xs font-semibold text-black flex items-center gap-1">
                            offer:
                            <Image
                              src={`/dirhamlogo.png`}
                              alt="dirham"
                              width={15}
                              height={15}
                              unoptimized
                            />
                            {msg.bidPrice}
                          </p>

                          {/* Bid Status: Accepted */}
                          {msg.bidStatus === "Accepted" ? (
                            // Only show Buy Now if current user is the original offer sender (buyer)
                            msg.userId?._id === loggedInUser ? (
                              <button
                                onClick={() => {
                                  if (newChat?.reserved || selectedChat?.productId?.[0]?.reserved) {
                                    toast.error("This product is reserved");
                                    return;
                                  }
                                  handleBuyNow(msg._id);
                                }}
                                disabled={newChat?.reserved || selectedChat?.productId?.[0]?.reserved}
                                className={`text-xs px-4 py-2 rounded-md w-fit transition-colors ${(newChat?.reserved || selectedChat?.productId?.[0]?.reserved)
                                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                  : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                                  }`}>
                                Buy Now
                              </button>
                            ) : (
                              <p className="text-xs text-black font-medium">Offer is Accepted</p> // for seller
                            )
                          ) : msg.bidStatus === "Decline" ? (
                            // Show Rejected status to everyone
                            <p className="text-xs text-black font-medium">Offer is Declined</p>
                          ) : isSentByCurrentUser ? (
                            // Pending view for buyer
                            <p className="text-xs text-gray-400 text-right">{msg.bidStatus || "Pending"}</p>
                          ) : (
                            // Show Accept/Reject buttons to seller
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOfferAccept(msg._id, msg.bidPrice)}
                                className="text-xs px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleOfferReject(msg._id)}
                                className="text-xs px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
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
              });
            })()
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No messages yet.</p>
            </div>
          )}
          <div ref={messagesEndRef} className="pb-2" />
        </div>

        {/* Image Upload */}
        {selectedChat && image.length > 0 && (
          <div className="flex gap-2 p-3 border-t border-gray-200 bg-white">
            {image.map((img, index) => (
              <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(img))}
                />
                <button
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={14} className="text-black" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* message input - 70px */}
        {selectedChat && (
          <div className="bg-white border-t border-gray-200 flex items-center gap-2 px-3 h-[70px]">
            {/* Hidden Image Input */}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            {/* Camera Icon - Hide for Affaredoro chat */}
            {selectedChat?._id !== 'affaredoro' && (
              <button
                className="text-gray-600 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => fileInputRef.current?.click()}
                disabled={message.trim().length > 0}
              >
                <Camera size={20} className="cursor-pointer shrink-0" />
              </button>
            )}

            {/* Text Input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedChat?._id === 'affaredoro' ? "Message Affaredoro support..." : "Write a message here"}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm text-black placeholder-gray-400 disabled:opacity-50"
              disabled={image.length > 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (message.trim() || (image.length > 0 && selectedChat?._id !== 'affaredoro'))) {
                  e.preventDefault();
                  handleMessageSend();
                }
              }}
            />

            {/* Send Button */}
            <button
              onClick={handleMessageSend}
              disabled={!message.trim() && (image.length === 0 || selectedChat?._id === 'affaredoro')}
              className="bg-black text-white p-2.5 rounded-lg transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={20} className="shrink-0" />
            </button>
          </div>
        )}

        {/* Carousel Modal */}
        <Modal open={showOffer} onClose={() => setShowOffer(false)}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg shadow-lg w-[90%] md:w-[52%] max-w-lg h-[200px] overflow-hidden">
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