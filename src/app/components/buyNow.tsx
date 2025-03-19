"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { products } from "./lensDemo";


const BuyNow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p) => p.id === Number(id));
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10 text-xl">Product not found.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-md"
        />

        {/* Product Details */}
        <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
        <p className="text-gray-600 mt-2">{product.description || "No description available."}</p>
        <p className="text-lg font-semibold mt-2">Price: Rs {product.price}</p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            className="px-4 py-2 bg-gray-300 rounded-md text-lg"
          >
            -
          </button>
          <span className="text-xl font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-300 rounded-md text-lg"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <p className="text-xl font-bold mt-4">
          Total: Rs {product.price * quantity}
        </p>

        {/* Buy Now Button */}
        <button className="w-full bg-blue-600 text-white mt-4 py-3 rounded-md text-lg hover:bg-blue-700 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default BuyNow;
