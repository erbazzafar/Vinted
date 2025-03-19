"use client";
import { useState, useRef } from "react";
import { UploadCloud, X, ChevronDown, ChevronUp } from "lucide-react";
import CategorySelector from "./categorySelectorInSell";
import {motion, AnimatePresence} from "framer-motion"
import { toast } from "sonner"

const ProductCard = () => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [packageSize, setPackageSize] = useState("")
  const [isPackageSizeOpen, setIsPackageSizeOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [isUpload, setIsUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qualities = {
    "New with tags": "A brand new unused item with tags attached or in the original packaging.",
    "New without Tags": "A brand new, unused item without tags or original packaging.",
    "Very good": "A lightly used item that may have slight imperfections but still looks great. Include photos and a description of any flaws in your listing.",
    "Good": "A used item that may show imperfections and signs of wear. Include photos and a description of flaws in your listing.",
    "Satisfactory": "A frequently used item with imperfections and signs of wear. Include photos and a description of flaws in your listing."
  };

  const packageSizes = {
    "Small": "For items that'd fit in a Large Envelope.",
    "Medium": "For items that'd fit in a Shoe Box.",
    "Large": "For items that'd fit in a Moving Box",
  }

  const handlePackageSize = (pSize) => {
    setPackageSize(pSize)
    setIsPackageSizeOpen(false);
  }

  const handleSelect = (quality) => {
    setSelectedQuality(quality);
    setIsOpen(false);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        if (newImages.length < 15) {
          const reader = new FileReader();
          reader.onload = () => {
            newImages.push(reader.result as string);
            setImages([...newImages]);
          };
          reader.readAsDataURL(files[i]);
        } else {
          toast.error("You can upload up to 15 images only.");
          break;
        }
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUploadProduct = () => {
    if (!title || !price || !images || !description || !packageSize) {
      toast.error("Please fill all the fields.");
      return;
    }
    if (images.length < 1) {
      toast.error("Please upload minimum of 1 Product Picture."); 
      return
    }
    setIsUpload(true);
    setTimeout(() => {
      setIsUpload(false);
      setImages([]);
      setTitle("");
      setSelectedQuality("");
      setPackageSize("")
      setPrice("");
      setDescription("")
      toast.success("Product uploaded successfully!");
    }, 1000);
  };

  return (
    <div className="relative max-w-4xl mx-auto shadow-lg rounded-lg bg-white p-6 mb-15">
      {/* Image Upload */}
      <div className="relative w-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-lg p-5 ">
        <p className="text-gray-600 text-sm mb-3 font-medium">Upload Product Images LIMIT: 15</p>
        
        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full">
          {images.map((img, index) => (
            <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
              <img
                src={img}
                alt="Product"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                className="absolute top-1 right-1 bg-gray-100 text-black rounded-full p-1 shadow-md hover:bg-gray-200 transition duration-200 cursor-pointer"
                onClick={() => handleRemoveImage(index)}
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {/* Upload New Image */}
          {images.length < 15 && (
            <div
              className="w-full h-24 flex flex-col items-center justify-center border border-gray-300 rounded-lg cursor-pointer bg-white shadow-md hover:bg-gray-200 transition duration-300 relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={32} className="text-gray-500" />
              <p className="text-gray-500 text-xs mt-1">+ {15 - images.length}</p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>

      {/* Product Details */}
      <div className="mt-8 space-y-4">
        {/* Product Title */}
        <div className="p-4 ">
          <label className="block text-gray-600 font-medium mb-1">Product Title</label>
          <input
            type="text"
            placeholder="Enter product title"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

         {/* Product Description */}
         <div className="p-4 ">
          <label className="block text-gray-600 font-medium mb-1">Product Description</label>
          <textarea
            placeholder="Enter product Description"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Product Quality */}

        <div className="p-4">
        <label className="block text-gray-600 font-medium mb-1">Product Quality</label>
        <div 
          className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-700">
            {selectedQuality || "Select Quality"}
          </span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full p-2 border rounded-lg bg-white mt-2"
            >
              {Object.entries(qualities).map(([quality, description]) => (
                <motion.div
                  key={quality}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => handleSelect(quality)}
                >
                  <strong>{quality}</strong>
                  <p className="text-sm text-gray-600">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Package Size */}

      <div className="p-4">
        <label className="block text-gray-600 font-medium mb-1">Package Size</label>
        <div 
          className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-gray-300"
          onClick={() => setIsPackageSizeOpen(!isPackageSizeOpen)}
        >
          <span className="text-gray-700">
            {packageSize || "Select Size"}
          </span>
          {isPackageSizeOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        <AnimatePresence>
          {isPackageSizeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full p-2 border rounded-lg bg-white mt-2"
            >
              {Object.entries(packageSizes).map(([pSize, description]) => (
                <motion.div
                  key={pSize}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => handlePackageSize(pSize)}
                >
                  <strong>{pSize}</strong>
                  <p className="text-sm text-gray-600">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/* Product Category */}
        <div className="p-4 ">
          <label className="block text-gray-600 font-medium mb-1">Product Category</label>
          <CategorySelector />
        </div>

        {/* Product Price */}
        <div className="p-4  rounded-lg ">
          <label className="block text-gray-600 font-medium mb-1">Product Price</label>
          <input
            type="number"
            placeholder="Enter product price"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUploadProduct}
        className="text-xl mt-6 w-full bg-gray-800 text-white py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 cursor-pointer"
      >
        {isUpload ? "Uploading..." : "Upload Product"}
      </button>
    </div>
  );
};

export default ProductCard;
