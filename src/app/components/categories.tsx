"use client";

import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const maxDesktopCategories = 14;

const responsive = {
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 8,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 4,
    slidesToSlide: 1,
  },
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll`
        );

        if (response.status !== 200) {
          toast.error("Error fetching the categories");
          return;
        }

        setCategories(response.data.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
        toast.error("Error fetching the categories");
      }
    };

    fetchingCategories();
  }, []);

  return (
    <div className="bg-white lg:py-4 sm:mt-0 md:mt-6rounded-b-lg max-w-screen-2xl mx-auto">
      {/* Desktop View */}
      <div className="hidden lg:flex justify-center gap-6">
        {categories.slice(0, maxDesktopCategories).map((category, index) => {
          const imageSrc = category.image
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${category.image}`
            : `/istockphoto-1222357475-612x612.jpg`;

          return (
            <Link
              key={index}
              href={`/filter?id=${category._id}`}
              className="flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900 transition"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-[#EAEAEA] rounded-full">
                <Image
                  src={imageSrc}
                  alt={category.name}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[13px] font-medium">{category.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile & Tablet View */}
      <div className="lg:hidden px-2">
        <Carousel
          key={categories.length}
          responsive={responsive}
          infinite={false}
          autoPlay={false}
          keyBoardControl
          arrows
          showDots={false}
          partialVisible={false}
          itemClass="px-2"
          containerClass="carousel-container overflow-visible"
          renderButtonGroupOutside={false}
          removeArrowOnDeviceType={[]} // ✅ Keep arrows on all devices
        >
          {categories.map((category, index) => {
            const imageSrc = category.image
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${category.image}`
              : `/istockphoto-1222357475-612x612.jpg`;

            return (
              <Link
                key={index}
                href={`/filter?id=${category._id}`}
                className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-[#EAEAEA] rounded-full">
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-[13px] font-medium text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default Categories;