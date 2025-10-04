
// import { toast } from 'sonner';
// import { useState } from "react";
// import { loadStripe } from '@stripe/stripe-js';
// import { CreditCard, CheckCircle, Lock } from 'lucide-react';
// import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";

// const stripePromise = loadStripe('pk_test_51RBcQQE27Rk7i1fToNUajjO8Sxgd1kVVqPTl1xxtxCR9ay4juutWl5GWd76EqbK4qdhg6HFhuebp695kvjONkoy900I1jlgMfN');

// const StripeCardForm = ({ onSuccess, formData }: any) => {

//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const stripe = useStripe();
//     const elements = useElements();
//     const router = useRouter();

//     const handleSubmitCard = async () => {
//         if (!stripe || !elements) {
//             toast.error("Stripe.js has not yet loaded.");
//             return;
//         }

//         setIsLoading(true);
//         setError(null);

//         try {
//             const cardNumberElement = elements.getElement(CardNumberElement);
//             if (!cardNumberElement) {
//                 throw new Error("Card input is not available.");
//             }

//             // Create a PaymentMethod using Stripe.js
//             const { paymentMethod, error: createError } = await stripe.createPaymentMethod({
//                 type: 'card',
//                 card: cardNumberElement,
//             });

//             if (createError) {
//                 throw createError;
//             }

//             console.log('Payment method created:', paymentMethod);

//             const fn_createOrder = async () => {
//                 try {
//                     formData.cardId = paymentMethod?.id;
//                     console.log("--------------------------------------");

