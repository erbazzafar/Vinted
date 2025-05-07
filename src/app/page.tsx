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
      <ProductCarousel/>
      <br />
      <LensDemo/>
    </>
  );
}
