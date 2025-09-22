import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">
        
        {/* Logo + Copy + Socials */}
        <div>
          <div className="bg-white p-2 rounded-lg inline-block mb-6">
            <img src="/q.png" alt="Logo" className="h-16" />
          </div>
          <p className="text-sm mb-1">&copy; 2025 Quality</p>
          <p className="text-sm mb-6">All rights reserved</p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              <FaInstagram className="text-white text-lg" />
            </a>
            <a
              href="#"
              className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              <FaLinkedin className="text-white text-lg" />
            </a>
            <a
              href="#"
              className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              <FaXTwitter className="text-white text-lg" />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:underline">About us</a>
            </li>
            <li>
              <a href="/people" className="hover:underline">People</a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">Contact us</a>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <form className="relative">
            <textarea
              placeholder="Your Message"
              className="w-full h-28 bg-white/20 rounded-lg p-3 pr-10 text-white placeholder-white/70 focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="absolute bottom-3 right-3 text-white hover:opacity-80"
            >
              <IoSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
