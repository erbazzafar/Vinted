import React from "react";
import Link from "next/link";

const WhatsappFloatButton = () => {
  const phoneNumber = "+971506570211"; // Change to your WhatsApp number
  const message = "Hi, Welcome to Affare Doro!"; // Change this too
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 animate-bounce"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <path d="M12.04 2.003a10 10 0 0 0-8.768 14.748L2 22l5.368-1.26A10 10 0 1 0 12.04 2.003Zm.007 2.004a8 8 0 0 1 0 16h-.008a7.953 7.953 0 0 1-4.083-1.12l-.292-.175-3.173.745.747-3.092-.189-.31a8 8 0 0 1 6.998-12.048Zm4.606 10.3c-.063-.1-.23-.163-.48-.287-.252-.125-1.487-.733-1.717-.817-.23-.085-.398-.125-.565.124-.165.25-.647.816-.794.982-.145.166-.29.187-.54.062-.252-.125-1.063-.39-2.023-1.24-.747-.667-1.252-1.49-1.4-1.74-.145-.25-.015-.385.11-.51.114-.114.252-.292.38-.438.127-.145.17-.25.253-.415.085-.166.043-.312-.02-.437-.062-.125-.564-1.362-.773-1.87-.2-.48-.402-.41-.565-.42l-.48-.01c-.166 0-.438.063-.668.312-.23.25-.89.867-.89 2.115 0 1.247.91 2.455 1.036 2.623.125.166 1.79 2.87 4.445 4.02.622.27 1.107.43 1.485.55.624.198 1.19.17 1.64.104.5-.075 1.487-.61 1.7-1.198.208-.583.208-1.082.146-1.198Z" />
      </svg>
    </Link>
  );
};

export default WhatsappFloatButton;