"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import WishlistPage from '../components/wishlistProducts'
import { Heart } from 'lucide-react'

function wishlistPage() {

    const router = useRouter()
    return (
        <>
            <h2 className="pt-[50px] text-xl container mx-auto max-w-screen-2xl font-bold flex items-center gap-2 lg:px-[50px]">
                <Heart size={35} />
                Favorite Items
            </h2>
            <WishlistPage />
        </>
    )
}

export default wishlistPage