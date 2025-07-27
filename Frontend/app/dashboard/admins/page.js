'use client';

import Admins from "@/components/admins";

export default function Home() {
  return (
     <div className="py-3 px-4">
      <h1 className="text-xl font-bold mb-4">Admins</h1>
      <Admins />
    </div>
  );
}
