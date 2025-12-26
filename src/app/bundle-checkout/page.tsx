import { Suspense } from 'react'
import BundleCheckout from './bundleCheckout'

function Page() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto mt-8 py-10 px-5 text-center">
                <p className="text-gray-600">Loading checkout...</p>
            </div>
        }>
            <BundleCheckout />
        </Suspense>
    )
}

export default Page

