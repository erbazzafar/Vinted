import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#EBEBEB] text-gray-800 py-6 text-sm w-full">
      {/* Grid Section */}
      <div className="px-4 md:px-20 mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
        {/* Logo */}
        <div className="flex justify-start md:justify-start">
          <Link href="/">
            <Image
              src="/Affre Doro Dark Logo-min.png"
              alt="Logo"
              height={120}
              width={120}
              className="mb-3"
              unoptimized
            />
          </Link>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-[15px] font-[700] mb-2">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-and-condition" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Discover */}
        <div>
          <h3 className="text-[15px] font-[700] mb-2">Discover</h3>
          <ul className="space-y-2">
            <li><Link href="/how-it-works">How it works</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[15px] font-[700] mb-2">Contact</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:contact@affaredoro.com" className="hover:underline">
                Email: contact@affaredoro.com
              </a>
            </li>
            <li>
              <a href="https://wa.me/971506570211" target="_blank" className="hover:underline">
                WhatsApp: +971 506570211
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t border-gray-300 mt-6" />

      {/* Bottom Flex Area */}
      <div className="px-4 md:px-20 mx-auto flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
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
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 mt-2 md:mt-0">
          <Link href="https://apps.apple.com/pk/app/affare-doro/id6747271120" target="_blank">
            <Image
              src="/appstorelogo.jpg"
              alt="App Store"
              width={128}
              height={36}
              className="h-9 w-32"
              unoptimized
            />
          </Link>
          <Link href="https://play.google.com/store/apps/details?id=com.affaredoro" target="_blank">
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
      <p className="text-center font-semibold mt-3">
        © 2025 Affare Doro. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;