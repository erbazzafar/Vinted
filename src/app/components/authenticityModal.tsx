"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    Elements,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, Lock } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const DIRHAM_AMOUNT = 100;
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ||
    "pk_test_51RH3dwI5tAyGjw2REiKEXU1UjR8QfdvJZyY1SOcxZS48JxJEGi8eJ84F2MVV1cjMPWuuTlI9v4LOt4xfQXqhqmP800sHniLIA9"
);

const ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: "16px",
            color: "#32325d",
            "::placeholder": { color: "#a0aec0" },
            fontFamily: "system-ui, sans-serif",
        },
        invalid: {
            color: "#fa755a",
        },
    },
    showIcon: true,
};

interface AuthenticityModalProps {
    open: boolean;
    onClose: () => void;
    productId: string;
    sellerId?: string;
    productTitle?: string;
    sellerName?: string;
    onPaymentCompleted?: () => void;
}

interface CardPaymentModalProps {
    open: boolean;
    onClose: () => void;
    productId: string;
    sellerId?: string;
    productTitle?: string;
    onSuccess: () => void;
}

const CardPaymentModal = ({
    open,
    onClose,
    productId,
    sellerId,
    productTitle,
    onSuccess,
}: CardPaymentModalProps) => {
    const content = useMemo(() => {
        if (!sellerId) {
            return (
                <div className="space-y-4 text-center">
                    <p className="text-gray-700">
                        Seller information is unavailable right now. Please close this dialog and try again.
                    </p>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            );
        }

        return (
            <Elements stripe={stripePromise}>
                <CardPaymentForm
                    onClose={onClose}
                    onSuccess={onSuccess}
                    productId={productId}
                    productTitle={productTitle}
                    sellerId={sellerId}
                />
            </Elements>
        );
    }, [onClose, onSuccess, productId, productTitle, sellerId]);

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center p-4">
            <Box className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">{content}</Box>
        </Modal>
    );
};

interface CardPaymentFormProps {
    onClose: () => void;
    onSuccess: () => void;
    productId: string;
    productTitle?: string;
    sellerId: string;
}

const CardPaymentForm = ({ onClose, onSuccess, productId, productTitle, sellerId }: CardPaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [receiptEmail, setReceiptEmail] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const storedEmail = localStorage.getItem("userEmail") || "";
        setReceiptEmail(storedEmail);
    }, []);

    const handleCreateAuthenticity = async () => {
        if (!stripe || !elements) {
            toast.error("Stripe is not ready yet.");
            return;
        }

        if (!sellerId) {
            toast.error("Seller information is missing.");
            return;
        }

        const token = Cookies.get("user-token");
        if (!token) {
            toast.error("Please log in to continue.");
            return;
        }

        const buyerId = Cookies.get("userId");

        setLoading(true);
        setError(null);

        try {
            const cardNumberElement = elements.getElement(CardNumberElement);

            if (!cardNumberElement) {
                throw new Error("Unable to find card element. Please refresh and try again.");
            }

            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: "card",
                card: cardNumberElement,
                billing_details: {
                    email: receiptEmail || undefined,
                },
            });

            if (stripeError) {
                throw stripeError;
            }

            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticity/create`,
                {
                    buyerId: buyerId || undefined,
                    productId,
                    sellerId,
                    cardId: paymentMethod?.id,
                    receiptEmail: receiptEmail || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Authenticity request submitted successfully.");
            onSuccess();
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to process payment. Please try again later.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <p className="text-lg text-black font-bold uppercase tracking-wide">Authenticity Verification</p>
                <p className="text-gray-600">
                    Enter your card details below to pay AED {DIRHAM_AMOUNT} for authenticity verification.
                </p>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    Card information
                </label>

                <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-white border-b border-gray-200">
                        <CardNumberElement options={ELEMENT_OPTIONS} className="w-full text-gray-900" />
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200 bg-white">
                            <CardExpiryElement options={ELEMENT_OPTIONS} className="w-full text-gray-900" />
                        </div>
                        <div className="flex-1 px-4 py-3 bg-white">
                            <CardCvcElement options={ELEMENT_OPTIONS} className="w-full text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <p>Your card details are encrypted & secure.</p>
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    className="cursor-pointer flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    className="cursor-pointer flex-1 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleCreateAuthenticity}
                    disabled={loading}
                >
                    {loading ? "Processing..." : `Pay AED ${DIRHAM_AMOUNT}`}
                </button>
            </div>
        </div>
    );
};

const AuthenticityModal = ({
    open,
    onClose,
    productId,
    sellerId,
    productTitle,
    sellerName,
    onPaymentCompleted,
}: AuthenticityModalProps) => {
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const handlePay = () => {
        if (!sellerId) {
            toast.error("Seller information not available. Please try again later.");
            return;
        }

        setIsCardModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsCardModalOpen(false);
        onClose();
        onPaymentCompleted?.();
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Apply for Authenticity Verification</h2>
                        <button
                            aria-label="Close"
                            className="cursor-pointer text-gray-500 hover:text-gray-800 text-2xl"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-5 space-y-4">
                        {/* Description */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                            <p className="text-[15px] text-gray-700 leading-relaxed">
                                We will verify <strong>{productTitle || "this product"}</strong> using <strong>AI analysis and expert review</strong> to confirm its authenticity.
                            </p>
                            <p className="text-[15px] text-gray-700 leading-relaxed">
                                The service costs <strong>AED 100</strong>, and the item will be <strong>reserved for you during the verification process</strong>.
                            </p>
                            <p className="text-[15px] text-gray-700 leading-relaxed">
                                Once verification is complete, you will receive the <strong>result by email</strong>.
                            </p>
                            <p className="text-[15px] text-gray-700 leading-relaxed">
                                After receiving the verification result, you can <strong>contact the seller</strong> to <strong>unlock the reservation</strong> and proceed with the purchase.
                            </p>
                        </div>

                        {/* Payment Button */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                className="cursor-pointer bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="cursor-pointer border border-black bg-white text-black px-6 py-2 rounded-lg hover:shadow-lg transition flex items-center"
                                onClick={handlePay}
                            >
                                <span className="mr-1">Pay</span>
                                <Image src="/dirhamlogo.png" alt="dirham" width={20} height={20} unoptimized />
                                <span>{DIRHAM_AMOUNT}</span>
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <CardPaymentModal
                open={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                productId={productId}
                productTitle={productTitle}
                sellerId={sellerId}
            />
        </>
    );
};

export default AuthenticityModal;

