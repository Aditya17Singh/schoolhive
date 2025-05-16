import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

const SUBJECT_CATEGORIES = {
  Core: [
    'English', 'Hindi', 'Regional Language', 'Environmental Studies (EVS)',
    'Moral Science/Value Education', 'General Knowledge (GK)', 'Physical Education',
    'Computer Science', 'Information Technology', 'Business Studies', 'Accountancy',
    'Economics', 'Mathematics', 'Science', 'Social Science', 'History', 'Geography',
    'Political Science', 'Biology', 'Physics', 'Chemistry',
  ],
  Creative: ['Art & Craft', 'Fine Arts', 'Arts & Crafts'],
  Humanities: ['Psychology', 'Sociology', 'Philosophy'],
  Commerce: ['Entrepreneurship'],
  Technology: ['Artificial Intelligence', 'Robotics', 'Cybersecurity', 'Data Science'],
  Language: ['Sanskrit', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Chinese'],
};

export function AddSubjectsDialog({ open, onOpenChange, onSave }) {
  const [selected, setSelected] = useState([]);

  const toggleSubject = (subject) => {
    setSelected((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const removeSubject = (subject) => {
    setSelected((prev) => prev.filter((s) => s !== subject));
  };

  const handleSave = () => {
    onSave(selected);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold">Select Your Subjects</Dialog.Title>

          {/* Selected Subjects Section */}
          {selected.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Selected Subjects:</h4>
              <div className="flex flex-wrap gap-2">
                {selected.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-300"
                  >
                    {subject}
                    <button
                      onClick={() => removeSubject(subject)}
                      className="ml-2 text-blue-600 hover:text-red-500"
                      aria-label={`Remove ${subject}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Subject Buttons */}
          <div className="flex flex-col gap-4 py-2">
            {Object.entries(SUBJECT_CATEGORIES).map(([category, subjects]) => (
              <div key={category} className="space-y-1">
                <h3 className="font-medium text-gray-700">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
                        selected.includes(subject)
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Dialog.Close asChild>
              <button className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-lg">✕</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
