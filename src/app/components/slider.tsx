"use client";

import Image from "next/image";
import React from "react";

export function ImagesSliderDemo() {
  return (
    <div className="bg-white mt-15 w-full">
      {/* Full-width slider container matching the navbar */}
      <div className="container mx-auto max-w-screen-2xl">
        <div className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-xl">
          <img 
            src="/st.jpg" 
            alt="Slider Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
