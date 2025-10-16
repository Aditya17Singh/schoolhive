"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="flex flex-row items-center justify-between 
        py-3 max-w-screen-2xl mx-auto px-6 w-full 
        sticky top-0 left-0 right-0 z-[60] 
        border-b border-gray-100 
        bg-white/80 backdrop-blur-sm 
        transition-all duration-300">
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

      {/* Desktop Menu */}
      <div className="lg:flex flex-row flex-1 hidden items-center justify-center space-x-1 font-bold">
        <Link href="/" className="px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors rounded-full">
          Home
        </Link>
        <Link href="/pricing" className="px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors rounded-full">
          Services
        </Link>
        <Link href="/school-erp" className="px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors rounded-full">
          School ERP
        </Link>
        <Link href="/blog" className="px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors rounded-full">
          Blog
        </Link>
        <Link href="/about" className="px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors rounded-full">
          About Us
        </Link>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden lg:flex flex-row items-center gap-2">
        <Link href="/schools/register/step-1" target="_blank">
          <button className="inline-flex items-center justify-center gap-2 shadow h-9 px-5 py-2.5 text-sm font-medium text-white bg-[#003d3d] hover:bg-[#003d3d]/90 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 border border-green-200 hover:border-green-300">
            Get Started
          </button>
        </Link>
        <Link href="/login" target="_blank">
          <button className="inline-flex items-center justify-center gap-2 shadow h-9 px-5 py-2.5 text-sm font-medium text-white bg-[#244b55] hover:bg-[#003d3d]/90 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 border border-green-200 hover:border-green-300">
            Login
          </button>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-5">
          <span
            className={`absolute w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isOpen ? "rotate-45 top-2" : "top-0"
            }`}
          />
          <span
            className={`absolute w-6 h-0.5 bg-gray-700 transition-opacity duration-300 top-2 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isOpen ? "-rotate-45 top-2" : "top-4"
            }`}
          />
        </div>
      </button>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-md flex flex-col items-center transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        {/* Links */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-gray-700 hover:text-green-600 text-sm font-semibold py-2"
        >
          Home
        </Link>
        <Link
          href="/pricing"
          onClick={() => setIsOpen(false)}
          className="text-gray-700 hover:text-green-600 text-sm font-semibold py-2"
        >
          Services
        </Link>
        <Link
          href="/school-erp"
          onClick={() => setIsOpen(false)}
          className="text-gray-700 hover:text-green-600 text-sm font-semibold py-2"
        >
          School ERP
        </Link>
        <Link
          href="/blog"
          onClick={() => setIsOpen(false)}
          className="text-gray-700 hover:text-green-600 text-sm font-semibold py-2"
        >
          Blog
        </Link>
        <Link
          href="/about"
          onClick={() => setIsOpen(false)}
          className="text-gray-700 hover:text-green-600 text-sm font-semibold py-2"
        >
          About Us
        </Link>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-10/12 pt-3 border-t border-gray-100 mt-2">
          <Link href="/schools/register/step-1" target="_blank">
            <button className="w-full py-2 bg-[#003d3d] text-white rounded-full text-sm font-medium hover:bg-[#003d3d]/90 transition">
              Get Started
            </button>
          </Link>
          <Link href="/login" target="_blank">
            <button className="w-full py-2 bg-[#244b55] text-white rounded-full text-sm font-medium hover:bg-[#003d3d]/90 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
