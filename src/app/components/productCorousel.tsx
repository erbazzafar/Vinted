"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

// Responsive settings for the carousel
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
  desktop: { breakpoint: { max: 1030, min: 768 }, items: 4 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

// Function to generate star ratings
const getStarRating = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="text-yellow-500 text-lg">
      {"★".repeat(fullStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </span>
  );
};

// Product Card Component
const ProductCard = ({ product }: { product: any }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishList = async () => {
    if (!product._id) return;
  
    // Optimistic UI update: set the new like state before API call
    setIsWishlisted(prevState => !prevState);
  
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/toggleLike`,
        { productId: product._id, userId: Cookies.get("userId") },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
  
      if (response.status !== 200) {
        toast.error("Error adding to wishlist");
        return;
      }
  
      // If successful, show success message and update the state accordingly
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error adding to wishlist");
      console.error("Error adding to wishlist", error);
    }
  };

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId && Array.isArray(product.like)) {
      // Ensure the `like` field is populated and valid
      const filteredLikes = product.like.filter((id: string | null) => id);
      if (filteredLikes.includes(userId)) {
        setIsWishlisted(true);
      } else {
        setIsWishlisted(false);
      }
    }
  }, [product]);

  return (
    <div className="bg-white py-2 shadow-md rounded-xl overflow-hidden w-full max-w-[250px] mx-auto">
      <div className="relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product?.image?.[0]}`}
          alt={product?.name}
          height={250}
          width={300}
          unoptimized
          className="w-full h-[200px] object-contain rounded-lg"
        />
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center">
          <Link
            href={`/product/${product._id}`}
            className="ml-2 text-[13px] font-semibold text-gray-800 hover:underline"
          >
            {product?.name}
          </Link>
          <button
            className={`mr-3 transition-colors cursor-pointer ${
              isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            onClick={() => handleWishList()}
          >
            <Heart size={20} fill={isWishlisted ? "red" : "none"} />
          </button>
        </div>

        <div className="ml-2 flex items-center gap-1 mt-1">{getStarRating(product?.rating)}</div>
        <p className="ml-2 text-[12px] text-gray-500">Size: {product?.sizeId?.name || "None"}</p>
        <p className="ml-2 text-[12px] text-gray-500">Category: {product?.categoryId?.[product?.categoryId?.length-1]?.name ?? "N/A"}</p>
        <p className="mt-1 ml-2 text-[12px] font-semibold text-teal-600">
          ${product?.inclPrice} <span className="text-xs text-gray-400">incl.</span>
        </p>
      </div>
    </div>
  );
};

//Custom Button Group
const ButtonGroup = ({ next, previous }: any) => {
  return (
    <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
      <button
        className="cursor-pointer bg-gray-300 text-white p-2 rounded-full hover:bg-gray-700 pointer-events-auto"
        onClick={previous}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="cursor-pointer bg-gray-300 text-white p-2 rounded-full hover:bg-gray-700 pointer-events-auto"
        onClick={next}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};


// Product Carousel Component
const ProductCarousel = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getSellerProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/getRecomend`
        );

        if (response.status !== 200) {
          toast.error("Cannot find any products");
          return;
        }

        setProducts(response.data.data);
      } catch (error) {
        toast.error("Error fetching the products");
        console.error("Error fetching the products", error);
      }
    };

    getSellerProducts();
  }, []);

  return (
    <div className="lg:px-[50px] px-1 py-10 max-w-screen-2xl mx-auto">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay={true}
        keyBoardControl
        showDots={false}
        arrows={false}
        customButtonGroup={<ButtonGroup />}
        containerClass="carousel-container overflow-hidden"
        itemClass="p-2 gap-x-4"
      >
        {products.slice(0,11).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Carousel>
    </div>
  );
};


export default ProductCarousel;
