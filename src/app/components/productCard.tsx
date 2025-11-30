"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { UploadCloud, X, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence, color } from "framer-motion"
import { toast } from "sonner"
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSearchParams, useRouter } from "next/navigation";
import ProductTipsModal from "./productTipsModal";

interface Category {
  _id: string;
  name: string;
  subCategoryCount: number;
}


const ProductCard = () => {

  const router = useRouter()

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

  const searchParam = useSearchParams()
  const productId = searchParam.get('id')

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

    await conditionRendering(category._id)
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

  {/*Bump Days Fetching API Call */}
  useEffect(() => {
    const getBump = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bump/viewAll`);

        if (response.status !== 200) {
          toast.error("Error fetching the bump prices");
          return;
        }

        setBumpDays(response.data.data);
      } catch (error) {
        console.log("Error fetching the Bump Prices", error);
        toast.error("Error fetching the Bump Prices");
      }
    };

    getBump();
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

        const mappedMaterials = response.data.data
          .map((item: { name: string, _id: string }) => ({
            name: item.name,
            _id: item._id,
          }))

        const notListed = mappedMaterials.find((m: { name: string }) => m.name.toLowerCase() === "not listed")
        const otherMaterials = mappedMaterials
          .filter((m: { name: string }) => m.name.toLowerCase() !== "not listed")
          .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

        const materialList = notListed ? [notListed, ...otherMaterials] : otherMaterials
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
    setIsMaterialOpen(false); // Close the dropdown after selection
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
    setIsColorOpen(false); // Close the dropdown after selection
  };

  const handleRemoveColor = (color: { name: string, _id: string }) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color));
  };

  const handlePackageSize = (pSize: { name: string; description: string, _id: string }) => {
    setSelectedPackageSize(pSize.name)
    setSelectedPackageSizeId(pSize._id)
    setIsPackageSizeOpen(false);
  }

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

  // useEffect(() => {
  //   const getProductToUpdate = async () => {
  //     try {
  //       if (!productId) {
  //         return
  //       }
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${Cookies.get("user-token")}`
  //           }
  //         }
  //       )

  //       if (response.status !== 200) {
  //         toast.error("Error in fetching the Product to Edit")
  //         return
  //       }

  //       console.log("getProductToUpdate ==> ", response);
  //       const toBeUpdatedProduct = response.data.data;
  //       setBrand(toBeUpdatedProduct.brandId.name)
  //       setTitle(toBeUpdatedProduct.name)
  //       setDescription(toBeUpdatedProduct.description)
  //       setPrice(toBeUpdatedProduct.price)
  //       setImages(toBeUpdatedProduct.image)
  //       setColors(toBeUpdatedProduct.colorId.map(color => color.name))
  //       setCategoryIdsPath(toBeUpdatedProduct.categoryId.map(category => category.name))
  //       setPackageSize(toBeUpdatedProduct.packageSizeId.name)
  //       setMaterial(toBeUpdatedProduct.materialId.map(material => material.name))
  //       setQuality(toBeUpdatedProduct.conditionId.name)
  //       setSize(toBeUpdatedProduct.sizeId.name)

  //     } catch (error) {
  //       console.log("Error Editing the Product Details", error);
  //       toast.error("Error Updating the Product")
  //       return
  //     }
  //   }
  //   getProductToUpdate()
  // }, [productId])

  console.log("Parent ID: ", parentId)

  const [condtionFlags, setConditionFlags] = useState({
    hasBrand: false,
    hasSize: false,
    hasCondition: false,
    hasColor: false,
    hasMaterial: false
  })

  const conditionRendering = async (categoryId: string) => {
    try {
      if (!categoryId) {
        console.log("A category is not selected");
        return
      }

      console.log("Final Category Id: ", categoryId);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get/${categoryId}`
      )
      if (response.status !== 200) {
        toast.error("The category not found")
        return
      }

      const allConditions = response.data.data

      setConditionFlags(prev => ({
        ...prev,
        hasBrand: allConditions.hasBrand,
        hasColor: allConditions.hasColor,
        hasCondition: allConditions.hasCondition,
        hasMaterial: allConditions.hasMaterial,
        hasSize: allConditions.hasSize
      }))

    } catch (error) {
      console.log("Error fetching the conditions", error);
      return

    }
  }

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

      if (condtionFlags.hasSize && !selectedSizeId) {
        toast.error("Please select a size.");
        return;
      }
      if (condtionFlags.hasBrand && !selectedBrandId) {
        toast.error("Please select a brand.");
        return;
      }
      if (condtionFlags.hasMaterial && selectedMaterial.length < 1) {
        toast.error("Please select a material.");
        return;
      }
      if (condtionFlags.hasColor && selectedColors.length < 1) {
        toast.error("Please select a color.");
        return;
      }

      if (condtionFlags.hasCondition && !selectedQualityId) {
        toast.error("Please select a quality.");
        return;
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

      // Set loading state at the start of API call
      setIsUpload(true);

      // 🟢 Convert Data to FormData
      const formData = new FormData();
      formData.append("name", title);
      formData.append("price", price);
      formData.append("description", description)
      if (condtionFlags.hasBrand) {
        formData.append("brandId", selectedBrandId);
      }
      formData.append("packageSizeId", selectedPackageSizeId);
      if (condtionFlags.hasCondition) {
        formData.append("conditionId", selectedQualityId);
      }
      if (condtionFlags.hasSize) {
        formData.append("sizeId", selectedSizeId);
      }

      formData.append("userId", id || "")

      // 🔹 Append array values
      formData.append("categoryId", parentId); // Send the category ID path as a JSON string
      if (condtionFlags.hasColor) {
        selectedColors.map((color) => {
          formData.append("colorId", color._id); // Append each selected color ID
        })
      }

      // formData.append("colorId", selectedColors.map((color) => color._id));
      //@ts-ignore
      if (condtionFlags.hasMaterial) {
        selectedMaterial.map((mat) => {
          formData.append("materialId", mat._id)
        })
      }
      // formData.append("materialId", selectedMaterial.map((mat) => mat._id));


      // 🔹 Append images as files
      images.forEach((image) => {
        formData.append("image", image); // Make sure `image` is a File object
      });

      // 🟢 Make PUT request with FormData
      let response = null
      if (!productId) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("user-token")}`,
            },
          }
        )
      } else {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${productId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("user-token")}`,
            },
          })
      }

      if (response.status !== 200) {
        setIsUpload(false);
        toast.error("Error uploading product, please try again later.");
        return;
      }

      const newProductId = response.data?.data?._id || null;
      
      // If it's a new product and user wants to bump, open bump modal
      if (!productId && wantToBump && newProductId) {
        setCreatedProductId(newProductId);
        setIsUpload(false);
        setIsBumpModalOpen(true);
        // Don't clear form or redirect yet - wait for bump selection
        return;
      }

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
        setIsPackageSizeOpen(false);
        setWantToBump(false);
        setCreatedProductId(null);

        toast.success("Product uploaded successfully!");
      }, 1000);

      router.push(`/seller/${id}`)


    } catch (error) {
      setIsUpload(false);
      toast.error("Error uploading product, please try again later.");
      console.log("Error uploading product: ", error);
      return
    }

  };

  const [showCarousel, setShowCarousel] = useState(false);

  const [searchBrand, setSearchBrand] = useState("");

  // Bump functionality states
  const [wantToBump, setWantToBump] = useState(false);
  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);
  const [bumpDays, setBumpDays] = useState<Array<{ _id: string; day: string; percentage: string }>>([]);
  const [selectedBumpDays, setSelectedBumpDays] = useState<{ _id: string; day: string; percentage: string } | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const handleBump = async (selectedDays: string) => {
    if (!createdProductId) {
      toast.error("Product ID not found");
      return;
    }
    localStorage.setItem("bumpDays", selectedDays);
    localStorage.setItem("percentage", selectedBumpDays?.percentage || "");
    
    // Clear form and redirect
    setImages([]);
    setTitle("");
    setSelectedQuality("");
    setSelectedBrand("");
    setSelectedPackageSize("");
    setSelectedSize("");
    setIsSizeOpen(false);
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
    setIsPackageSizeOpen(false);
    setWantToBump(false);
    setCreatedProductId(null);
    
    router.push(`/bump?id=${createdProductId}`);
  };

  const filteredSortedBrands = useMemo(() => {
    const filtered = brand.filter((b) => b.name.toLowerCase().includes(searchBrand.toLowerCase()));

    // Separate "Not Listed" from other brands
    const notListed = filtered.find((b) => b.name.toLowerCase() === "not listed");
    const otherBrands = filtered.filter((b) => b.name.toLowerCase() !== "not listed");

    // Sort other brands alphabetically
    const sortedOtherBrands = otherBrands.sort((a, b) => a.name.localeCompare(b.name));

    // Return "Not Listed" first, then alphabetically sorted brands
    return notListed ? [notListed, ...sortedOtherBrands] : sortedOtherBrands;
  }, [brand, searchBrand]);


  return (

    <div className="relative max-w-4xl mx-auto shadow-lg rounded-lg bg-white my-[10px] pb-4 sm:p-6 mb-15">
      {/* Image Upload */}
      <div className="relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-lg p-5 mx-4">
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
        <ProductTipsModal
          open={showCarousel}
          onClose={() => setShowCarousel(false)}
        />

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full">
          {images.map((img, index) => (
            <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md">
              <Image
                src={URL.createObjectURL(img)} // Create an object URL for preview
                alt="Product"
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover rounded-lg"
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
              className="w-full aspect-square flex flex-col items-center justify-center border border-gray-300 rounded-lg cursor-pointer bg-white shadow-md hover:bg-gray-200 transition duration-300 relative"
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
      <div className="mt-[15px] sm:mt-[30px] space-y-1">
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

        {/* Authenticity Note */}
        <div className="mx-4 mb-2 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-amber-800">Note:</span>{" "}
            If you select a <b>designer category</b> and the product price is above <b>600 AED</b>, the <b>authenticity verification</b> will be applied. Please ensure your product images are <b>clear</b> and detailed as described in the <b>photo tips</b>, so they can be easily authenticated by our experts.
          </p>
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
        {condtionFlags.hasColor && (
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
        )}

        {/* Material Selection */}
        {condtionFlags.hasMaterial && (
          <div className="p-4">
            <label className="block text-gray-600 font-medium mb-1">Product Material</label>

            <div
              className="w-full p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center"
              onClick={() => setIsMaterialOpen(!isMaterialOpen)}
            >
              <span className="text-gray-700 capitalize">
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
                      className={`capitalize p-2 hover:bg-gray-100 flex justify-between items-center ${selectedMaterial.some((sm) => sm._id === m._id)
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
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 capitalize"
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
        )}


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
                {quality.map((q: any, i: number) => {
                  if (!condtionFlags.hasCondition && i > 0) return;
                  return (
                    <motion.div
                      key={q.name}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleQualitySelect(q)}
                    >
                      <strong>{q.name}</strong>
                      <p className="text-sm text-gray-600">{q.description}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brands Name */}
        {condtionFlags.hasBrand && (
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
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search brand..."
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    className="w-full mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />

                  {/* Filtered and Sorted Brands */}
                  {filteredSortedBrands.map((brandName, index) => (
                    <motion.div
                      key={`${brandName.name}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleBrandSelect(brandName)}
                    >
                      <strong className="capitalize">{brandName.name}</strong>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {/* Product size list */}
        {condtionFlags.hasSize && (
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
        )}

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
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Image
                src="/dirhamlogo.png"
                alt="AED"
                width={20}
                height={20}
                unoptimized
                className="object-contain"
              />
            </div>
            <input
              type="text"
              placeholder="Enter product price"
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bump Checkbox - Only show when creating new product */}
      {!productId && (
        <div className="mx-[15px] mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={wantToBump}
              onChange={(e) => setWantToBump(e.target.checked)}
              className="w-5 h-5 text-gray-800 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
            />
            <span className="text-gray-700 font-medium">
              Boost product visibility with bump (optional)
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-2 ml-8">
            Select a bump duration after product upload to increase visibility. A small fee applies.
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUploadProduct}
        disabled={isUpload}
        className={`text-xl my-4 mx-[15px] px-[15px] bg-gray-800 text-white py-3 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 ${isUpload
          ? "opacity-70 cursor-not-allowed"
          : "hover:bg-gray-600 cursor-pointer"
          }`}
      >
        {isUpload && <Loader2 className="animate-spin" size={20} />}
        {isUpload ? (productId ? "Updating..." : "Uploading...") : (productId ? "Update Product" : "Upload Product")}
      </button>

      {/* Bump Modal */}
      <Modal open={isBumpModalOpen} onClose={() => setIsBumpModalOpen(false)}>
        <Box className="bg-white rounded-lg shadow-lg w-full max-w-[560px] max-h-[75vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900">Boost your product visibility</h2>
              <p className="text-[12px] text-gray-600 mt-1">Choose a bump duration. The fee is a small percentage of your price.</p>
            </div>
            <button
              aria-label="Close"
              className="cursor-pointer text-gray-500 hover:text-gray-800"
              onClick={() => setIsBumpModalOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(bumpDays) && bumpDays?.map((option) => {
                const isSelected = selectedBumpDays?.day === option.day;
                const basePrice = Number(price || 0);
                const fee = ((Number(option.percentage) / 100) * basePrice);
                return (
                  <button
                    key={option._id}
                    className={`cursor-pointer text-left rounded-lg border transition-colors duration-200 px-4 py-3 focus:outline-none ${isSelected ? "border-gray-900 bg-gray-100" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                    onClick={() => setSelectedBumpDays(option)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-gray-900">{option.day} days</p>
                        <p className="text-[12px] text-gray-600 mt-1">Fee {Number(option.percentage).toFixed(0)}%</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-[14px] font-semibold text-gray-900">
                          <Image src="/dirhamlogo.png" alt="dirham" height={16} width={16} unoptimized />
                          <span>{fee.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Bump fee</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary: show only selected bump price */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Bump price</h3>
              <div className="flex items-center justify-between text-[13px] text-gray-700">
                <span>{selectedBumpDays ? `${selectedBumpDays.day}-day bump (${Number(selectedBumpDays.percentage).toFixed(0)}%)` : "Select a bump duration"}</span>
                <div className="flex items-center gap-1 text-gray-900 font-medium">
                  <Image src="/dirhamlogo.png" alt="dirham" height={16} width={16} unoptimized />
                  <span>{selectedBumpDays ? ((Number(selectedBumpDays.percentage) / 100) * Number(price || 0)).toFixed(2) : "—"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                className="cursor-pointer bg-gray-200 text-[13px] text-gray-900 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => {
                  setIsBumpModalOpen(false);
                  setSelectedBumpDays(null);
                  // Clear form and redirect to seller page
                  setImages([]);
                  setTitle("");
                  setSelectedQuality("");
                  setSelectedBrand("");
                  setSelectedPackageSize("");
                  setSelectedSize("");
                  setIsSizeOpen(false);
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
                  setIsPackageSizeOpen(false);
                  setWantToBump(false);
                  setCreatedProductId(null);
                  router.push(`/seller/${id}`);
                }}
              >
                Skip
              </button>
              <button
                disabled={!selectedBumpDays}
                className={`cursor-pointer text-[13px] px-4 py-2 rounded ${!selectedBumpDays ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                onClick={async () => {
                  if (!selectedBumpDays) return;
                  await handleBump(selectedBumpDays.day);
                  setIsBumpModalOpen(false);
                }}
              >
                {selectedBumpDays ? `Confirm ${selectedBumpDays.day}-day Bump` : "Select a duration"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductCard;
