"use client";

import ProductCard from "./productCard";


const products = [
  {
    image: "https://source.unsplash.com/400x300/?shoes",
    title: "Nike Air Sneakers",
    quality: "Premium",
    price: "99.99",
  },
  {
    image: "https://source.unsplash.com/400x300/?watch",
    title: "Luxury Watch",
    quality: "High-End",
    price: "249.99",
  },
  {
    image: "https://source.unsplash.com/400x300/?headphones",
    title: "Wireless Headphones",
    quality: "Studio Quality",
    price: "79.99",
  },
  {
    image: "https://source.unsplash.com/400x300/?laptop",
    title: "MacBook Pro",
    quality: "Best Performance",
    price: "1999.99",
  },
  {
    image: "https://source.unsplash.com/400x300/?camera",
    title: "DSLR Camera",
    quality: "Professional",
    price: "699.99",
  },
];

const ProductList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-5">
      {products.map((product, index) => (
        <ProductCard 
            key={index} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
