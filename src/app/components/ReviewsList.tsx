"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

interface Review {
    _id: string;
    rating: number;
    description: string;
    reviewerId: {
        _id: string;
        username?: string;
        fullName: string;
        email: string;
        image?: string;
    };
    createdAt: string;
}

interface RatingStatistics {
    averageRating: number;
    totalReviews: number;
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
}

interface ReviewsListProps {
    sellerId: string;
}

const ReviewsList = ({ sellerId }: ReviewsListProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statistics, setStatistics] = useState<RatingStatistics>({
        averageRating: 0,
        totalReviews: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 0,
    });
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        limit: 10,
    });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/seller/${sellerId}`,
                    {
                        params: {
                            page: currentPage,
                            limit: 10
                        }
                    }
                );

                if (response.status === 200 && response.data.status === 'ok') {
                    setReviews(response.data.data);
                    setPagination(response.data.pagination);
                    setStatistics(response.data.statistics);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                // Don't show error toast, just set empty reviews
            } finally {
                setIsLoading(false);
            }
        };

        if (sellerId) {
            fetchReviews();
        }
    }, [sellerId, currentPage]);

    const getStarRating = (rating: number, size: number = 18) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-0.5">
                {/* Full Stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        size={size}
                        className="text-yellow-400 fill-yellow-400"
                    />
                ))}

                {/* Half Star */}
                {hasHalfStar && (
                    <div className="relative">
                        <Star size={size} className="text-yellow-400" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star size={size} className="text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                )}

                {/* Empty Stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        size={size}
                        className="text-yellow-400"
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getRatingPercentage = (ratingCount: number) => {
        if (statistics.totalReviews === 0) return 0;
        return (ratingCount / statistics.totalReviews) * 100;
    };

    if (reviews.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <MessageSquare size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Reviews Yet
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                    This seller hasn't received any reviews yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg">
            {/* Reviews Summary */}
            <div className="my-6 pb-6 border-b">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Average Rating */}
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-800">
                                {statistics.averageRating.toFixed(1)}
                            </div>
                            <div className="flex justify-center mt-2">
                                {getStarRating(statistics.averageRating, 20)}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                                {statistics.totalReviews} {statistics.totalReviews === 1 ? "Review" : "Reviews"}
                            </p>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-3">Rating Distribution</h3>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = statistics[`rating${rating}` as keyof RatingStatistics] as number;
                                const percentage = getRatingPercentage(count);
                                return (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6 mb-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="pb-6 border-b last:border-b-0"
                    >
                        {/* Reviewer Info */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                {review.reviewerId?.image ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${review.reviewerId.image}`}
                                        alt={review.reviewerId.fullName || review.reviewerId.username || "User"}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-semibold">
                                        {(review.reviewerId?.fullName?.[0] || review.reviewerId?.username?.[0] || "U").toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {review.reviewerId?.fullName || review.reviewerId?.username || "Anonymous"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-2">
                            {getStarRating(review.rating)}
                        </div>

                        {/* Review Description */}
                        {review.description && (
                            <p className="text-gray-700 leading-relaxed">
                                {review.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t">
                    <div className="text-sm text-gray-600">
                        Showing page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md flex items-center gap-1 transition-colors ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                                }`}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNumber;
                                if (pagination.totalPages <= 5) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= pagination.totalPages - 2) {
                                    pageNumber = pagination.totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`w-10 h-10 rounded-md transition-colors cursor-pointer ${currentPage === pageNumber
                                            ? "bg-gray-800 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className={`px-4 py-2 rounded-md flex items-center gap-1 transition-colors ${currentPage === pagination.totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                                }`}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;

