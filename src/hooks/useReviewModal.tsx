"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import ReviewModal from '@/components/ReviewModal';

export const useReviewModal = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [sellerId, setSellerId] = useState('');
    const [orderId, setOrderId] = useState('');
    const [sellerName, setSellerName] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const reviewParam = searchParams.get('review');
        const orderParam = searchParams.get('order');
        const userToken = Cookies.get('user-token');

        // Only open modal if user is logged in AND review parameter exists
        if (reviewParam && userToken) {
            setSellerId(reviewParam);
            setOrderId(orderParam || '');
            setIsReviewModalOpen(true);

            // You can fetch seller name here if needed
            // For now, we'll use a placeholder
            setSellerName('Seller');

            // Clean up the URL by removing the review and order parameters
            const url = new URL(window.location.href);
            url.searchParams.delete('review');
            url.searchParams.delete('order');
            window.history.replaceState({}, '', url.toString());
        } else if (reviewParam && !userToken) {
            // If review parameter exists but user is not logged in, just clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('review');
            url.searchParams.delete('order');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams]);

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSellerId('');
        setOrderId('');
        setSellerName('');
    };

    const ReviewModalComponent = () => (
        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={closeReviewModal}
            sellerId={sellerId}
            orderId={orderId}
            sellerName={sellerName}
        />
    );

    return {
        isReviewModalOpen,
        sellerId,
        orderId,
        sellerName,
        closeReviewModal,
        ReviewModalComponent
    };
};
