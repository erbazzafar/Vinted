"use client";

import { Suspense } from 'react';
import { useReviewModal } from '@/hooks/useReviewModal';

function ReviewModalContent() {
    const { ReviewModalComponent } = useReviewModal();
    return <ReviewModalComponent />;
}

export const ReviewModalProvider = () => {
    return (
        <Suspense fallback={null}>
            <ReviewModalContent />
        </Suspense>
    );
};
