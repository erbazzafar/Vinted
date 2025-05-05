"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandFacebook,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie"
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firbaseConfig";
import { toast } from "sonner";


export default function SignupFormDemo() {
  const router = useRouter();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password){
        console.log("Please Enter the Email and Password");
        return
      }
      const userName = firstname+" "+lastname;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/create`,
        { 
          email,
          password,
          username: userName
        }, // Body data
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

      console.log("Sign Up Successful");
      console.log("Response", response)
      Cookies.set('token', response.data.token)
      Cookies.set("userId", response.data.data._id)
      Cookies.set("photourl", response.data.data?.image)
      Cookies.set("photoType", "dummy")


      router.push("/")
    } catch (error) {
      if(error?.status === 409){
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
      console.log("SignUp failed", error);
    }
  };

  const handleGoogleSignIn = async() => {
    try {
      const data =await signInWithPopup(auth, provider)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/registerSocial`,
        {
          email: data.user.email,
          username: data.user.displayName,
          image: data.user.photoURL 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("data: ",data);
      console.log("Response:",response);
      

      if(response.status !== 200){
        console.log("Error Getting the Response");
        return        
      }

      Cookies.set("token", response.data.token)
      console.log("Token",response.data.token);
      Cookies.set("photourl", response.data.data?.image || "")
      Cookies.set("googlePhoto", data?.user?.photoURL)
      Cookies.set("photoType", "google")
      Cookies.set("userId", response.data.data._id)
      
      router.push('/')

    } catch (error) {
      console.log("Error Signing In with Google", error);
      
    }
  };


  const handleFacebookSignIn = async (e:any) => {

  }


  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Affare Doro 
      </h2>
      <p className="text-neutral-600 text-[12px] max-w-sm mt-2 dark:text-neutral-300">
        Already have an account, <span 
          className="text-[13px] text-gray-900 cursor-pointer font-semibold underline hover:rounded-sm hover:bg-gray-200 hover:text-black hover:text-[13px] hover:px-3 hover:pb-1"
          onClick={() => {router.push("/login")}}> Login </span>
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input 
              value={firstname}
              onChange={(e)=>setFirstname(e.target.value)}
              id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input 
              value={lastname}
              onChange={(e)=>setLastname(e.target.value)}
              id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
        <button
            className="cursor-pointer relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
          </button>
          <button
            className="cursor-pointer relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            onClick={handleFacebookSignIn}
          >
            <IconBrandFacebook className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Facebook
            </span>
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
