"use client";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Image from "next/image";

interface ProductTipsModalProps {
    open: boolean;
    onClose: () => void;
}

const ProductTipsModal = ({ open, onClose }: ProductTipsModalProps) => {
    const [selectedItemType, setSelectedItemType] = useState("Bag");

    const itemTypes = [
        "Bag",
        "Sneakers",
        "Other Shoes",
        "Wallet",
        "Clothing",
        "Jewelry",
        "Accessory",
        "Glasses",
        "Watch"
    ];

    // Mapping for second tip based on item type
    const secondTipMapping: { [key: string]: string } = {
        "Bag": "Include photos of all the available labels",
        "Sneakers": "Use a hairdryer if the insole is stuck inside the shoe",
        "Other Shoes": "Verify whether your pair has a removable insole",
        "Wallet": "Include photos of all the available logos",
        "Clothing": "Include photos of all the available labels",
        "Jewelry": "Include all the available engravings",
        "Accessory": "Include all the available engravings",
        "Glasses": "Include all the available engravings",
        "Watch": "Include all the available engravings"
    };

    // Mapping for third tip based on item type
    const thirdTipMapping: { [key: string]: string } = {
        "Bag": "Take clearest possible photos of the series code",
        "Sneakers": "Focus the camera on the area under the insole",
        "Other Shoes": "Focus the camera on the logo and size stamps",
        "Wallet": "Take clearest possible photos of the series code",
        "Clothing": "Take photos of all labels' pages",
        "Jewelry": "Take clearest possible photos of the stamps",
        "Accessory": "Take macro quality photos of the mechanical details and stamps",
        "Glasses": "Take clearest possible photos of the stamps",
        "Watch": "Take clearest possible photos of the stamps"
    };

    // Get tips based on selected item type
    const getTips = () => {
        return [
            "Take close-up and focused photos in natural light", // First tip is always same
            secondTipMapping[selectedItemType] || "Include photos of all the available labels", // Second tip is dynamic
            thirdTipMapping[selectedItemType] || "Take clearest possible photos of the series code", // Third tip is dynamic
        ];
    };

    const handleItemTypeSelect = (itemType: string) => {
        setSelectedItemType(itemType);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="bg-white rounded-2xl shadow-2xl w-[95%] md:w-[900px] max-w-5xl max-h-[90vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Product Tips</h2>
                        <button
                            onClick={onClose}
                            className="cursor-pointer text-gray-500 hover:text-red-500 text-2xl font-bold"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Main Content - Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mb-[10px]">
                        {/* Left Side - Item Type Selector */}
                        <div className="space-y-4">
                            <label className="block text-amber-950 font-semibold text-lg">
                                Choose Your Item Type
                            </label>
                            <div className="space-y-1.5 max-h-[130px] overflow-y-auto">
                                {itemTypes.map((itemType) => (
                                    <label
                                        key={itemType}
                                        className={`flex items-center`}
                                    >
                                        <input
                                            type="radio"
                                            name="itemType"
                                            value={itemType}
                                            checked={selectedItemType === itemType}
                                            onChange={() => handleItemTypeSelect(itemType)}
                                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium text-sm cursor-pointer">{itemType}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Tips */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-amber-950">
                                Tips on how to speed up authentication
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {getTips().map((tip, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 max-h-[300px] border border-amber-950 rounded-lg p-4 flex-1"
                                    >
                                        <p className="text-black text-sm flex justify-center items-center w-full h-full text-center min-w-[100px]">
                                            {tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Explanation Image */}
                    <div className="w-full mt-[5px]">
                        {selectedItemType === 'Bag' && (
                            <Image unoptimized draggable={false} src="/bag_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Sneakers' && (
                            <Image unoptimized draggable={false} src="/sneakers_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Other Shoes' && (
                            <Image unoptimized draggable={false} src="/other_shoes_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Wallet' && (
                            <Image unoptimized draggable={false} src="/wallet_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Clothing' && (
                            <Image unoptimized draggable={false} src="/clothing_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Jewelry' && (
                            <Image unoptimized draggable={false} src="/jewelry_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Accessory' && (
                            <Image unoptimized draggable={false} src="/accessory_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Glasses' && (
                            <Image unoptimized draggable={false} src="/glasses_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                        {selectedItemType === 'Watch' && (
                            <Image unoptimized draggable={false} src="/watch_select.png" alt='' width={100} height={100} className='w-full h-full object-contain' />
                        )}
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ProductTipsModal;

