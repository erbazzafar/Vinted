import SignupFormDemo from '@/components/signup-form-demo';
import React from 'react';
import { BackgroundBeamsWithCollisionDemo } from '../components/backgroundBeam';

function Page() {
  return (
    <div className="relative flex justify-center items-center min-h-screen w-full">
      {/* Background Beams */}
      <BackgroundBeamsWithCollisionDemo />

      {/* Signup Form */}
      <div className="absolute ">
        <SignupFormDemo />
      </div>
    </div>
  );
}

export default Page;
