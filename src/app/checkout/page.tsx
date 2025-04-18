"use client";

import React, { Suspense } from "react";
import CheckOut from "../components/checkOut";

function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckOut />
    </Suspense>
  );
}

export default Page;
