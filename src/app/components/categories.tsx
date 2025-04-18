"use client";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  name: string
  image: string
}

// Max categories displayed on desktop
const maxDesktopCategories = 14;

// Responsive Breakpoints for Carousel
const responsive = {
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 8, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 4, slidesToSlide: 1 },
};

const Categories: React.FC = () => {

  const [categories, setCategories] = useState<Category []>([])

  useEffect ( () => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll`
        )
        
        if (response.status !== 200) {
          toast.error ('Error fetching the categories')
          return
        }
        
        console.log("Response from fetching categories:", response)
        setCategories(response.data.data)

      } catch (error) {
        console.log("Error fetching categories:", error);
        toast.error ('Error fetching the categories')
        return
      }
    }
    fetchingCategories()
  }, [])

  return (
    <div className="bg-white py-4 rounded-b-lg max-w-screen-2xl mx-auto">
      {/* Desktop View: Show up to 15 categories in a single row (no carousel, no arrows) */}
      <div className="hidden lg:flex justify-center gap-6">
        {categories.slice(0, maxDesktopCategories).map((category, index) => {
          const imageSrc = category.image
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${category.image}`
            : `/istockphoto-1222357475-612x612.jpg`;

          return (
            <Link
              key={index}
              href={`/filter/`}
              className="flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900 transition"
            >
              <div className="w-22 h-22 flex items-center justify-center bg-[#EAEAEA] rounded-full">
                <Image
                  src={imageSrc}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Tablet & Mobile: Always use carousel */}
      <div className="lg:hidden">
        <Carousel
          responsive={responsive}
          infinite={false}
          autoPlay={false}
          keyBoardControl
          arrows
          showDots={false}
          containerClass="carousel-container overflow-hidden"
          itemClass="p-2"
        >
          {categories.map((category, index) => {
            const imageSrc = category.image
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${category.image}`
            : `/istockphoto-1222357475-612x612.jpg`;

            return (
              <Link
                key={index}
                href={`/filter/`}
                className="flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900 transition"
              >
                <div className="w-22 h-22 flex items-center justify-center bg-[#EAEAEA] rounded-full">
                <Image
                  src={imageSrc}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 text-black"
                />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default Categories;
