import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/">
          <img src="/q.png" alt="Logo" className="h-12 cursor-pointer" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-gray-600 hover:text-purple-700">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-purple-700">About Us</Link>
          <a href="#services" className="text-gray-600 hover:text-purple-700">Services</a>
        </nav>
        <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800">
          Contact Us
        </button>
      </div>
    </header>
  );
}
