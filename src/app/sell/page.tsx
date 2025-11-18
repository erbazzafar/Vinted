import React, { Suspense } from 'react';
import ProductCard from '../components/productCard';

function Page() {
  return (
    <>
      <h1 className='mt-5 sm:mt-15 max-w-4xl text-3xl font-bold mx-[15px] mb-[20px] text-center'>
        Sell your Item
      </h1>

      <Suspense fallback={<p className="text-center text-gray-600">Loading product form...</p>}>
        <ProductCard />
      </Suspense>
    </>
  );
}

export default Page;