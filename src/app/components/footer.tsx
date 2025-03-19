import { Facebook, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-15 bg-[#EBEBEB] shadow-md rounded-xl overflow-hidden py-6 px-6 text-gray-600 text-md">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8 text-left border-b-2">
          {/* Vinted Section */}
          <div>
            <h3 className="font-semibold text-gray-800">Brand Name</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/jobs">Jobs</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
              <li><Link href="/press">Press</Link></li>
              <li><Link href="/advertising">Advertising</Link></li>
            </ul>
          </div>

          {/* Discover Section */}
          <div>
            <h3 className="font-semibold text-gray-800">Discover</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/mobile-apps">Mobile apps</Link></li>
              <li><Link href="/infoboard">Infoboard</Link></li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="font-semibold text-gray-800">Help</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href="/help-center">Help Center</Link></li>
              <li><Link href="/selling">Selling</Link></li>
              <li><Link href="/buying">Buying</Link></li>
              <li><Link href="/trust-and-safety">Trust and Safety</Link></li>
            </ul>
          </div>
        </div>

       {/* Social Icons and App Store Links */}
        <div className="mt-6 flex justify-between space-x-6 flex-wrap ">
          {/* Social Icons */}
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" className="text-gray-500 hover:text-blue-600">
              <Facebook size={24} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="text-gray-500 hover:text-blue-700">
              <Linkedin size={24} />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="text-gray-500 hover:text-pink-500">
              <Instagram size={24} />
            </Link>
          </div>

          {/* App Store Links */}
          <div className="flex items-right space-x-2">
            <Link href="https://www.apple.com/app-store/" target="_blank">
              <img src="/iplay.png" alt="App Store" className="h-9 w-32" />
            </Link>
            <Link href="https://play.google.com/store" target="_blank">
              <img src="/iplay.png" alt="Google Play" className="h-9 w-32" />
            </Link>
          </div>
        </div>

        
        {/* Bottom Section */}
        <div className="mt-6 border-t pt-4 flex flex-col md:flex-row justify-between items-center text-center">
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link>
            <Link href="/cookie-settings" className="hover:underline">Cookie Settings</Link>
            <Link href="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;