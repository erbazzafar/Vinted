"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function ImagesSliderDemo() {
  // For demonstration, using the same image three times
  const images = [
    // "/slider1.jpg",
    // "/st.jpg",
    // "/banner-2.jpg",
    // "/banner-4.jpg",
    // "/banner-5.jpg",
    // "/banner-6.jpg",
    "/new_banner_1.jpeg",
    "/new_banner_2.jpeg",
    "/new_banner_3.jpeg",
  ];

  // Create a reference to the slider
  const [sliderRef, setSliderRef] = useState(null);

  useEffect(() => {
    // Auto slide to next image every 4 seconds
    const interval = setInterval(() => {
      if (sliderRef) {
        sliderRef.slickNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderRef]);

  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false, // We're handling autoplay manually with our interval
    fade: false, // Disable fade to get the slide effect
    cssEase: "ease",
    className: "w-full h-[200px] sm:h-[400px] md:h-[500px] lg:h-[600px]",
    dotsClass: "slick-dots custom-dots",
    customPaging: () => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white/50 hover:bg-white/80"></div>
    ),
    // Custom arrow components
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
  };

  return (
    <div className="bg-white m-auto sm:w-full mt-3.5 mx-3 sm:mx-0 sm:mt-6 md:mt-8">
      {/* Full-width slider container matching the navbar */}
      <div className="container mx-auto max-w-screen-2xl lg:px-[50px] relative z-0">
        <div className="w-full overflow-hidden rounded-[13px]">
          <Slider ref={setSliderRef} {...settings}>
            {images.map((src, index) => (
              <div key={index} className="outline-none">
                <div className="w-full h-[200px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                  <Image
                    src={src}
                    alt={`Slider Image ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover max-h-full rounded-[13px]"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Add custom styles for Slick */}
      <style jsx global>{`
        .slick-list, .slick-track, .slick-slide, .slick-slide > div {
          height: 100%;
        }
        
        .slick-prev, .slick-next {
          z-index: 10;
        }
        
        .slick-dots {
          bottom: 10px;
        }
        
        .custom-dots li button:before {
          display: none;
        }
        
        .custom-dots li.slick-active div {
          background-color: rgba(255, 255, 255, 1);
        }
      `}</style>
    </div>
  );
}

// Custom arrow components
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 focus:outline-none"
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 focus:outline-none"
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  );
};