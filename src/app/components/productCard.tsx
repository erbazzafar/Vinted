"use client";
import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, color } from "framer-motion"
import { toast } from "sonner"
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Category {
  _id: string;
  name: string;
  subCategoryCount: number;
}


const ProductCard = () => {

  const id = Cookies.get("userId")

  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState<any>("");
  const [price, setPrice] = useState<any>("");
  const [description, setDescription] = useState<any>("")

  const [packageSize, setPackageSize] = useState<{ name: string, description: string, _id: string }[]>([])
  const [selectedPackageSize, setSelectedPackageSize] = useState<any>("")
  const [isPackageSizeOpen, setIsPackageSizeOpen] = useState(false)
  const [selectedPackageSizeId, setSelectedPackageSizeId] = useState("")

  const [isUpload, setIsUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [quality, setQuality] = useState<{ name: string, description: string }[]>([]);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQualityId, setSelectedQualityId] = useState("")

  const [path, setPath] = useState<Category[]>([]);
  const [currentOptions, setCurrentOptions] = useState<Category[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [categoryIdsPath, setCategoryIdsPath] = useState<string[]>([])

  const [brand, setBrand] = useState<{ name: string, _id: string }[]>([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("")

  {/*Brand Fetching API Call */ }
  useEffect(() => {
    const fetchingBrand = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand/viewAll`
        )
        if (response.status !== 200) {
          toast.error("Unable to fetch brands list right now")
          return
        }

        console.log("Response from Brand: ", response);
        const brandData = response.data.data.map((brand: { name: string, _id: string }) => ({
          name: brand.name,
          _id: brand._id,
        }));
        setBrand(brandData)

      } catch (error) {
        console.log("Error Fetching the Brands");
        return
      }
    }

    fetchingBrand()
  }, [])

  {/*Package Size Fetching API Call */ }
  useEffect(() => {
    const fetchingPackageSize = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/packageSize/viewAll`
        )
        if (response.status !== 200) {
          toast.error("Unable to fetch package size list right now")
          return
        }

        console.log("Response from Package Size: ", response);
        const packageSizeList = response.data.data.map((item: { name: string; subTitle: string, _id: string }) => ({
          name: item.name,
          _id: item._id,
          description: item.subTitle,
        }));

        setPackageSize(packageSizeList)

      } catch (error) {
        console.log("Error Fetching the Package Sizes");
        return
      }
    }

    fetchingPackageSize()
  }, [])

  {/*Product Quality Fetching API Call */ }
  useEffect(() => {
    const fetchingProductQuality = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/condition/viewAll`
        );
        if (response.status !== 200) {
          toast.error("Unable to fetch Product Quality list right now");
          return;
        }

        console.log("Response from Product Quality: ", response);

        // Now mapping name and subTitle as description
        const productQualityList = response.data.data.map((item: { name: string; subTitle: string, _id: string }) => ({
          name: item.name,
          description: item.subTitle,
          _id: item._id
        }));

        setQuality(productQualityList);
      } catch (error) {
        console.log("Error Fetching the Product Quality");
        toast.error("Something went wrong while fetching product quality");
      }
    };

    fetchingProductQuality();
  }, []);

  {/*Category Fetching API Call*/ }
  const fetchCategories = async (parentId = "") => {
    setIsLoading(true);
    try {
      const url = parentId
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll?parentCategoryId=${parentId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll`;

      const response = await axios.get(url);

      if (response.status !== 200) {
        toast.error("Failed to fetch categories");
        return;
      }

      const categoryList = response.data.data.map((category: Category) => ({
        _id: category._id,
        name: category.name,
        subCategoryCount: category.subCategoryCount || 0,
      }));

      setCurrentOptions(categoryList);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (category: Category) => {
    const newPath = [...path, category];
    const newCategoryIdPath = [...categoryIdsPath, category._id]
    setCategoryIdsPath(newCategoryIdPath)
    setPath(newPath);
    setIsLoading(true)


    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll?parentCategoryId=${category._id}`
    );

    if (response.status === 200 && response.data.data.length > 0) {
      const nextLevel = response.data.data.map((child: any) => ({
        _id: child._id,
        name: child.name,
        subCategoryCount: child.subCategoryCount || 0,
      }));
      setCurrentOptions(nextLevel);
    } else {
      // Final category selected
      setCurrentOptions([]);
      setIsCategoryOpen(false);
      toast.success(`Selected Category: ${newPath.map((c) => c.name).join(" / ")}`);
    }
    setIsLoading(false);
  };

  const handleGoBack = () => {
    const newPath = [...path];
    const newCategoryIdPath = [...categoryIdsPath]
    newCategoryIdPath.pop()
    newPath.pop();
    setPath(newPath);

    if (newPath.length > 0) {
      fetchCategories(newPath[newPath.length - 1]._id);
    } else {
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  {/*Product Size Fetching API Call */ }
  const parentId = path[path.length - 1]?._id || ""
  const [size, setSize] = useState<{ name: string, description: string, _id: string }[]>([])
  const [selectedSize, setSelectedSize] = useState("")
  const [isSizeOpen, setIsSizeOpen] = useState(false)
  const [selectedSizeId, setSelectedSizeId] = useState("")

  useEffect(() => {
    console.log("parentId: ", parentId);
    const fetchSizes = async () => {
      try {
        if (!parentId) {
          console.log("Select Category first to fetch Sizes")
          return;
        } // Don't fetch if no parentId
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/size/viewAll?categoryId=${parentId}`,
        );

        console.log("Response from Sizes: ", response.status);


        if (response.status !== 200) {
          toast.error("Unable to fetch Sizes right now")
          return
        }

        console.log("Response from Sizes: ", response);
        const sizeList = response.data.data.map((productSize: { name: string, _id: string }) => ({
          name: productSize.name,
          _id: productSize._id
        }))
        setSize(sizeList)

      } catch (error) {
        console.log("Error in Fetching the Sizes: ", error);
        toast.error("Error in Fetching the Sizes")
        return
      }
    }
    fetchSizes()
  }, [parentId, currentOptions])

  const handleSizeSelect = (productSize: { name: string, _id: string }) => {
    setSelectedSize(productSize.name);
    setSelectedSizeId(productSize._id)
    setIsSizeOpen(false);
  }


  {/* Material Selection Logic */ }
  const [material, setMaterial] = useState<{ name: string, _id: string }[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<{ name: string, _id: string }[]>([]);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/material/viewAll`);
        if (response.status !== 200) {
          toast.error("Failed to fetch colors");
          return;
        }

        const materialList = response.data.data.map((item: { name: string, _id: string }) => ({
          name: item.name,
          _id: item._id,
        }))
        setMaterial(materialList);
      } catch (err) {
        console.error("Error fetching colors", err);
        toast.error("Error fetching colors");
      }
    };

    fetchMaterials();
  }, []);

  const handleMaterialSelect = (material: { name: string; _id: string }) => {
    if (selectedMaterial.some((m) => m._id === material._id)) {
      // If the material is already selected, remove it
      setSelectedMaterial((prev) => prev.filter((m) => m._id !== material._id));
    } else {
      // If the material isn't selected and you don't exceed the limit
      if (selectedMaterial.length >= 3) {
        toast.error("You can select only up to 3 materials");
        return;
      }
      setSelectedMaterial((prev) => [...prev, material]);
    }
  };

  const handleRemoveMaterial = (material: { name: string, _id: string }) => {
    setSelectedMaterial((prev) => prev.filter((m) => m._id !== material._id));
  };

  {/* Color Selection Logic */ }
  const [colors, setColors] = useState<{ name: string, _id: string }[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string, _id: string }[]>([]);
  const [isColorOpen, setIsColorOpen] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/color/viewAll`);
        if (response.status !== 200) {
          toast.error("Failed to fetch colors");
          return;
        }

        const colorList = response.data.data.map((item: { name: string, _id: string }) => ({
          name: item.name,
          _id: item._id
        }))
        setColors(colorList);
      } catch (err) {
        console.error("Error fetching colors", err);
        toast.error("Error fetching colors");
      }
    };

    fetchColors();
  }, []);

  const handleColorSelect = (color: { name: string, _id: string }) => {
    if (selectedColors.some((c) => c._id === color._id)) {
      setSelectedColors((prev) => prev.filter((c) => c._id !== color._id));
    } else {
      if (selectedColors.length >= 2) {
        toast.error("You can select only up to 2 colors");
        return;
      }
      setSelectedColors((prev) => [...prev, color]);
    }
  };

  const handleRemoveColor = (color: { name: string, _id: string }) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color));
  };

  const handlePackageSize = (pSize: { name: string; description: string, _id: string }) => {
    setSelectedPackageSize(pSize.name)
    setSelectedPackageSizeId(pSize._id)
    setIsPackageSizeOpen(false);
  }

  console.log("Selected Package Size: ", selectedPackageSizeId);


  const handleQualitySelect = (quality: { name: string; description: string, _id: string }) => {
    setSelectedQuality(quality.name);
    setSelectedQualityId(quality._id)
    setIsOpen(false);
  }

  const handleBrandSelect = (brand: { name: string, _id: string }) => {
    setSelectedBrand(brand.name);
    setSelectedBrandId(brand._id)
    setIsBrandOpen(false);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = [...images]; // Clone the current image state array
      for (let i = 0; i < files.length; i++) {
        if (newImages.length < 15) {
          newImages.push(files[i]); // Push each selected file to the array
        } else {
          toast.error("You can upload up to 15 images only.");
          break;
        }
      }
      setImages(newImages); // Update the state with the new array of images
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index); // Remove the image at the given index
    setImages(updatedImages); // Update the state with the new images array
  };

  const handleUploadProduct = async () => {
    try {
      if (!title || !description || !price || !brand || !color || !material || !size || !path) {
        toast.error("Please fill all the fields.");
        return;
      }
      //@ts-ignore
      if (price < 0) {
        toast.error("Price cannot be less than 0, Enter a New Price")
        setPrice("")
        return
      }

      if (images.length < 1) {
        toast.error("Please upload minimum of 1 Product Picture.");
        return
      }

      if (images.length > 15) {
        toast.error("You can upload a maximum of 15 images.");
        return;
      }

      if (!selectedPackageSizeId) {
        toast.error("Please select a package size.");
        return;
      }

      // 🟢 Convert Data to FormData
      const formData = new FormData();
      formData.append("name", title);
      formData.append("price", price);
      formData.append("description", description)
      formData.append("brandId", selectedBrandId);
      formData.append("packageSizeId", selectedPackageSizeId);
      formData.append("conditionId", selectedQualityId);
      formData.append("sizeId", selectedSizeId);
      formData.append("userId", id || "")

      // 🔹 Append array values
      formData.append("categoryId", parentId); // Send the category ID path as a JSON string
      selectedColors.map((color) => {
        formData.append("colorId", color._id); // Append each selected color ID
      })

      // formData.append("colorId", selectedColors.map((color) => color._id));
      //@ts-ignore
      selectedMaterial.map((mat) => {
        formData.append("materialId", mat._id)
      })
      // formData.append("materialId", selectedMaterial.map((mat) => mat._id));


      // 🔹 Append images as files
      images.forEach((image) => {
        formData.append("image", image); // Make sure `image` is a File object
      });

      // 🟢 Make PUT request with FormData
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        toast.error("Error uploading product, please try again later.");
        return;
      }

      setIsUpload(true);
      setTimeout(() => {
        setIsUpload(false);
        setImages([]);
        setTitle("");
        setSelectedQuality("");
        setSelectedBrand("");
        setSelectedPackageSize("");
        setSelectedSize("")
        setIsSizeOpen(false)
        setPath([]);
        setIsOpen(false);
        setIsBrandOpen(false);
        setQuality([]);
        setSelectedQuality("");
        setSelectedBrand("");
        setPackageSize([]);
        setPrice("");
        setDescription("");
        setSelectedColors([]);
        setSelectedMaterial([]);
        setIsMaterialOpen(false);
        setIsColorOpen(false);
        setIsUpload(false);
        setIsPackageSizeOpen(false);

        toast.success("Product uploaded successfully!");
      }, 1000);


    } catch (error) {
      toast.error("Error uploading product, please try again later.");
      console.log("Error uploading product: ", error);
      return
    }

  };

  const [showCarousel, setShowCarousel] = useState(false);
  const dummyImages = [
    `/comp2.jpg`,
    `/comp3.jpg`,
    `/comp4.PNG`,
    `/comp5.PNG`,
  ]


  return (

    <div className="relative max-w-4xl mx-auto shadow-lg rounded-lg bg-white p-6 mb-15">
      {/* Image Upload */}
      <div className="relative w-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-lg p-5 ">
        <p className="text-gray-600 text-[11px] mb-3 font-medium">
          Upload Product Images LIMIT: 15
          <span
            onClick={() => setShowCarousel(true)}
            className="ml-2 text-blue-500 underline cursor-pointer text-[11px]"
          >
            See photo TIPS
          </span>
        </p>
        {/* Tips Modal */}
        <Modal open={showCarousel} onClose={() => setShowCarousel(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[500px] max-w-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Photo Hints</h2>
              <button onClick={() => setShowCarousel(false)} className="cursor-pointer text-gray-500 hover:text-red-500 text-xl font-bold">
                &times;
              </button>
            </div>

            {/* Tip Text */}
            <p className="text-gray-600 text-sm mb-3">
              📸 Take photos in a well-lit area. Bright daylight is best.
            </p>

            {/* Carousel */}
            <Carousel
              responsive={{
                all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
              }}
              infinite
              autoPlay={false}
              keyBoardControl
              showDots
              arrows
            >
              {dummyImages.map((image, index) => (
                <div key={index} className="w-full h-[250px] flex justify-center items-center">
                  <Image
                    src={image}
                    alt={`Product ${index}`}
                    width={350}
                    height={250}
                    unoptimized
                    className="rounded-lg object-contain max-h-[250px]"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </Modal>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full">
          {images.map((img, index) => (
            <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
              <Image
                src={URL.createObjectURL(img)} // Create an object URL for preview
                alt="Product"
                height={24}
                width={24}
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

        {/* Product Category */}
        <div className="p-4">
          <label className="block text-gray-600 font-medium mb-1">Category</label>
          <div
            className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="text-gray-700">
              {path.length ? path.map((p) => p.name).join(" / ") : "Select Category"}
            </span>
            {isCategoryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`w-full p-2 border rounded-lg bg-white mt-2 ${currentOptions.length > 6 ? 'max-h-60 overflow-y-auto' : ''}`}

              >
                {path.length > 0 && (
                  <motion.div
                    className="cursor-pointer p-2 hover:bg-gray-100 font-medium flex items-center gap-1"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                  </motion.div>
                )}

                {isLoading ? (
                  <p className="text-gray-500 text-center"> Loading ... </p>
                ) : (
                  currentOptions.map((category) => (
                    <motion.div
                      key={category._id}
                      className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <strong>{category.name}</strong>
                      {category.subCategoryCount > 0 && <ArrowRight size={18} />}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Color Selection */}
        <div className="p-4">
          <label className="block text-gray-600 font-medium mb-1">Product Colors</label>

          <div
            className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center"
            onClick={() => setIsColorOpen(!isColorOpen)}
          >
            <span className="text-gray-700">
              {selectedColors.length ? selectedColors.map((color) => color.name).join(", ") : "Select up to 2 colors"}
            </span>
            {isColorOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          <AnimatePresence>
            {isColorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`w-full p-2 border rounded-lg bg-white mt-2 ${colors.length > 6 ? 'max-h-60 overflow-y-auto' : ''}`}
              >
                {colors.map((color) => (
                  <motion.div
                    key={color._id}
                    className={`p-2 hover:bg-gray-100 flex justify-between items-center ${selectedColors.some((c) => c._id === color._id)
                      ? "text-blue-600 font-semibold"
                      : "cursor-pointer"
                      }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color.name}
                    {selectedColors.some((c) => c._id === color._id) && <span className="text-xs">✓</span>}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show selected color tags */}
          {selectedColors.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedColors.map((color) => (
                <div
                  key={color._id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {color.name}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => handleRemoveColor(color)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Material Selection */}
        <div className="p-4">
          <label className="block text-gray-600 font-medium mb-1">Product Material</label>

          <div
            className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center"
            onClick={() => setIsMaterialOpen(!isMaterialOpen)}
          >
            <span className="text-gray-700">
              {selectedMaterial.length
                ? selectedMaterial.map((m) => m.name).join(", ")
                : "Select up to 3 Materials"}
            </span>
            {isMaterialOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          <AnimatePresence>
            {isMaterialOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`w-full p-2 border rounded-lg bg-white mt-2 ${material.length > 6 ? 'max-h-60 overflow-y-auto' : ''}`}
              >
                {material.map((m) => (
                  <motion.div
                    key={m._id}
                    className={`p-2 hover:bg-gray-100 flex justify-between items-center ${selectedMaterial.some((sm) => sm._id === m._id)
                      ? "text-blue-600 font-semibold"
                      : "cursor-pointer"
                      }`}
                    onClick={() => handleMaterialSelect(m)}
                  >
                    {m.name}
                    {selectedMaterial.some((sm) => sm._id === m._id) && <span className="text-xs">✓</span>}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show selected Material tags */}
          {selectedMaterial.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedMaterial.map((m) => (
                <div
                  key={m._id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {m.name}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => handleRemoveMaterial(m)}
                  />
                </div>
              ))}
            </div>
          )}
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
                {quality.map((q: any) => (
                  <motion.div
                    key={q.name}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleQualitySelect(q)}
                  >
                    <strong>{q.name}</strong>
                    <p className="text-sm text-gray-600">{q.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brands Name */}
        <div className="p-4">
          <label className="block text-gray-600 font-medium mb-1">Brand</label>
          <div
            className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-gray-300"
            onClick={() => setIsBrandOpen(!isBrandOpen)}
          >
            <span className="text-gray-700">
              {selectedBrand || "Select Brand"}
            </span>
            {isBrandOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <AnimatePresence>
            {isBrandOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`w-full p-2 border rounded-lg bg-white mt-2 ${brand.length > 6 ? 'max-h-60 overflow-y-auto' : ''}`}
              >
                {brand.map((brandName, index) => (
                  <motion.div
                    key={`${brandName}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleBrandSelect(brandName)}
                  >
                    <strong>{brandName.name}</strong>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product size list */}
        <div className="p-4">
          <label className="block text-gray-600 font-medium mb-1">Product Size</label>
          <div
            className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-gray-300"
            onClick={() => setIsSizeOpen(!isSizeOpen)}
          >
            <span className="text-gray-700">
              {selectedSize || "Select Product Size"}
            </span>
            {isSizeOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <AnimatePresence>
            {isSizeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full p-2 border rounded-lg bg-white mt-2"
              >
                {size.map((productSize, index) => (
                  <motion.div
                    key={`${productSize.name}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleSizeSelect(productSize)}
                  >
                    <strong>{productSize.name}</strong>
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
              {selectedPackageSize || "Select Size"}
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
                {packageSize.map((size) => (
                  <motion.div
                    key={size._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handlePackageSize(size)}
                  >
                    <strong>{size.name}</strong>
                    <p className="text-sm text-gray-600">{size.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Price */}
        <div className="p-4  rounded-lg ">
          <label className="block text-gray-600 font-medium mb-1">Product Price</label>
          <input
            type="text"
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
