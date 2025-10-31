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
            authorization: `Bearer ${Cookies.get("user-token")}`,
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
    <div className="group shadow-md relative w-full max-w-[250px] overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:border-yellow-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Link href={`/product/${product._id}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
            alt={product.name}
            height={240}
            width={320}
            unoptimized
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Wishlist */}
        <button
          aria-label="wishlist"
          className={`absolute right-2 top-2 z-10 rounded-full border border-gray-200 bg-white/90 p-2 shadow-sm transition-colors ${isWishlisted ? "text-red-600" : "text-gray-700 hover:text-red-500"}`}
          onClick={() => handleWishList()}
        >
          <Heart size={16} fill={isWishlisted ? "red" : "none"} />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-2 p-3">
        <Link
          href={`/product/${product._id}`}
          className="line-clamp-2 text-[13px] font-semibold capitalize text-gray-800 hover:text-teal-700"
        >
          {product.name}
        </Link>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
            {product?.sizeId?.name || "Size: Other"}
          </span>
          {product.categoryId?.[product.categoryId?.length - 1]?.name ? (
            <span className="rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-700">
              {product.categoryId[product.categoryId.length - 1].name}
            </span>
          ) : null}
        </div>

        {/* Price */}
        <div className="mt-1 flex items-center gap-1 text-[14px] font-semibold text-yellow-600">
          <Image
            src={`/dirhamlogo.png`}
            alt="dirham"
            width={16}
            height={16}
            unoptimized
          />
          <span>{Number(product.price).toFixed(2)}</span>
        </div>
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
  useEffect(() => {
    getSellerProducts();
  }, []);

  return (
    <div className="lg:px-[50px] px-1 max-w-screen-2xl mx-auto ">
      {Array.isArray(products) && products.length > 0 ? (
        <>
          {/* Display "Featured Products" heading */}
          <h2 className="mt-2 mb-6 text-3xl rounded-xl font-bold">Featured Products</h2>

          {/* Carousel for the products */}
          <div className="mt-6 mb-10">
            <Carousel
              responsive={responsive}
              infinite
              autoPlay={true}
              keyBoardControl
              showDots={false}
              arrows={false}
              customButtonGroup={<ButtonGroup />}
              containerClass="carousel-container overflow-hidden"
              itemClass="p-1 gap-x-4"
            >
              {/* Map products to carousel items */}
              {products.slice(0, 11).map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
            </Carousel>
          </div>
        </>
      ) : null}
    </div>
  );
};


export default ProductCarousel;
