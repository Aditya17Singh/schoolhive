'use client';

import { Suspense } from "react";
import Step3PageContent from "./Step3PageContent";

export default function Step3Page() {
  return (
    <Suspense fallback={<div>Loading step 2...</div>}>
      <Step3PageContent />
    </Suspense>
  );
}
