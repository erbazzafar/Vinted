"use client";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { User, Laptop, Shirt, Dumbbell, Book, Gamepad2, Sparkles, Car, HeartPulse, Smartphone, Shapes, Footprints, Watch, UtensilsCrossed, Headphones } from "lucide-react";

// Categories Data
export const categoriesList = [
  { name: "Men", icon: User },
  { name: "Clothing", icon: Shirt },
  { name: "Kitchen", icon: UtensilsCrossed },
  { name: "Sports", icon: Dumbbell },
  { name: "Books", icon: Book },
  { name: "Toys", icon: Gamepad2 },
  { name: "Beauty", icon: Sparkles },
  { name: "Automotive", icon: Car },
  { name: "Health", icon: HeartPulse },
  { name: "Gadgets", icon: Headphones },
  { name: "Laptops", icon: Laptop },
  { name: "Smartphones", icon: Smartphone },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Watches", icon: Watch },
  { name: "Shoes", icon: Footprints },
  { name: "Drones", icon: Shapes }, // 16th category (will not show on desktop)
];

// Max categories displayed on desktop
const maxDesktopCategories = 14;

// Responsive Breakpoints for Carousel
const responsive = {
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 8, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 4, slidesToSlide: 1 },
};

const Categories: React.FC = () => {
  return (
    <div className="bg-white py-4 rounded-b-lg max-w-screen-2xl mx-auto">
      {/* Desktop View: Show up to 15 categories in a single row (no carousel, no arrows) */}
      <div className="hidden lg:flex justify-center gap-6">
        {categoriesList.slice(0, maxDesktopCategories).map((category, index) => {
          const Icon = category.icon;
          return (
            <Link
              key={index}
              href={`/filter/`}
              className="flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900 transition"
            >
              <div className="w-22 h-22 flex items-center justify-center bg-[#EAEAEA] rounded-full">
                <Icon className="w-8 h-8 text-black" />
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
          {categoriesList.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                href={`/filter/`}
                className="flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900 transition"
              >
                <div className="w-22 h-22 flex items-center justify-center bg-[#EAEAEA] rounded-full">
                  <Icon className="w-8 h-8 text-black" />
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
