import { useState } from "react";

// Sample product data
const products = [
  { id: 1, name: "Nike Hoodie", category: "Hoodies", subCategory: "Zip-up", image: "/hoodie1.jpg" },
  { id: 2, name: "Adidas Sweater", category: "Sweaters", subCategory: "Crew Neck", image: "/sweater1.jpg" },
  { id: 3, name: "Puma Jacket", category: "Hoodies", subCategory: "Pull-over", image: "/hoodie2.jpg" },
  { id: 4, name: "Uniqlo Sweatshirt", category: "Sweaters", subCategory: "V-neck", image: "/sweater2.jpg" },
];

const categories = ["Hoodies", "Sweaters"];
const subCategories = {
  Hoodies: ["Zip-up", "Pull-over"],
  Sweaters: ["Crew Neck", "V-neck"],
};

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Filter products dynamically
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory ? product.category === selectedCategory : true) &&
      (selectedSubCategory ? product.subCategory === selectedSubCategory : true)
  );

  return (
    <div className="container mx-auto max-w-screen-xl p-6">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-4">
        <span className="hover:text-gray-800 cursor-pointer">Home</span> / 
        <span className="hover:text-gray-800 cursor-pointer"> Clothing</span> / 
        <span className="text-black font-semibold"> {selectedCategory || "All Products"} </span>
      </nav>

      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Products</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 flex-wrap mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="border px-4 py-2 rounded w-48"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory(""); // Reset subcategory when category changes
            }}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && subCategories[selectedCategory] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              className="border px-4 py-2 rounded w-48"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">All</option>
              {subCategories[selectedCategory].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear Filters Button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setSelectedCategory("");
            setSelectedSubCategory("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="mt-2 font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm">{product.category} - {product.subCategory}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
