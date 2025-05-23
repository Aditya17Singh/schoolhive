'use client';

import Admins from "@/components/admins";

export default function Home() {
  return (
     <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admins</h1>
      <Admins />
    </div>
  );
}
