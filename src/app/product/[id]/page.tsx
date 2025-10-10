"use client"

import ProductPage from '@/app/product/productPage'
import React, { useEffect } from 'react'


function Page() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <ProductPage />
        </>
    )
}

export default Page
