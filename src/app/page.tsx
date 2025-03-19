"use client";
import Categories from "./components/categories";
import LensDemo from "./components/lensDemo";
import { ImagesSliderDemo } from "./components/slider";
import ProductCarousel from "./components/productCorousel";

export default function Home() {
  return (
    <>
      <ImagesSliderDemo/>
      <br />
      <Categories/>
      <br />
      <h2 className="mt-5 text-3xl container mx-auto max-w-screen-2xl rounded-xl font-bold"> Most Popular Products </h2>
      <br/>
      <LensDemo/>
      <br />
      <ProductCarousel/>
    </>
  );
}
