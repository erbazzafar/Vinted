"use client";

import { useReviewModal } from '@/hooks/useReviewModal';

export const ReviewModalProvider = () => {
    const { ReviewModalComponent } = useReviewModal();

    return <ReviewModalComponent />;
};
