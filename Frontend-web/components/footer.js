import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white relative w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

          {/* Company Info */}
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full rotate-6 opacity-30"></div>
                <div className="absolute inset-0 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Indigle Solutions"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Hive School ERP</h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-1"></div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Mumbai, India
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +91-8375004856
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                support@hive.com
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Mon - Fri: 8:00 AM - 4:00 PM
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
                Quick Links
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Services", href: "/services" },
                  { name: "Blog", href: "/blog" },
                  { name: "Demo Website", href: "https://school.indigle.com" },
                  { name: "Privacy Policy", href: "/privacy" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center gap-2 group p-1.5 rounded-lg hover:bg-blue-50"
                    >
                      <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                        {/* Add icons per link if needed */}
                      </div>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full md:col-span-2 lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="w-full">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-600 text-xs mb-3">Get the latest updates on school events, news, and more.</p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-500 flex items-center justify-center gap-2 text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
