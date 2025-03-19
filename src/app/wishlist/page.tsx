"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import WishlistPage from '../components/wishlistProducts'
import { Heart } from 'lucide-react'

function wishlistPage() {

    const router = useRouter()
    return (
        <> 
            <h2 className="mt-5 text-3xl container mx-auto max-w-screen-2xl rounded-xl font-bold flex items-center gap-2">
                Favorited Items
                <Heart size={35} />
            </h2>
           <WishlistPage/>
        </>
    )
}

export default wishlistPage