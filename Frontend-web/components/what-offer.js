import React from "react";

const features = [
  { title: "Mobile App", icon: "smartphone" },
  { title: "Online Classes", icon: "video" },
  { title: "Automatic Backups", icon: "database" },
  { title: "Security", icon: "shield" },
  { title: "No Hidden Charges", icon: "dollar-sign" },
  { title: "Easy Administration", icon: "settings" },
  { title: "Customizable User Roles", icon: "users" },
  { title: "Students' Dashboard", icon: "graduation-cap" },
  { title: "Parents' Dashboard", icon: "circle-user" },
  { title: "Teachers' Dashboard", icon: "book-open" },
  { title: "Front Office", icon: "building2" },
  { title: "Library Manager", icon: "library" },
  { title: "Best Fee Management", icon: "wallet" },
  { title: "Student 360°", icon: "user-check" },
];

const WhatWeOffer = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6 sm:px-12 lg:px-24 text-center">
      <p className="text-teal-600 uppercase tracking-wide font-semibold text-sm mb-2">
        WE PROVIDE ALL THE FEATURES YOULL NEED
      </p>
      <h2 className="text-4xl font-extrabold text-teal-800 mb-12">What We Offer</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center 
                       hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <i className={`lucide lucide-${feature.icon} w-12 h-12 text-teal-600`} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeOffer;
