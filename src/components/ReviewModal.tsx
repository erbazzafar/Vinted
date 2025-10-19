"use client";

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerId: string;
    orderId?: string;
    sellerName?: string;
}

const ReviewModal = ({ isOpen, onClose, sellerId, orderId, sellerName }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        setHoveredStar(starValue);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsLoading(true);

        try {
            const reviewerId = Cookies.get('userId');
            const token = Cookies.get('user-token');

            if (!reviewerId || !token) {
                toast.error('Please login to submit a review');
                setIsLoading(false);
                return;
            }

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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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
                        Rate Your Experience
                    </h2>
                    {sellerName && (
                        <p className="text-gray-600">
                            Review for <span className="font-semibold">{sellerName}</span>
                        </p>
                    )}
                </div>

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
            </Box>
        </Modal>
    );
};

export default ReviewModal;
