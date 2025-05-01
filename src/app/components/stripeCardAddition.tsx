
import { toast } from 'sonner';
import {  useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, CheckCircle, Lock } from 'lucide-react';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe('pk_test_51RBcQQE27Rk7i1fToNUajjO8Sxgd1kVVqPTl1xxtxCR9ay4juutWl5GWd76EqbK4qdhg6HFhuebp695kvjONkoy900I1jlgMfN');

const StripeCardForm = ({ onSuccess, formData }: any) => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const handleSubmitCard = async () => {
        if (!stripe || !elements) {
            toast.error("Stripe.js has not yet loaded.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) {
                throw new Error("Card input is not available.");
            }

            // Create a PaymentMethod using Stripe.js
            const { paymentMethod, error: createError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
            });

            if (createError) {
                throw createError;
            }

            console.log('Payment method created:', paymentMethod);

            const fn_createOrder = async () => {
                try {
                    formData.cardId = paymentMethod?.id;
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/create`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${Cookies.get('token')}`,
                            },
                        }
                    );
                    console.log('Response from create order:', response.data);
                } catch (error) {
        
                }
            }
            fn_createOrder();
            onSuccess();
            toast.success("Payment successful!");
            router.push(`/orders`);

        } catch (error: any) {
            console.error("Payment error:", error);
            setError(error.message || "Failed to process your card.");
            toast.error(error.message || "Failed to process your card.");
        } finally {
            setIsLoading(false);
        }
    };

    const ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
                fontFamily: 'system-ui, sans-serif',
            },
            invalid: {
                color: '#FF5252',
            },
        },
        showIcon: true,
    };

    return (
        <div className="space-y-6">

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-[#2962FF]" />
                        <span>Card information</span>
                    </label>
                    {/* <div className="flex space-x-2">
                        <img src="/visa.svg" alt="Visa" className="h-6" />
                        <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                        <img src="/amex.svg" alt="American Express" className="h-6" />
                        <img src="/diners.svg" alt="Discover" className="h-6" />
                    </div> */}
                </div>

                <div className="rounded-lg border border-gray-300 overflow-hidden transition-all shadow-sm hover:shadow-md focus-within:border-[#2962FF] focus-within:ring-1 focus-within:ring-[#2962FF]">
                    <div className="px-4 py-3 bg-white border-b border-gray-300">
                        <CardNumberElement
                            options={ELEMENT_OPTIONS}
                            className="w-full h-10 py-2"

                        />
                    </div>

                    <div className="flex">
                        <div className="flex-1 px-4 py-3 border-r border-gray-300 bg-white">
                            <CardExpiryElement
                                options={ELEMENT_OPTIONS}
                                className="w-full h-10 py-2"
                            />
                        </div>
                        <div className="flex-1 px-4 py-3 bg-white">
                            <CardCvcElement
                                options={ELEMENT_OPTIONS}
                                className="w-full h-10 py-2"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    <p>Your card information is encrypted and secure.</p>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="pt-3">
                <button
                    onClick={handleSubmitCard}
                    disabled={isLoading}
                    className="cursor-pointer w-full h-[48px] bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    {isLoading ? 'Processing...' : 'Place Order'}
                </button>

                <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700">
                            By confirming your subscription, you allow Affare Doro to charge you for future payments in accordance with their terms.
                            You can always cancel your subscription.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center text-xs text-gray-500 pt-4 border-t">
                <span>Powered by</span>
                <svg
                    className="h-8"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 468 222.5"
                    xmlSpace="preserve"
                >
                    <path
                        fill="#635bff"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 30.1 17 45.3 41.4 45.3 11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5-9.7 0-18.3-3.4-19.4-15.2h48.9c0-1.3.2-6.5.2-8.9zm-49.4-9.5c0-11.3 6.9-16 13.2-16 6.1 0 12.6 4.7 12.6 16h-25.8zM301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3 17.9 0 34.2-14.4 34.2-46.1-.1-29-16.6-44.8-34.1-44.8zm-6 68.9c-5.9 0-9.4-2.1-11.8-4.7l-.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9 9.1 0 15.4 10.2 15.4 23.3 0 13.4-6.2 23.4-15.4 23.4zM223.8 61.7l25.1-5.4V36l-25.1 5.3zM223.8 69.3h25.1v87.5h-25.1zM196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23c-3.2-1.2-14.9-3.4-20.8 7.4zM146.9 47.6l-24.4 5.2-.1 80.1c0 14.8 11.1 25.7 25.9 25.7 8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19l.1-21.7zM79.3 94.7c0-3.9 3.2-5.4 8.5-5.4 7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1 0 4.6-4 6.1-9.6 6.1-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7 20.8 0 35.1-10.3 35.1-28.2-.1-29.8-38.2-24.5-38.2-35.7z"
                    />
                </svg>

            </div>
        </div>
    );
};

const AddNewCardModal = ({ formData }: any) => {
    console.log('Form data in modal:', formData);
    return (
        <div>
            <p className="text-[19px] font-[700] mb-4">Add Card Details</p>
            <div className="bg-white">
                <Elements stripe={stripePromise}>
                    <StripeCardForm
                        formData={formData}
                        onSuccess={() => { }}
                    />
                </Elements>
            </div>
        </div>
    )
};

export default AddNewCardModal;