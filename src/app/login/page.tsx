import React from 'react';
import { BackgroundBeamsWithCollisionDemo } from '../components/backgroundBeam';
import LoginFormDemo from '../components/loginForm';

function Page() {
  return (
    <div className="relative flex justify-center items-center min-h-screen w-full">
      {/* Background Beams */}

      {/* Login Form */}
      <div className="absolute inset-0 flex items-center justify-center px-2 py-8 sm:py-0">
        <LoginFormDemo />
      </div>
    </div>
  );
}

export default Page;