//                     const response = await axios.post(
//                         `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/create`,
//                         formData,
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${Cookies.get("user-token")}`,
//                             },
//                         }
//                     );
//                     console.log("++++++++++++++++++++++++++++++++++");

//                     console.log('Response from create order:', response.data);
//                     if (response.status === 200) {
//                         toast.success("Payment successful!");
//                         router.push(`/orders`);
//                     }
//                 } catch (error) {

//                 }
//             }
//             fn_createOrder();
//             onSuccess();

//         } catch (error: any) {
//             console.error("Payment error:", error);
//             setError(error.message || "Failed to process your card.");
//             toast.error(error.message || "Failed to process your card.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const ELEMENT_OPTIONS = {
//         style: {
//             base: {
//                 fontSize: '16px',
//                 color: '#424770',
//                 '::placeholder': { color: '#aab7c4' },
//                 fontFamily: 'system-ui, sans-serif',
//             },
//             invalid: {
//                 color: '#FF5252',
//             },
//         },
//         showIcon: true,
//     };

//     return (
//         <div className="space-y-6">

//             <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                     <label className="text-sm font-medium text-gray-700 flex items-center">
//                         <CreditCard className="w-4 h-4 mr-2 text-[#2962FF]" />
//                         <span>Card information</span>
//                     </label>
//                     {/* <div className="flex space-x-2">
//                         <img src="/visa.svg" alt="Visa" className="h-6" />
//                         <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
//                         <img src="/amex.svg" alt="American Express" className="h-6" />
//                         <img src="/diners.svg" alt="Discover" className="h-6" />
//                     </div> */}
//                 </div>

//                 <div className="rounded-lg border border-gray-300 overflow-hidden transition-all shadow-sm hover:shadow-md focus-within:border-[#2962FF] focus-within:ring-1 focus-within:ring-[#2962FF]">
//                     <div className="px-4 py-3 bg-white border-b border-gray-300">
//                         <CardNumberElement
//                             options={ELEMENT_OPTIONS}
//                             className="w-full h-10 py-2"

//                         />
//                     </div>

//                     <div className="flex">
//                         <div className="flex-1 px-4 py-3 border-r border-gray-300 bg-white">
//                             <CardExpiryElement
//                                 options={ELEMENT_OPTIONS}
//                                 className="w-full h-10 py-2"
//                             />
//                         </div>
//                         <div className="flex-1 px-4 py-3 bg-white">
//                             <CardCvcElement
//                                 options={ELEMENT_OPTIONS}
//                                 className="w-full h-10 py-2"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                     <Lock className="h-3 w-3" />
//                     <p>Your card information is encrypted and secure.</p>
//                 </div>
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <div className="pt-3">
//                 <button
//                     onClick={handleSubmitCard}
//                     disabled={isLoading}
//                     className="cursor-pointer w-full h-[48px] bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
//                 >
//                     {isLoading ? 'Processing...' : 'Place Order'}
//                 </button>

//                 <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
//                     <div className="flex items-start gap-2">
//                         <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-xs text-gray-700">
//                             By confirming your subscription, you allow Affare Doro to charge you for future payments in accordance with their terms.
//                             You can always cancel your subscription.
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex items-center justify-center text-xs text-gray-500 pt-4 border-t">
//                 <span>Powered by</span>
//                 <svg
//                     className="h-8"
//                     version="1.1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 468 222.5"
//                     xmlSpace="preserve"
//                 >
//                     <path
//                         fill="#635bff"
//                         fillRule="evenodd"
//                         clipRule="evenodd"
//                         d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 30.1 17 45.3 41.4 45.3 11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5-9.7 0-18.3-3.4-19.4-15.2h48.9c0-1.3.2-6.5.2-8.9zm-49.4-9.5c0-11.3 6.9-16 13.2-16 6.1 0 12.6 4.7 12.6 16h-25.8zM301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3 17.9 0 34.2-14.4 34.2-46.1-.1-29-16.6-44.8-34.1-44.8zm-6 68.9c-5.9 0-9.4-2.1-11.8-4.7l-.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9 9.1 0 15.4 10.2 15.4 23.3 0 13.4-6.2 23.4-15.4 23.4zM223.8 61.7l25.1-5.4V36l-25.1 5.3zM223.8 69.3h25.1v87.5h-25.1zM196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23c-3.2-1.2-14.9-3.4-20.8 7.4zM146.9 47.6l-24.4 5.2-.1 80.1c0 14.8 11.1 25.7 25.9 25.7 8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19l.1-21.7zM79.3 94.7c0-3.9 3.2-5.4 8.5-5.4 7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1 0 4.6-4 6.1-9.6 6.1-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7 20.8 0 35.1-10.3 35.1-28.2-.1-29.8-38.2-24.5-38.2-35.7z"
//                     />
//                 </svg>

//             </div>
//         </div>
//     );
// };

// const AddNewCardModal = ({ formData }: any) => {
//     console.log('Form data in modal:', formData);
//     return (
//         <div>
//             <p className="text-[19px] font-[700] mb-4">Add Card Details</p>
//             <div className="bg-white">
//                 <Elements stripe={stripePromise}>
//                     <StripeCardForm
//                         formData={formData}
//                         onSuccess={() => { }}
//                     />
//                 </Elements>
//             </div>
//         </div>
//     )
// };

// export default AddNewCardModal;




// import React from 'react'
// import { TapCard, Currencies, Direction, Edges, Locale, Theme, tokenize } from '@tap-payments/card-sdk'
// import { toast } from 'sonner';
// import Cookies from "js-cookie"
// import axios from 'axios';

// const AddNewCardModal = ({ formData }: any) => {

// 	const handleCardTokenization = async () => {

// 	}

// 	const handleCreateCharge = async (formData: any, id: String) => {
// 		try {
// 			const chargeRes = await axios.post(
// 				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/createCharge`,
// 				{
// 					...formData,
// 					cardId: id,
// 					currency: 'AED',
// 					amount: formData?.subTotal.toFixed(2)
// 				},
// 				{
// 					headers: {
// 						Authorization: `Bearer ${Cookies.get("user-token")}`,
// 						'Content-Type': 'application/json'
// 					}
// 				}
// 			)

// 			console.log("charge response: ", chargeRes.data);

// 			if (chargeRes.status === 200) {
// 				toast.success("Payment Success!");
// 				return
// 			}

