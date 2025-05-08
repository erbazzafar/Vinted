import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#EBEBEB] text-gray-800 py-6 text-sm max-w-full">
      {/* Grid Section */}
      <div className="ml-15 mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Logo - Centered and Aligned */}
        <div className="flex items-center justify-center md:justify-start">
          <Link href="/">
            <Image
              src="/darkLogo.png"
              alt="Logo"
              height={120}
              width={120}
              className="mb-3"
              unoptimized
            />
          </Link>
        </div>

        {/* Explore */}
        <div className="w-fit">
          <h3 className="font-semibold mb-2">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-and-condition" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Discover */}
        <div className="w-fit">
          <h3 className="font-semibold mb-2">Discover</h3>
          <ul className="space-y-2">
            <li><Link href="/how-it-works">How it works</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="w-fit">
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:contact@affaredoro.com">Help Center</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t border-gray-300 mt-6" />

      {/* Bottom Flex Area: Socials + App Links */}
      <div className="ml-15 mr-40 mx-auto flex flex-col md:flex-row justify-between items-center mt-4">
        {/* Socials */}
        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" className="hover:text-blue-600">
            <Facebook size={20} />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500">
            <Instagram size={20} />
          </Link>
          <Link href="https://x.com" target="_blank" className="hover:text-blue-500">
            <Linkedin size={20} />
          </Link>
        </div>

        {/* App Store Links */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="https://www.apple.com/app-store/" target="_blank">
            <Image
              src="/appstorelogo.jpg"
              alt="App Store"
              width={128}
              height={36}
              className="h-9 w-32"
              unoptimized
            />
          </Link>
          <Link href="https://play.google.com/store" target="_blank">
            <Image
              src="/googleplaylogo.jpg"
              alt="Google Play"
              width={128}
              height={36}
              className="h-9 w-32"
              unoptimized
            />
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-3" />

      {/* Copyright */}
      <p className="text-center font-semibold mt-3 ">© 2025 Affare Doro. All rights reserved.</p>
    </footer>
  );
};

export default Footer;