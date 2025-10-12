'use client';

import { Suspense } from "react";
import Step2PageContent from "./Step2PageContent";

export default function Step2Page() {
  return (
    <Suspense fallback={<div>Loading step 2...</div>}>
      <Step2PageContent />
    </Suspense>
  );
}
