// components/WhyChooseHive.jsx
import Image from "next/image";

const WhyChooseHive = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20">
      {/* Background Gradient Blob */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100 to-teal-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Image */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-md h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] lg:max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden group">
            <div className="absolute inset-0 transform transition duration-500 group-hover:scale-105">
              <Image
                src="/school/why-Indigle.png"
                alt="Illustration of ERP user working"
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-teal-600 uppercase text-sm font-semibold tracking-wide mb-2">
              What makes us different
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              Why Choose SchoolHive ERP?
            </h2>
          </div>

          {/* Features List */}
          <ul className="space-y-6">
            <li className="flex items-start gap-4 bg-white rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
                  {/* Headset Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                    <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                  Prompt Support
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Our highly responsive support team ensures youre always in good hands.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4 bg-white rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
                  {/* Dollar Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="12" x2="12" y1="2" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                  No Hidden Charges
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Transparent pricing. No surprise fees—what you see is what you get.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4 bg-white rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
                  {/* Settings Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                  Customised According to You
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  We tailor our ERP to fit your needs if the requested feature is feasible.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4 bg-white rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
                  {/* Database Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                    <path d="M3 12A9 3 0 0 0 21 12" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                  Data Entry Support
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Our team will set up your institutes data—including students—FREE of charge.
                </p>
              </div>
            </li>
          </ul>

          {/* CTA Button */}
          <div>
            <a
              target="_blank"
              href="https://serp.indigle.com/onboarding/step-1"
            >
              <button
                type="button"
                className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-full shadow-lg hover:from-teal-700 hover:to-teal-800 transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseHive;
