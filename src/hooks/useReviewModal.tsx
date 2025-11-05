"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReviewModal from '@/components/ReviewModal';

export const useReviewModal = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [sellerId, setSellerId] = useState('');
    const [reviewerId, setReviewerId] = useState('');
    const [orderId, setOrderId] = useState('');
    const [sellerName, setSellerName] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const reviewParam = searchParams.get('review');
        const orderParam = searchParams.get('order');
        const fromParam = searchParams.get('from');

        // Open modal if review parameter exists, regardless of login status
        if (reviewParam) {
            setSellerId(reviewParam);
            setReviewerId(fromParam || '');
            setOrderId(orderParam || '');
            setIsReviewModalOpen(true);

            // You can fetch seller name here if needed
            // For now, we'll use a placeholder
            setSellerName('Seller');

            // Clean up the URL by removing the review, order, and from parameters
            const url = new URL(window.location.href);
            url.searchParams.delete('review');
            url.searchParams.delete('order');
            url.searchParams.delete('from');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams]);

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSellerId('');
        setReviewerId('');
        setOrderId('');
        setSellerName('');
    };

    const ReviewModalComponent = () => (
        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={closeReviewModal}
            sellerId={sellerId}
            reviewerId={reviewerId}
            orderId={orderId}
            sellerName={sellerName}
        />
    );

    return {
        isReviewModalOpen,
        sellerId,
        reviewerId,
        orderId,
        sellerName,
        closeReviewModal,
        ReviewModalComponent
    };
};
