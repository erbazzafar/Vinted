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
      if(!email || !password){
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

      if(response.status !== 200){
        console.log("Internal System Error");   
        return     
      }

      console.log("Login Successful");
      Cookies.set('token', response.data.token)
      Cookies.set("userId", response.data.data._id)
      router.push("/")

    } catch (error) {
      console.log("Error while loggin in: ", error);
    }
    console.log("Form submitted");
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Login to Affari Doro
      </h2>

      <form className="my-8 w-full" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email" placeholder="your@email.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password" placeholder="•••••••" type="password" />
        </LabelInputContainer>

        
        <button
          className="cursor-pointer bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Log In &rarr;
          <BottomGradient />
        </button>
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
