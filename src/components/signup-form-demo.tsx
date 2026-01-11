"use client";

import axios from "axios";
import Link from 'next/link';
import { toast } from "sonner";
import Cookies from "js-cookie";
import OtpInput from 'react-otp-input';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { updateUserLoggedIn, updateUserToken } from "@/features/features";
import { requestFCMToken } from "@/lib/fcm-utils";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firbaseConfig";

export default function SignupFormDemo() {

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [openOTP, setOpenOTP] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please Enter the Email and Password");
        return
      }
      if (!username) {
        toast.error("Please Enter the Username");
        return
      }
      if (!checkTerms) {
        toast.error("Please Accept the Terms and Conditions");
        return
      }
      const fullName = [firstname, lastname].filter(Boolean).join(" ").trim();
      if (!fullName) {
        toast.error("Please Enter the First and Last Name");
        return
      }

      // Request FCM token
      const fcmToken = await requestFCMToken();

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", username);
      formData.append("fullName", fullName);
      formData.append("first_name", firstname);
      formData.append("last_name", lastname);
      if (fcmToken) {
        formData.append("fcmToken", fcmToken);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        console.log("Internal System Error");
        return
      };

      setOpenOTP(true);
      toast.success("Check your Email for OTP");
      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
      console.log("SignUp failed", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Request FCM token
      const fcmToken = await requestFCMToken();
      
      const data = await signInWithPopup(auth, provider)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/registerSocial`,
        {
          email: data.user.email,
          username: data.user.displayName,
          image: data.user.photoURL,
          fcmToken: fcmToken || undefined
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("data: ", data);
      console.log("Response:", response);


      if (response.status !== 200) {
        console.log("Error Getting the Response");
        return
      }

      Cookies.set("user-token", response.data.token)
      console.log("Token", response.data.token);
      Cookies.set("photourl", response.data.data?.image || "")
      Cookies.set("googlePhoto", data?.user?.photoURL)
      Cookies.set("photoType", "google")
      Cookies.set("userId", response.data.data._id)

      router.push('/')

    } catch (error) {
      console.log("Error Signing In with Google", error);

    }
  };


  return (
    <>
      <div className="max-w-2xl mx-auto flex flex-col items-center rounded-xl p-4 md:p-8 bg-[#EBEBEB] dark:bg-black
      border border-gray-200 dark:border-zinc-800 shadow-lg dark:shadow-[0_4px_32px_0_rgba(0,0,0,0.45)] transition-all">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-1">
          Welcome to Affare Doro
        </h2>
        <p className="text-neutral-600 text-[13px] max-w-sm mt-2 dark:text-neutral-300">
          Already have an account,{" "}
          <span
            className="text-[13px] text-gray-900 cursor-pointer font-semibold underline hover:rounded-sm hover:bg-gray-200 hover:text-black hover:text-[13px] hover:px-3 hover:pb-1"
            onClick={() => { router.push("/login") }}> Login </span>
        </p>

        <form className="my-8 w-full" onSubmit={handleSubmit}>
          <div className="mb-6 flex justify-center">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center cursor-pointer border border-dashed border-neutral-400 dark:border-neutral-600 overflow-hidden"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-neutral-600 dark:text-neutral-400 text-center px-2">
                  Tap to upload
                </span>
              )}
            </label>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              placeholder="tylerdurden"
              type="text"
            />
          </LabelInputContainer>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                id="firstname" placeholder="Tyler" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
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
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </LabelInputContainer>
          <div className="flex items-center mb-4">
            <input type="checkbox" id="terms" checked={checkTerms} onChange={(e) => setCheckTerms(e.target.checked)} className="mr-2" />
            <label htmlFor="terms" className="text-sm text-neutral-700 dark:text-neutral-300">
              By signing up, you agree to our <Link href="/terms-and-condition" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>
          <button
            className="cursor-pointer bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-md dark:shadow-[0px_2px_8px_0px_var(--zinc-900)]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="cursor-pointer relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] border border-gray-200 dark:border-zinc-800"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Google
              </span>
            </button>
          </div>
        </form>
      </div>
      <OTPModal open={openOTP} setOpen={setOpenOTP} email={email} router={router} dispatch={dispatch} />
    </>
  );
};

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

const OTPModal = ({ open, setOpen, email, router, dispatch }) => {

  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);

  const verifyOTP = async () => {
    if (otp === "" || otp.length != 6) {
      return toast.error("Enter Valid OTP");
    };
    try {
      setLoader(true);
      // Request FCM token
      const fcmToken = await requestFCMToken();
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/verifyOtp`, 
        { 
          email, 
          otp,
          fcmToken: fcmToken || undefined
        }
      );
      console.log("response", response);

      dispatch(updateUserLoggedIn(true));
      dispatch(updateUserToken(response.data.token));

      Cookies.set("user-token", response.data.token);
      Cookies.set("userId", response.data.data._id);

      if (response.data.data?.image) {
        Cookies.set("photourl", response.data.data.image);
        Cookies.set("photoType", "backend");
      } else {
        Cookies.remove("photourl");
        Cookies.set("photoType", "dummy");
      }

      localStorage.setItem("userEmail", response.data.data.email);
      localStorage.setItem("userFullName", response.data.data.fullName || "");
      localStorage.setItem("userUsername", response.data.data.username || "");

      setOpen(false);
      router.push("/")

    } catch (error) {
      console.log("Error in verifyOTP", error);
      return toast.error(error?.response?.data?.message || "Network Error");
    } finally {
      setLoader(false);
    }
  }

  if (open) {
    return (
      <div className="fixed top-0 left-0 w-full min-h-[100vh] bg-[rgba(0,0,0,0.8)] flex justify-center items-center" onClick={() => setOpen(false)}>
        <div
          className="w-full sm:w-[350px] min-h-[250px] rounded-[10px] bg-white p-[20px]"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-center text-[20px] font-[700] mb-[10px]">Verify Your Email</p>
          <hr />
          <div className="flex flex-col justify-center items-center gap-[20px] pt-[25px]">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputStyle={{ backgroundColor: 'rgba(0,0,0,0.1)', width: 40, height: 50 }}
              renderSeparator={<span>&nbsp;&nbsp;</span>}
              renderInput={(props) => <input {...props} />}
            />
            {loader ? (
              <button className="w-full h-[40px] rounded-[13px] bg-gray-700 text-white font-[600]">Loading...</button>
            ) : (
              <button className="w-full h-[40px] rounded-[13px] bg-black text-white font-[600]" onClick={verifyOTP}>Verify</button>
            )}
            <p className="text-[13px] text-gray-500 text-center">Check your email address and write OTP</p>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
};