// 		} catch (error) {
// 			toast.error("Failed to create charge. Please try again later.");
// 			return
// 		}
// 	}
// 	return (
// 		<div>
// 			<p className='font-bold text-lg'>Add Card Details Below</p>
// 			<TapCard
// 				publicKey='pk_test_HWNhYiQ4z8MlSyw9cqsIJbvx'
// 				transaction={{
// 					amount: 10,
// 					currency: Currencies.AED
// 				}}
// 				customer={{
// 					id: 'customer id',
// 					name: [
// 						{
// 							lang: Locale.EN,
// 							first: 'Ahmed',
// 							last: 'Sharkawy',
// 							middle: 'Mohamed'
// 						}
// 					],
// 					nameOnCard: 'Ahmed Sharkawy',
// 					editable: true,
// 					contact: {
// 						email: 'ahmed@gmail.com',
// 						phone: {
// 							countryCode: '20',
// 							number: '1000000000'
// 						}
// 					}
// 				}}
// 				acceptance={{
// 					supportedBrands: ['AMEX', 'VISA', 'MASTERCARD', 'MADA'],
// 					supportedCards: ['CREDIT', 'DEBIT']
// 				}}
// 				fields={{
// 					cardHolder: true
// 				}}
// 				addons={{
// 					displayPaymentBrands: true,
// 					loader: true,
// 					saveCard: true
// 				}}
// 				interface={{
// 					locale: Locale.EN,
// 					theme: Theme.LIGHT,
// 					edges: Edges.CURVED,
// 					direction: Direction.LTR
// 				}}
// 				onReady={() => console.log('onReady')}
// 				onFocus={() => console.log('onFocus')}
// 				onBinIdentification={(data) => console.log('onBinIdentification', data)}
// 				onValidInput={(data) => console.log('onValidInputChange', data)}
// 				onInvalidInput={(data) => console.log('onInvalidInput', data)}
// 				onError={(data) => console.log('onError', data)}
// 				onSuccess={(data) => handleCreateCharge(formData, data?.id)}
// 			/>
// 		</div>
// 	)
// }

// export default AddNewCardModal;

// "use client";

// import { lazy, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
// 	Elements,
// 	CardNumberElement,
// 	CardExpiryElement,
// 	CardCvcElement,
// 	useStripe,
// 	useElements,
// } from "@stripe/react-stripe-js";
// import { CreditCard, Lock, CheckCircle } from "lucide-react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// const stripePromise = loadStripe(
// 	"pk_test_51SDkIGHcSKCk6iGaBoAlBlW3oPB2sx2zvMaf3BKZ9B82h54Ysr4pS2W4ORj9terShK2EwtHnV5g6cXoLdaG75hz400EtqJYq4W"
// );

// const ELEMENT_OPTIONS = {
// 	style: {
// 		base: {
// 			fontSize: "16px",
// 			color: "#32325d",
// 			"::placeholder": { color: "#a0aec0" },
// 			fontFamily: "system-ui, sans-serif",
// 		},
// 		invalid: {
// 			color: "#fa755a",
// 		},
// 	},
// 	showIcon: true,
// };

// function CheckoutForm({ formData }: { formData: any }) {
// 	const stripe = useStripe();
// 	const elements = useElements();
// 	const router = useRouter();

// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);

// 	const handlePayment = async () => {
// 		if (!stripe || !elements) {
// 			toast.error("Stripe.js has not loaded yet.");
// 			return;
// 		}

// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const cardNumberElement = elements.getElement(CardNumberElement);
// 			if (!cardNumberElement) throw new Error("Card element not found");

// 			// 1. Create PaymentMethod
// 			const { paymentMethod, error: stripeError } =
// 				await stripe.createPaymentMethod({
// 					type: "card",
// 					card: cardNumberElement,
// 					billing_details: {
// 						name: formData.fullName,
// 						email: formData.email,
// 						phone: formData.phone,
// 						address: {
// 							line1: formData.address1,
// 							city: formData.city,
// 							country: formData.country,
// 						},
// 					},
// 				});

// 			if (stripeError) throw stripeError;

// 			console.log("PaymentMethod created:", paymentMethod	);


