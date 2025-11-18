import SignupFormDemo from '@/components/signup-form-demo';
import React from 'react';

function Page() {
  return (
    <div className="relative flex justify-center items-center min-h-screen w-full">
      {/* Background Beams */}

      {/* Signup Form */}
      <div className="my-[25px] sm:my-[50px] mx-[15px]">
        <SignupFormDemo />
      </div>
    </div>
  );
}

export default Page;
