"use client"
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast } from 'sonner'
import Image from 'next/image'
import AddNewCardModal from './bumpPayment'
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { log } from 'console'

interface Bump {
    bump: boolean,
    bumpDays: string
    percentage: string,
    bumpDate: string
}

interface Product {
    _id: string,
    name: string,
    price: number,
    image: string
}

function BumpCheckOut() {


    const now = new Date()
    const currentDate = now.toISOString()

    const [bumpInformation, setBumpInformation] = useState<Bump>({
        bump: false,
        bumpDays: "",
        percentage: "",
        bumpDate: "",
    })

    const [product, setProduct] = useState<Product>()

    const [isLoading, setIsLoading] = useState(false)
    const [bumpData, setBumpData] = useState<any>(null)

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

    const searchParams = useSearchParams()
    const productId = searchParams.get('id')

    useEffect(() => {
        try {
            const bumpDays = localStorage.getItem("bumpDays")
            const bumpPercentage = localStorage.getItem("percentage")
            setIsLoading(true)

            if (bumpDays) {
                const parsedDays = JSON.parse(bumpDays)
                setBumpInformation(prev => ({
                    ...prev,
                    bumpDays: parsedDays
                }))
            }

            if (bumpPercentage) {
                const parsedPercentage = JSON.parse(bumpPercentage)
                setBumpInformation(prev => ({
                    ...prev,
                    percentage: parsedPercentage
                }))
            }
        } catch (error) {
            console.log("Error Bumping the pRoduct", error);
            return
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const productForBump = async () => {
            try {
                if (!productId || !Cookies.get("user-token")) {
                    return
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`
                )
                if (response.status !== 200) {
                    toast.error("Error fetching the Product, try again later")
                    return
                }

                setProduct(response.data.data)

            } catch (error) {
                console.log("Product not found", error)
                return
            }
        }

        productForBump()
    }, [productId])

    const handleBumpPayment = () => {
        try {
            const formData = new FormData();
            formData.append("bump", "true");
            formData.append("bumpDay", String(bumpInformation.bumpDays));
            formData.append("bumpDate", currentDate);

            setBumpData(formData);
        } catch (error) {
            console.log("Bump info missing", error);
            toast.error("Bump information Missing");
            return;
        }
    };

    const bumpPrice = product && bumpInformation.percentage
        ? (product.price * parseFloat(bumpInformation.percentage)) / 100
        : 0

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 rounded-xl shadow-sm bg-gray-100">
                <h2 className="text-xl font-bold mb-4 text-center">Bump Summary</h2>

                <div className="flex flex-col items-center mb-4">
                    {product?.image?.[0] && (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
                            alt={product?.name || "Product Image"}
                            width={300}
                            height={180}
                            unoptimized
                            className="w-full h-[200px] object-contain rounded-md mb-3"
                        />
                    )}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{product?.name}</h3>
                        <p className="mt-1 text-md font-semibold text-teal-600 flex items-center justify-center gap-1">
                            <Image
                                src={`/dirhamlogo.png`}
                                alt="dirham"
                                width={18}
                                height={18}
                                unoptimized
                            />
                            {bumpPrice.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <button
                        onClick={() => {
                            if (Cookies.get("user-token")) {
                                handleBumpPayment()
                                setIsPaymentModalOpen(true)
                            }
                        }}
                        className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition"
                    >
                        Proceed to Payment
                    </button>
                </div>

                <Modal open={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
                    <Box className="bg-white p-6 rounded-lg shadow-lg w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <AddNewCardModal formData={bumpData} productId={productId} />
                    </Box>
                </Modal>
            </div>
        </div>
    )
}

export default BumpCheckOut