// 			// 2. Send to backend
// 			const res = await axios.post(
// 				`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/dummyCreate`,
// 				{ 
// 					...formData, 
// 					cardId: paymentMethod.id,
// 					brand: paymentMethod.card?.brand,
// 					last4: paymentMethod.card?.last4,
// 					expMonth: paymentMethod.card?.exp_month,
// 					expYear: paymentMethod.card?.exp_year
// 				},
// 				{
// 					headers: { Authorization: `Bearer ${Cookies.get("user-token")}` },
// 				}
// 			);

// 			if (res.status === 200) {
// 				toast.success("✅ Payment successful!");
// 				router.push("/orders");
// 			}
// 		} catch (err: any) {
// 			console.error(err);
// 			setError(err.message || "Payment failed");
// 			toast.error(err.message || "Payment failed");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="space-y-6">
// 			{/* Card Section */}
// 			<div className="space-y-3">
// 				<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
// 					<CreditCard className="w-4 h-4 text-indigo-600" />
// 					Card Information
// 				</label>

// 				<div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
// 					<div className="px-4 py-3 bg-white border-b border-gray-200">
// 						<CardNumberElement options={ELEMENT_OPTIONS} className="w-full" />
// 					</div>

// 					<div className="flex">
// 						<div className="flex-1 px-4 py-3 border-r border-gray-200 bg-white">
// 							<CardExpiryElement options={ELEMENT_OPTIONS} className="w-full" />
// 						</div>
// 						<div className="flex-1 px-4 py-3 bg-white">
// 							<CardCvcElement options={ELEMENT_OPTIONS} className="w-full" />
// 						</div>
// 					</div>
// 				</div>

// 				<div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
// 					<Lock className="h-3 w-3" />
// 					<p>Your card details are encrypted & secure.</p>
// 				</div>
// 			</div>

// 			{error && <p className="text-red-500 text-sm">{error}</p>}

// 			{/* Pay Button */}
// 			<button
// 				onClick={handlePayment}
// 				disabled={loading}
// 				className="cursor-pointer w-full h-[48px] bg-gray-400 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
// 			>
// 				{loading ? "Processing..." : `Pay AED ${Number(formData.subTotal).toFixed(2)}`}
// 			</button>

// 			{/* Terms Section */}
// 			<div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-600 flex gap-2">
// 				<CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
// 				<p>
// 					By confirming your order, you allow us to charge this payment method
// 					in accordance with our terms. You can always manage your subscription.
// 				</p>
// 			</div>

// 			{/* Powered by Stripe */}
// 			<div className="flex items-center justify-center text-xs text-gray-500 pt-4 border-t">
// 				<span>Powered by</span>
// 				<svg
// 					className="h-6 ml-2"
// 					xmlns="http://www.w3.org/2000/svg"
// 					viewBox="0 0 468 222.5"
// 				>
// 					<path
// 						fill="#635bff"
// 						d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6..."
// 					/>
// 				</svg>
// 			</div>
// 		</div>
// 	);
// }

// export default function StripeCheckout({ formData }: { formData: any }) {
// 	return (
// 		<Elements stripe={stripePromise}>
// 			<CheckoutForm formData={formData} />
// 		</Elements>
// 	);
// }


"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
	process.env.STRIPE_PUBLISH_KEY || "pk_test_51RH3dwI5tAyGjw2REiKEXU1UjR8QfdvJZyY1SOcxZS48JxJEGi8eJ84F2MVV1cjMPWuuTlI9v4LOt4xfQXqhqmP800sHniLIA9"
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

