import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex flex-row items-center justify-between py-3 max-w-screen-2xl mx-auto px-6 w-full sticky z-[60] border-b border-gray-100 lg:relative top-0 left-0 right-0 bg-white/80 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3 group">
        <Image
          alt="School Hive"
          src="/logo.png"
          width={40}
          height={40}
          className="rounded-xl border border-gray-100 transition-transform duration-300 group-hover:scale-105"
        />
        <span className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          School Hive
        </span>
      </Link>

      {/* Menu Links */}
      <div className="lg:flex flex-row flex-1 hidden items-center justify-center space-x-1 font-bold">
        <Link href="/" className="relative px-4 py-2 text-sm text-gray-600 transition-colors duration-200 rounded-full hover:text-green-600">
          Home
        </Link>
        <Link href="/pricing" className="relative px-4 py-2 text-sm text-gray-600 transition-colors duration-200 rounded-full hover:text-green-600">
          Services
        </Link>
        <Link href="/school-erp" className="relative px-4 py-2 text-sm text-gray-600 transition-colors duration-200 rounded-full hover:text-green-600">
          School ERP
        </Link>
        <Link href="/blog" className="relative px-4 py-2 text-sm text-gray-600 transition-colors duration-200 rounded-full hover:text-green-600">
          Blog
        </Link>
        <Link href="/about" className="relative px-4 py-2 text-sm text-gray-600 transition-colors duration-200 rounded-full hover:text-green-600">
          About Us
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center gap-2">
        <Link href="/schools/register/step-1" target="_blank" className="hidden lg:block">
          <button className="inline-flex items-center justify-center gap-2 shadow h-9 group relative px-5 py-2.5 text-sm font-medium text-white bg-[#003d3d] hover:bg-[#003d3d]/90 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 border border-green-200 hover:border-green-300">
            <span>Get Started</span>
          </button>
        </Link>
        <Link href="/login" target="_blank" className="hidden lg:block">
          <button className="inline-flex items-center justify-center gap-2 shadow h-9 group relative px-5 py-2.5 text-sm font-medium text-white bg-[#244b55] hover:bg-[#003d3d]/90 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 border border-green-200 hover:border-green-300">
            <span>Login</span>
          </button>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Toggle menu">
        <div className="relative w-6 h-5">
          <span className="absolute w-6 h-0.5 bg-gray-600"></span>
          <span className="absolute w-6 h-0.5 bg-gray-600 top-2"></span>
          <span className="absolute w-6 h-0.5 bg-gray-600 top-4"></span>
        </div>
      </button>
    </nav>
  );
}
