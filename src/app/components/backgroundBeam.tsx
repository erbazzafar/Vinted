import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function BackgroundBeamsWithCollisionDemo() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <BackgroundBeamsWithCollision />
    </div>
  );
}
