"use client";

import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from 'axios';
import { toast } from 'sonner';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerId: string;
    reviewerId?: string;
    orderId?: string;
    sellerName?: string;
}

const ReviewModal = ({ isOpen, onClose, sellerId, reviewerId, orderId, sellerName }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [reviewExists, setReviewExists] = useState(false);
    const [existingReviewData, setExistingReviewData] = useState<any>(null);
    const [isCheckingReview, setIsCheckingReview] = useState(false);

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        setHoveredStar(starValue);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    // Check if review already exists
    useEffect(() => {
        const checkReviewExists = async () => {
            if (!isOpen || !orderId || !sellerId || !reviewerId) {
                return;
            }
            setIsCheckingReview(true);

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/check-exists`,
                    {
                        params: {
                            orderId,
                            sellerId,
                            reviewerId
                        }
                    }
                );

                if (response.data.exists) {
                    setReviewExists(true);
                    setExistingReviewData(response.data.data);
                } else {
                    setReviewExists(false);
                    setExistingReviewData(null);
                }
            } catch (error) {
                console.error('Error checking review existence:', error);
                // If check fails, allow user to proceed
                setReviewExists(false);
            } finally {
                setIsCheckingReview(false);
            }
        };

        checkReviewExists();
    }, [isOpen, orderId, sellerId, reviewerId]);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!reviewerId) {
            toast.error('Reviewer information is missing');
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                description: description.trim(),
                rating: rating,
                sellerId: sellerId,
                reviewerId: reviewerId,
                orderId: orderId || null
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/create`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                toast.success('Review submitted successfully!');

                // Reset form
                setRating(0);
                setDescription('');
                setHoveredStar(0);

                // Close modal
                onClose();
            } else {
                toast.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to submit review. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setRating(0);
        setDescription('');
        setHoveredStar(0);
        setReviewExists(false);
        setExistingReviewData(null);
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            className="flex justify-center items-center p-4 backdrop-blur-sm bg-black/40"
        >
            <Box className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {reviewExists ? 'Review Already Submitted' : 'Rate Your Experience'}
                    </h2>
                    {sellerName && (
                        <p className="text-gray-600">
                            Review for <span className="font-semibold">{sellerName}</span>
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {isCheckingReview && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                )}

                {/* Review Already Exists */}
                {!isCheckingReview && reviewExists && existingReviewData && (
                    <div className="mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-yellow-800 font-medium mb-2">
                                ✓ You have already submitted a review for this order.
                            </p>
                            <p className="text-yellow-700 text-sm">
                                You cannot submit multiple reviews for the same order.
                            </p>
                        </div>

                        {/* Display Existing Review */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Your Review:</h3>

                            {/* Existing Rating */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={24}
                                            className={`${star <= existingReviewData.rating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Existing Description */}
                            {existingReviewData.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <p className="text-gray-600 text-sm bg-white p-3 rounded border border-gray-200">
                                        {existingReviewData.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Close Button Only */}
                        <div className="mt-6">
                            <button
                                onClick={handleClose}
                                className="w-full cursor-pointer px-4 py-2 bg-[#1B1B1B] hover:bg-[#222222] rounded-md text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* New Review Form */}
                {!isCheckingReview && !reviewExists && (
                    <>
                        {/* Star Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Rating *
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => handleStarHover(star)}
                                        onMouseLeave={handleStarLeave}
                                        className="transition-colors duration-200 cursor-pointer"
                                    >
                                        <Star
                                            size={32}
                                            className={`${star <= (hoveredStar || rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                {rating === 0 ? 'Click to rate' :
                                    rating === 1 ? 'Poor' :
                                        rating === 2 ? 'Fair' :
                                            rating === 3 ? 'Good' :
                                                rating === 4 ? 'Very Good' :
                                                    rating === 5 ? 'Excellent' : ''}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Share your experience with this seller..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={4}
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {description.length}/500 characters
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || isLoading}
                                className={`flex-1 cursor-pointer px-4 py-2 rounded-md text-white transition-colors ${rating === 0 || isLoading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-[#1B1B1B] hover:bg-[#222222]'
                                    }`}
                            >
                                {isLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ReviewModal;
