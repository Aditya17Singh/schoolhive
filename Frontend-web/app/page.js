import Header from "@/components/header";
import HeroCarousel from "@/components/hero-caraousel";
import WhatOffer from "@/components/what-offer";
import WhyChooseHive from "@/components/why-choose-hive";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <HeroCarousel />
          <WhatOffer />
          <WhyChooseHive />
          <Footer />
        </div>
      </main>
    </>
  );
}
