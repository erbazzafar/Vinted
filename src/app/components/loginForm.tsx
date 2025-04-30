"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginFormDemo() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please Enter all the fields!!");
        return
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`,
        { email, password }, // Body data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        console.log("Internal System Error");
        return
      }

      console.log("Login Successful");
      Cookies.set('token', response.data.token)
      Cookies.set("userId", response.data.data._id)
      if (response.data.data.image){
        Cookies.set("photourl", response.data.data.image)
        Cookies.set("photoType", "backend")
      } else {
        Cookies.set("photoType", "dummy")
      }
      

      router.push("/")

    } catch (error) {
      if (error.status === 401){
        toast.error(error.response.data.message || "Login failed")
      }
      console.log("Error while loggin in: ", error);
    }
    console.log("Form submitted");
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center rounded-none md:rounded-2xl p-6 md:p-10 shadow-xl bg-white dark:bg-zinc-900 transition-all duration-300">
      <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 dark:text-neutral-100 mb-2">
        Login to Affare Doro
      </h2>
      <p className="text-neutral-600 text-[12px] max-w-sm mt-2 mb-5 dark:text-neutral-300">
        Does not have an account, <span 
          className="text-[13px] text-gray-900 cursor-pointer font-semibold underline hover:rounded-sm hover:bg-gray-200 hover:text-black hover:text-[13px] hover:px-3 hover:pb-1"
          onClick={() => {router.push("/signup")}}> Sign Up </span>
      </p>


      <form className="w-full space-y-5" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="your@email.com"
            type="email"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            className="relative group/btn cursor-pointer bg-gradient-to-br from-black to-neutral-700 dark:from-zinc-800 dark:to-zinc-900 w-full text-white rounded-lg h-11 font-semibold shadow-inner hover:opacity-90 transition"
          >
            Log In &rarr;
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
