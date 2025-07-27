"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Tailored for Schools and Academy",
    subtitle: "Welcome to SchoolHive",
    description:
      "SchoolHive ERP is designed with Indian education standards and workflows in mind. Easily handle CBSE, ICSE, State board reports and statutory compliance—no customization headaches.",
    image: "/school/indigle-portal-women.png",
  },
  {
    title: "Complete Oversight & Control",
    subtitle: "Welcome to SchoolHive",
    description:
      "Get real-time visibility into all school operations from admissions and attendance to finances. Make informed decisions with powerful dashboards and analytics at your fingertips.",
    image: "/school/school-principle.png",
  },
  // Add more slides if needed
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24">
      {/* Background Blur Circles */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-tr from-teal-100 to-teal-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100 to-teal-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-10">
            <div
              className="space-y-4 transition-all duration-700"
              key={current}
              style={{
                opacity: 1,
                transform: "translateY(-20px)",
              }}
            >
              <p className="text-teal-600 uppercase text-sm font-semibold tracking-wider">
                {slides[current].subtitle}
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                {slides[current].title}
              </h1>
            </div>
            <p
              className="text-gray-600 text-lg leading-relaxed max-w-xl transition-all duration-700"
              style={{
                opacity: 1,
                transform: "translateY(0)",
              }}
            >
              {slides[current].description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://serp.indigle.com/onboarding/step-1"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#007A7A] to-[#0F766E] text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-[#0E9F6E] hover:to-[#046C4E] focus:ring-4 focus:ring-[#CCFBF1]/80 transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group">
                  <span className="relative flex items-center gap-2 z-10">
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0E9F6E] to-[#046C4E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </a>
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 border-2 border-[#0F766E] text-[#0F766E] bg-white text-base sm:text-lg font-semibold rounded-full hover:bg-[#F0FDFA] hover:border-[#007A7A] focus:ring-4 focus:ring-[#CCFBF1]/80 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out active:scale-95 group">
                <span className="flex items-center gap-2">
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-y-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="w-full flex justify-center">
            <div className="relative w-full aspect-[3/2] max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden group">
              <div className="absolute inset-0 transform transition duration-500 group-hover:scale-105">
                <Image
                  src={slides[current].image}
                  alt="School principal using dashboard"
                  fill
                  className="object-contain p-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Buttons */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous Slide"
            onClick={prevSlide}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg p-4 hover:bg-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            aria-label="Next Slide"
            onClick={nextSlide}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg p-4 hover:bg-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                current === index ? "bg-teal-600 w-8" : "bg-gray-300 w-3 hover:bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
}
