"use client";

import Link from "next/link";
import * as Dialog from '@radix-ui/react-dialog';
import { X, Lock, Check,CirclePlus } from 'lucide-react';

export default function SectionDialog({
  show,
  onClose,
  selectedSections,
  compulsorySections,
  allSections,
  handleRemoveSection,
  handleToggleSection,
  handleSaveSections,
}) {
  return (
    <Dialog.Root open={show} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg"
        >
          <Dialog.Title className="text-lg font-semibold">
            Add or Remove Sections
          </Dialog.Title>

          <div className="flex flex-col gap-6 py-4">
            {/* Selected Sections */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Selected Sections
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSections.map((sec) => (
                  <span
                    key={sec}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {sec}
                    {compulsorySections.includes(sec) ? (
                      <Lock className="h-3 w-3 ml-1 text-blue-600" />
                    ) : (
                      <button
                        onClick={() => handleRemoveSection(sec)}
                        className="hover:text-blue-600 ml-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Sections */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">Available Sections</h3>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  = Compulsory
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {allSections.map((sec) => {
                  const isSelected = selectedSections.includes(sec);
                  const isCompulsory = compulsorySections.includes(sec);
                  return (
                    <button
                      key={sec}
                      onClick={() => handleToggleSection(sec)}
                      disabled={isCompulsory}
                      className={`p-3 rounded-lg text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border-blue-500'
                          : 'border-gray-200 hover:border-blue-500'
                      } ${isCompulsory ? 'cursor-default text-blue-700' : ''}`}
                    >
                      {sec}
                      {isCompulsory && <Lock className="w-3 h-3" />}
                      {isSelected && !isCompulsory && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Dialog.Close asChild>
              <button className="border bg-white text-sm px-4 py-2 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSaveSections}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          {/* Close Icon */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}