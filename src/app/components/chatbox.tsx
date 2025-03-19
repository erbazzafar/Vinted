import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  type: "message" | "offer";
  offerPrice?: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  profilePic?: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  afterTaxPrice?: number;
}

const product: Product = {
  id: 1,
  title: "The Atelier Tailored Boot",
  price: 29.5,
  image: "/pexels-boot.jpg",
  afterTaxPrice: 32.45,
};

const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [counterOffer, setCounterOffer] = useState(false);
  
  const [offerPrice, setOfferPrice] = useState("");
  
  const [message, setMessage] = useState("");

  const [acceptedOffer, setAcceptedOffer] = useState(false);
  
  const [users] = useState<User[]>([
    { id: 1, name: "John Doe", profilePic: "/pexels-alljos-1261422.jpg" },
    { id: 2, name: "Alice Smith", profilePic: "/pexels-kowalievska-1127000.jpg" },
  ]);
  
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);

  const router = useRouter();

  const handleMessageSend = () => {
    if (!message.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      type: "message",
      userId: selectedUser.id,
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleOfferSubmit = () => {
    if (!offerPrice.trim()) return;
    const newOffer: Message = {
      id: messages.length + 1,
      text: `Offer: $${offerPrice}`,
      type: "offer",
      offerPrice,
      userId: selectedUser.id,
    };
    setMessages([...messages, newOffer]);
    setCounterOffer(false);
    setOfferPrice("");
  };

  const filteredMessages = messages.filter((msg) => msg.userId === selectedUser.id);

  

  return (
    <div>
    <div 
        className="flex w-full max-w-6xl mx-auto bg-white border rounded-xl shadow-md mt-15">
      {/* Sidebar */}
      <div 
        className="w-1/4 bg-white text-gray-800 p-4 rounded-l-xl border-r-2 ">
        <h2 
            className="text-lg font-bold mb-4 border-b-2">Inbox </h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-md mb-2 transition ${
                selectedUser?.id === user.id ? "bg-gray-300" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                className="w-8 h-8 object-cover rounded-full"
                src={user.profilePic || "/default-avatar.png"}
                alt={user.name}
              />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox */}
      <div className="w-3/4 p-4">
        {/* Chat Header */}
        <h2    
            className="text-lg border-b-2 font-semibold text-gray-800 mb-4 text-center"> {selectedUser.name}</h2>

        {/* Product Details */}
        <div 
            className="flex justify-between items-center border-b pb-2">
          <div 
            className="flex items-center gap-3">
            <img className="w-16 h-16 object-cover rounded-lg" src={product.image} alt={product.title} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-600 text-sm">${product.price}</p>
              <p className="text-teal-800 text-sm">
                ${product.afterTaxPrice} <span className="text-teal-800"> incl. of Tax</span>
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
            filteredMessages.map((msg) => {
            const user = users.find((u) => u.id === msg.userId);

            return (
                <div key={msg.id} className="flex items-start gap-3">
                {/* User Profile Picture (Outside Message Bubble) */}
                <img
                    className="w-10 h-10 object-cover rounded-full"
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.name}
                />

                {/* Message Content */}
                <div
                    className={`p-3 rounded-lg border max-w-[75%] ${
                    msg.type === "offer"
                        ? "bg-gray-100 text-gray-800 font-semibold"
                        : "bg-gray-200"
                    }`}
                >
                    <p>{msg.text}</p>

                    {msg.type === "offer"  && (
                    <div className="mt-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { 
                          router.push(`/check-out/${product.id}`);
                          setAcceptedOffer(true);
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
    </div>
  );
};

export default Chatbox;
