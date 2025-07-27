"use client";

import { useState } from "react"; // <- named import, not default
// or: import React, { useState } from "react";

export default function PromoteStudents() {
  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [futureClass, setFutureClass] = useState("");
  const [futureSection, setFutureSection] = useState("");

  return (
    <div className="flex justify-between items-center w-full gap-4">
      {/* Left side */}
      <div className="flex gap-3 items-center">
        <DropdownButton label="Select Current Class" value={currentClass} setValue={setCurrentClass} />
        <DropdownButton label="Select Current Section" value={currentSection} setValue={setCurrentSection} />
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {/* Right side */}
      <div className="flex gap-3 items-center">
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        >
          Promote selected
        </button>
        <DropdownButton label="Select Future Class" value={futureClass} setValue={setFutureClass} />
        <DropdownButton label="Select Future Section" value={futureSection} setValue={setFutureSection} />
      </div>
    </div>
  );
}

function DropdownButton({ label, value, setValue }) {
  return (
    <button
      type="button"
      className="flex h-9 min-w-[150px] items-center justify-between rounded-md bg-[#F7F8FA] border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
      onClick={() => setValue?.("example")} // just to show it works
    >
      <span>{value || label}</span>
      {/* <ChevronDownIcon className="h-4 w-4 opacity-50" /> */}
    </button>
  );
}
