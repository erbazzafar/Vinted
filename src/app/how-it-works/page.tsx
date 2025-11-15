'use client';
import { motion } from 'framer-motion';
import {
    Shirt,
    Truck,
    Wallet,
    ShoppingBag,
    Heart,
    BadgeEuro,
    Send,
    ShieldCheck,
    Undo2,
    Store,
    PackageCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
    const colors = {
        vintedGreen: '#1DBF73',
        vintedPurple: '#9B4DFF',
        vintedPink: '#FF4D73',
        vintedBlue: '#2D9CDB',
        vintedBeige: '#F5F5F5',
    };

    const sellingSteps = [
        {
            icon: <Shirt size={36} className="text-[colors.vintedGreen]" />,
            title: 'List Your Item',
            description: 'Upload photos, write a detailed description, and set your own price.',
        },
        {
            icon: <Store size={36} className="text-[colors.vintedPurple]" />,
            title: 'Manage Listings',
            description: 'Organize your items, edit prices, and mark items as sold.',
        },
        {
            icon: <PackageCheck size={36} className="text-[colors.vintedPink]" />,
            title: 'Sell & Ship',
            description: 'Once sold, use our prepaid label and ship the item easily.',
        },
        {
            icon: <Wallet size={36} className="text-[colors.vintedBlue]" />,
            title: 'Get Paid',
            description: 'Receive payments securely after buyer confirmation.',
        },
    ];

    const buyingSteps = [
        {
            icon: <ShoppingBag size={36} className="text-[colors.vintedGreen]" />,
            title: 'Explore',
            description: 'Browse thousands of items from verified sellers.',
        },
        {
            icon: <Heart size={36} className="text-[colors.vintedPink]" />,
            title: 'Save Favorites',
            description: 'Shortlist your favorite items to view or buy later.',
        },
        {
            icon: <BadgeEuro size={36} className="text-[colors.vintedPurple]" />,
            title: 'Checkout',
            description: 'Pay securely using Affare Doro protected checkout system.',
        },
        {
            icon: <ShieldCheck size={36} className="text-[colors.vintedBlue]" />,
            title: 'Buy with Confidence',
            description: 'Buy knowing your money is protected until item delivery.',
        },
    ];

    const shippingSteps = [
        {
            icon: <Send size={36} className="text-[colors.vintedPink]" />,
            title: 'Place Your Order',
            description: 'Provide your shipping information during checkout.',
        },
        {
            icon: <Truck size={36} className="text-[colors.vintedGreen]" />,
            title: 'Next-Day Delivery',
            description: 'After order approval, we provide next-day delivery service.',
        },
    ];

    const refundSteps = [
        {
            icon: <Undo2 size={36} className="text-[colors.vintedPurple]" />,
            title: 'Refund Eligibility',
            description: 'Request refunds if item is not as described or never arrives.',
        },
        {
            icon: <Truck size={36} className="text-[colors.vintedBlue]" />,
            title: 'Easy Returns',
            description: 'Return process guided by our support team for hassle-free experience.',
        },
    ];

    const renderSection = (title, steps, color) => (
        <section className="mb-16">
            <h2 className={`text-3xl font-bold mb-8 text-center`} style={{ color: colors[color] }}>
                {title}
            </h2>
            <div className=" grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-lg border group hover:shadow-xl transition duration-300 text-center relative flex flex-col items-center justify-center min-h-[220px]"
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-r from-[colors.vintedGreen] to-[colors.vintedBlue] opacity-20 rounded-xl group-hover:opacity-30 transition duration-300`}
                        ></div>
                        <div className="relative z-10 mb-4">{step.icon}</div>
                        <h4 className="text-xl font-semibold text-gray-800 group-hover:text-[colors.vintedPink] transition-colors duration-300">{step.title}</h4>
                        <p className="text-gray-600 mt-2 group-hover:text-[colors.vintedBlue] transition-colors duration-300">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );

    return (
        <main style={{ backgroundColor: colors.vintedBeige }} className="min-h-screen text-gray-600 px-4 py-10 sm:px-6 lg:px-24">
            {/* Catchy Phrase Section */}
            <section className="bg-gray-700 p-12 rounded-xl mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl sm:text-6xl font-bold text-white text-center mb-8"
                >
                    Discover, Buy, and Sell with Confidence
                </motion.h1>
                <p className="text-lg sm:text-xl text-white text-center max-w-2xl mx-auto">
                    Join our platform to buy and sell amazing items with ease. Whether you're looking for unique fashion, gadgets, or collectibles,
                    our secure system ensures a smooth transaction every time.
                </p>
            </section>

            {renderSection('Selling on Affare Doro', sellingSteps, 'vintedGreen')}
            <div className="text-center mb-16">
                <Link
                    href="/sell"
                    className="rounded-md inline-block mt-4 px-6 py-3 text-white group group hover:bg-[colors.vintedGreen] transition-colors duration-300"
                    style={{ backgroundColor: colors.vintedPurple }}
                >
                    Start Selling
                </Link>
            </div>

            {renderSection('Buying on Affare Doro', buyingSteps, 'vintedPink')}
            <div className="text-center mb-16">
                <Link
                    href="/"
                    className="rounded-md inline-block mt-4 px-6 py-3 text-white group hover:bg-[colors.vintedPink] transition-colors duration-300"
                    style={{ backgroundColor: colors.vintedBlue }}
                >
                    Start Shopping
                </Link>
            </div>

            {renderSection('Shipping Process', shippingSteps, 'vintedBlue')}
            {renderSection('Refunds & Returns', refundSteps, 'vintedPurple')}
        </main>
    );
}