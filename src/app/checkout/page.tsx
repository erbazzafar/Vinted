// /checkout/page.tsx
"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CheckoutComponent = dynamic(() => import("../components/checkOut"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}
