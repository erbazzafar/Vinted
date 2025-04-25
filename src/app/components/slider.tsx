"use client";

import Image from "next/image";
import React from "react";

export function ImagesSliderDemo() {
  return (
    <div className="bg-white  sm:mt-15 w-[90%] m-auto sm:w-full mt-[-25px]">
      {/* Full-width slider container matching the navbar */}
      <div className="container rounded mx-auto max-w-screen-2xl lg:px-[50px]">
        <div className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px]  overflow-hidden rounded">
          <Image 
            src="/st.jpg" 
            alt="Slider Image"
            width={1920}
            height={1080}
            className="w-full h-full object-contain sm:object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
