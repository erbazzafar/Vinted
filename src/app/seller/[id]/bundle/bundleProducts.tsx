"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const BundleProducts = () => {
    const router = useRouter();
    const { id: sellerId } = useParams();
    const searchParams = useSearchParams();
    const productIdFromUrl = searchParams.get("productId");
    const userId = Cookies.get("userId");
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [autoSelectDone, setAutoSelectDone] = useState(false);

    // Fetch seller products
    useEffect(() => {
        const getSellerProducts = async () => {
            setLoading(true);
            try {
                if (!sellerId) {
                    console.log("Seller Id not found");
                    return;
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?reserved=false&userId=${sellerId}&admin=${userId === sellerId ? true : false}`
                );

                if (response.status !== 200) {
                    toast.error("Cannot find any Products");
                    return;
                }

                console.log("Product Fetched ", response.data.data);
                setProducts(response.data.data);
            } catch (error) {
                toast.error("Error Fetching the Products");
                console.log("Error Fetching the Products", error);
            } finally {
                setLoading(false);
            }
        };

        getSellerProducts();
    }, [sellerId, userId]);

    // Auto-select product from URL parameter
    useEffect(() => {
        if (productIdFromUrl && products.length > 0 && !autoSelectDone) {
            const productToSelect = products.find((p: any) => p._id === productIdFromUrl);
            if (productToSelect) {
                setSelectedProducts([productToSelect]);
                setAutoSelectDone(true);
                // Remove productId from URL
                const url = new URL(window.location.href);
                url.searchParams.delete("productId");
                window.history.replaceState({}, "", url.toString());
            }
        }
    }, [products, productIdFromUrl, autoSelectDone]);

    // Handle product selection
    const handleProductSelect = (product: any) => {
        // Check if product is already selected
        const isSelected = selectedProducts.some((p) => p._id === product._id);

        if (isSelected) {
            toast.info("Product already added to bundle");
            return;
        }

        setSelectedProducts((prev) => [product, ...prev]);
        toast.success("Product added to bundle");
    };

    // Handle product removal from bundle
    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Product removed from bundle");
    };

    // Calculate total price
    const totalPrice = selectedProducts.reduce((sum, product) => {
        return sum + Number(product.price || 0);
    }, 0);

    // Handle Buy Now
    const handleBuyNow = () => {
        if (selectedProducts.length === 0) {
            toast.error("Please select at least one product");
            return;
        }
        
        // If only one product selected, redirect to regular checkout (like product page)
        if (selectedProducts.length === 1) {
            const singleProduct = selectedProducts[0];
            localStorage.setItem("productsInfo", JSON.stringify(singleProduct));
            router.push(`/checkout?productId=${singleProduct._id}&userId=${userId}&adminUser=${sellerId}`);
        } else {
            // Multiple products selected, redirect to bundle checkout
            localStorage.setItem("bundleProducts", JSON.stringify(selectedProducts));
            router.push(`/bundle-checkout?sellerId=${sellerId}`);
        }
    };

    return (
        <div className="mt-16 max-w-screen-2xl mx-auto lg:px-[50px] px-3 py-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Bundle Products</h1>
                {/* <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                    Back
                </button> */}
            </div>

            {/* Main Content - Desktop: Side by Side, Mobile: Stacked */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side - All Products */}
                <div className="flex-1 lg:w-2/3">
                    <h2 className="text-2xl font-semibold mb-4">All Products</h2>
                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product: any) => {
                                const isSelected = selectedProducts.some((p) => p._id === product._id);
                                return (
                                    <div
                                        key={product._id}
                                        className={`group shadow-md relative w-full overflow-hidden rounded-2xl border ${isSelected
                                            ? "border-yellow-500 bg-yellow-50"
                                            : "border-gray-100 bg-white hover:border-yellow-300"
                                            } transition-all hover:-translate-y-0.5 cursor-pointer`}
                                        onClick={() => !isSelected && handleProductSelect(product)}
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-white">
                                            <Link
                                                href={`/product/${product._id}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
                                                    alt={product.name}
                                                    height={240}
                                                    width={320}
                                                    unoptimized
                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                                                />
                                            </Link>
                                        </div>

                                        {/* Body */}
                                        <div className="space-y-2 p-3">
                                            <Link
                                                href={`/product/${product._id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="line-clamp-1 text-[14px] font-semibold capitalize text-gray-900 hover:text-black"
                                            >
                                                {product.name}
                                            </Link>

                                            {/* Size & Category chips */}
                                            {/* <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
                          {product.sizeId?.name ?? "Size: Other"}
                        </span>
                        {product.categoryId?.[product?.categoryId?.length - 1]?.name ? (
                          <span className="rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-700">
                            {product.categoryId[product.categoryId.length - 1].name}
                          </span>
                        ) : null}
                      </div> */}

                                            {/* Price */}
                                            <div className="mt-1 flex items-center gap-1 text-[14px] font-semibold text-yellow-600">
                                                <Image
                                                    src="/dirhamlogo.png"
                                                    alt="dirham"
                                                    width={16}
                                                    height={16}
                                                    unoptimized
                                                />
                                                <span>{Number(product.price).toFixed(2)}</span>
                                            </div>

                                            {/* Select Button */}
                                            {isSelected ? (
                                                <button
                                                    className="w-full mt-2 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveProduct(product._id);
                                                    }}
                                                >
                                                    Added
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full mt-2 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProductSelect(product);
                                                    }}
                                                >
                                                    Add to Bundle
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Side - Selected Products (Bottom on Mobile) */}
                <div className="lg:w-1/3 lg:sticky lg:top-6 lg:self-start">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 lg:p-6 max-h-[500px] flex flex-col">
                        <h2 className="text-2xl font-semibold mb-4 flex-shrink-0">Selected Products</h2>

                        {selectedProducts.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 flex-1 flex items-center justify-center">
                                <div>
                                    <p>No products selected</p>
                                    <p className="text-sm mt-2">Click on products to add them to your bundle</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Selected Products List - Scrollable */}
                                <div className="space-y-3 overflow-y-auto flex-1 mb-4 pr-2">
                                    {selectedProducts.map((product: any) => (
                                        <div
                                            key={product._id}
                                            className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 transition"
                                        >
                                            {/* Product Image */}
                                            <Link
                                                href={`/product/${product._id}`}
                                                className="flex-shrink-0"
                                            >
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
                                                    alt={product.name}
                                                    width={80}
                                                    height={80}
                                                    unoptimized
                                                    className="w-20 h-20 object-contain rounded"
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/product/${product._id}`}
                                                    className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-black"
                                                >
                                                    {product.name}
                                                </Link>
                                                <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-yellow-600">
                                                    <Image
                                                        src="/dirhamlogo.png"
                                                        alt="dirham"
                                                        width={12}
                                                        height={12}
                                                        unoptimized
                                                    />
                                                    <span>{Number(product.price).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveProduct(product._id)}
                                                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition cursor-pointer h-[max-content]"
                                                aria-label="Remove product"
                                            >
                                                <X size={20} className="text-gray-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Total Price - Fixed at bottom */}
                                <div className="border-t border-gray-200 pt-4 mt-4 flex-shrink-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-semibold">Total Price:</span>
                                        <span className="text-xl font-bold text-yellow-600 flex items-center gap-1">
                                            <Image
                                                src="/dirhamlogo.png"
                                                alt="dirham"
                                                width={20}
                                                height={20}
                                                unoptimized
                                            />
                                            {totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {selectedProducts.length} {selectedProducts.length === 1 ? "item" : "items"}
                                    </p>
                                    {/* Buy Now Button */}
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BundleProducts;

