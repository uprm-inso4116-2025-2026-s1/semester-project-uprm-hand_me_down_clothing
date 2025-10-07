import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#e7dbc8] text-[#abc8c1] p-2">
      <div className="bg-white mx-auto px-6 py-5 grid grid-cols-1 md:grid-cols-4 gap-8 shadow-sm">
        <div className="flex justify-center md:justify-start">
          <Image
            src="/images/logo.png"
            alt="Hand Me Down logo"
            width={180}
            height={180}
            className="w-80 h-50 object-contain rounded-md"
          />
        </div>

        <div>
          <h3 className="text-2xl font-bold py-4 mb-4 text-center md:text-left">
            Contact Us!
          </h3>
          <ul className="italic font-bold space-y-2 test-lg text-gray-800 text-center md:text-left">
            <li>email@email.com</li>
            <li>(xxx)xxx-xxxx</li>
            <li>Mayagüez, PR</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold py-4 mb-4 text-center md:text-left">
            Site Information
          </h3>
          <ul className="italic font-bold space-y-2 test-lg text-gray-800 text-center md:text-left">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookies</li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-2xl py-4 font-bold mb-4">Social Media</h3>
          <div className="flex gap-4 mb-6">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#d7b1b1] hover:bg-gray-400 transition inline-flex items-center justify-center"
              aria-label="Twitter"
            >
              <FaDiscord className="text-black w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#d7b1b1] hover:bg-gray-400 transition inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="text-black w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#d7b1b1] hover:bg-gray-400 transition inline-flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-black w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              // href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#d7b1b1] hover:bg-gray-400 transition inline-flex items-center justify-center"
            >
              <FaFacebook className="text-black w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} Hand Me Down. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
