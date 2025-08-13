"use client";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import OtpInput from 'react-otp-input';


export default function LoginFormDemo() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [openOTP, setOpenOTP] = useState(false);
  

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
      if (response.data.data.image) {
        Cookies.set("photourl", response.data.data.image)
        Cookies.set("photoType", "backend")
      } else {
        Cookies.set("photoType", "dummy")
      }


      router.push("/")

    } catch (error) {
      if (error.status === 401) {
        toast.error(error.response.data.message || "Login failed")
      } else if (error.response?.status === 402) {
        toast.error("Please verify your email before logging in");
        setOpenOTP(true);
        
      }
      console.log("Error while loggin in: ", error);
    }
    console.log("Form submitted");
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!forgotPasswordEmail) {
        toast.error("Please enter your email address");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/checkData`,
        { email: forgotPasswordEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP has been sent to your email");
        setShowForgotPasswordModal(false);
        setShowOtpModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);
  };

  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/verifyOTP`,
        {
          email: forgotPasswordEmail,
          otp: otpString
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP verified successfully");
        setShowOtpModal(false);
        setShowResetPasswordModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/updatePassword?email=${forgotPasswordEmail}`,
        {
          //  email: forgotPasswordEmail,
          // otp: otp,
          password: newPassword
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully");
        setShowResetPasswordModal(false);
        // Reset all states
        setOtp(["", "", "", "", "", ""])
        setNewPassword("")
        setConfirmPassword("")
        setForgotPasswordEmail("")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      console.error("Error resetting password:", error);
    }
  };

  return (
    <>
    <div className="max-w-2xl mx-auto flex flex-col items-center rounded-xl p-4 md:p-8 bg-[#EBEBEB] dark:bg-black
      border border-gray-200 dark:border-zinc-800 shadow-lg dark:shadow-[0_4px_32px_0_rgba(0,0,0,0.45)] transition-all">
      <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 dark:text-neutral-100 mb-2">
        Login to Affare Doro
      </h2>
      <p className="text-neutral-600 text-[12px] max-w-sm mt-2 mb-5 dark:text-neutral-300">
        Does not have an account,{" "}
        <span
          className="text-[13px] text-gray-900 cursor-pointer font-semibold underline hover:rounded-sm hover:bg-gray-200 hover:text-black hover:text-[13px] hover:px-3 hover:pb-1"
          onClick={() => {
            router.push("/signup");
          }}
        >
          {" "}
          Sign Up{" "}
        </span>
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
          <span
            className="text-red-500 text-sm cursor-pointer text-right"
            onClick={() => setShowForgotPasswordModal(true)}
          >
            Forgot Password?
          </span>
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

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-slideIn">
            <div className="flex justify-end">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 mb-4">
                <Image
                  src="/forgot.png"
                  alt="Forgot Password"
                  width={50}
                  height={50}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Forgot Your Password
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
              Enter your email address and we'll send you a code to reset your password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <LabelInputContainer>
                <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </LabelInputContainer>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-900 cursor-pointer to-gray-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Send Reset Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-slideIn">
            <div className="flex justify-end">
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Enter Verification Code
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
              Please enter the 6-digit code sent to your email.
            </p>
            <form onSubmit={handleOtpVerification}>
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                      return null;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-900 dark:focus:border-gray-300 focus:outline-none transition-colors bg-white dark:bg-zinc-800"
                  />
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-900 cursor-pointer to-gray-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Verify Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-slideIn">
            <div className="flex justify-end">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Reset Your Password
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
              Please enter your new password.
            </p>
            <form onSubmit={handleResetPassword}>
              <LabelInputContainer>
                <Label htmlFor="new-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showNewPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </LabelInputContainer>
              <LabelInputContainer className="mt-4">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </LabelInputContainer>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-900 cursor-pointer to-gray-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    <OTPModal open={openOTP} setOpen={setOpenOTP} email={email} router={router} />
    </>
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

const OTPModal = ({ open, setOpen, email, router }) => {

  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);

  const verifyOTP = async () => {
    if (otp === "" || otp.length != 6) {
      return toast.error("Enter Valid OTP");
    };
    try {
      setLoader(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/verifyOtp`, { email, otp });
      console.log("response", response);

      Cookies.set('token', response.data.token)
      Cookies.set("userId", response.data.data._id)
      Cookies.set("photourl", response.data.data?.image)
      Cookies.set("photoType", "dummy")


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


// Animations for modals
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`;