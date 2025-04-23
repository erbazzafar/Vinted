"use client"

import React, {Suspense} from 'react'
import Filter from '../components/filter'

function Page() {
    
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <Filter/>
        </Suspense>  
    )
}

export default Page