function CheckoutForm({ formData }: { formData: any }) {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handlePayment = async () => {
		if (!stripe || !elements) {
			toast.error("Stripe.js has not loaded yet.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const cardNumberElement = elements.getElement(CardNumberElement);
			if (!cardNumberElement) throw new Error("Card element not found");

			// 1. Create PaymentMethod
			const { paymentMethod, error: stripeError } =
				await stripe.createPaymentMethod({
					type: "card",
					card: cardNumberElement,
					billing_details: {
						name: formData.fullName,
						email: formData.email,
						phone: formData.phone,
						address: {
							line1: formData.address1,
							city: formData.city,
							country: formData.country,
						},
					},
				});

			if (stripeError) throw stripeError;

			// 2. Send to backend
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/dummyCreate`,
				{
					...formData,
					cardId: paymentMethod.id,
					brand: paymentMethod.card?.brand,
					last4: paymentMethod.card?.last4,
					expMonth: paymentMethod.card?.exp_month,
					expYear: paymentMethod.card?.exp_year,
				},
				{
					headers: { Authorization: `Bearer ${Cookies.get("user-token")}` },
				}
			);

			if (res.status === 200) {
				toast.success("✅ Payment successful!");
				router.push("/orders");
			}
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Payment failed");
			toast.error(err.message || "Payment failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
			{/* Header */}
			<h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
				<CreditCard className="text-indigo-600" />
				Payment Information
			</h2>

			{/* Card Input Container */}
			<div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
				<div className="px-5 py-4 bg-white border-b border-gray-200">
					<CardNumberElement
						options={ELEMENT_OPTIONS}
						className="w-full text-gray-900 placeholder-gray-400 outline-none"
					/>
				</div>

				<div className="flex">
					<div className="flex-1 px-5 py-4 border-r border-gray-200 bg-white">
						<CardExpiryElement
							options={ELEMENT_OPTIONS}
							className="w-full text-gray-900 placeholder-gray-400 outline-none"
						/>
					</div>
					<div className="flex-1 px-5 py-4 bg-white">
						<CardCvcElement
							options={ELEMENT_OPTIONS}
							className="w-full text-gray-900 placeholder-gray-400 outline-none"
						/>
					</div>
				</div>
			</div>

			{/* Secure Info */}
			<p className="mt-3 flex items-center gap-1 text-sm text-gray-500">
				<Lock className="w-4 h-4" />
				Your card details are encrypted & secure.
			</p>

			{/* Error Message */}
			{error && (
				<p className="mt-4 text-red-600 font-medium text-center">{error}</p>
			)}

			{/* Pay Button */}
			<button
				onClick={handlePayment}
				disabled={loading}
				className={`mt-6 w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all ${loading
						? "bg-gray-400 cursor-not-allowed"
						: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
					} flex justify-center items-center cursor-pointer`}
			>
				{loading ? "Processing..." : `Pay AED ${Number(formData.subTotal).toFixed(2)}`}
			</button>

			{/* Terms */}
			<div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-2 text-indigo-700 text-sm">
				<CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
				<p>
					By confirming your order, you allow us to charge this payment method
					in accordance with our terms. You can always manage your subscription.
				</p>
			</div>

			{/* Powered By Stripe */}
			<div className="mt-8 flex justify-center items-center text-gray-400 text-xs space-x-2 select-none">
				<span>Powered by Stripe</span>
				<svg
					className="h-5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 468 222.5"
					fill="none"
				>
					<path
						fill="#635BFF"
						d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 27 18.4 44.2 37.6 44.2 15.3 0 27-10.6 28.5-26.6h-17.3c-1.2 6-6 10.2-12.3 10.2-7.9 0-14.2-6.8-14.2-15.7h42v-6z"
					/>
					<path
						fill="#635BFF"
						d="M230 50h-25v92.8c0 11 9.6 21.8 20.7 21.8 10.3 0 15.4-7.7 15.4-19.2v-95.4h-10z"
					/>
					<path
						fill="#635BFF"
						d="M170 88.6l-23.7-9.5-10 24.8 23.7 9.4-2.3 5.5-28.9-11.2 12.3-30.6 28.9 11.2-2.3 5.5z"
					/>
					<path
						fill="#635BFF"
						d="M120 76.5l8.4-4.7 4.6 11-8.4 4.7-4.6-11z"
					/>
				</svg>
			</div>
		</div>
	);
}

export default function StripeCheckout({ formData }: { formData: any }) {
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm formData={formData} />
		</Elements>
	);
}
