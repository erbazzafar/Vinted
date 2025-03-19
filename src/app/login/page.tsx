import React from 'react';
import { BackgroundBeamsWithCollisionDemo } from '../components/backgroundBeam';
import LoginFormDemo from '../components/loginForm';

function Page() {
  return (
    <div className="relative flex justify-center items-center min-h-screen w-full">
      {/* Background Beams */}
      <BackgroundBeamsWithCollisionDemo />

      {/* Signup Form */}
      <div className="absolute ">
        <LoginFormDemo />
      </div>
    </div>
  );
}

export default Page;
