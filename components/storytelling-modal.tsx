import { useState } from 'react';

interface StorytellingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const storytellingModules = [
  { number: 1, title: 'הסיטואציה', description: 'תיאור הרקע והמצב ההתחלתי של הסיפור' },
  { number: 2, title: 'תשוקה', description: 'מה הדמות רוצה או צריכה להשיג' },
  { number: 3, title: 'קונפליקט', description: 'המכשול או האתגר שעומד בדרך' },
  { number: 4, title: 'השינוי', description: 'התפנית או ההתפתחות בסיפור' },
  { number: 5, title: 'התוצאה', description: 'הסיום והלקח מהסיפור' },
];

const FieldContainer = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="text-sm font-semibold text-gray-500 uppercase mb-2">{label}</div>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export default function StorytellingModal({ isOpen, onClose }: StorytellingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Storytelling - מודול סיפור</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 gap-4">
            {storytellingModules.map((module) => (
              <div
                key={module.number}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-md flex flex-col bg-gradient-to-br from-white via-blue-100 to-purple-100"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 flex justify-between items-center">
                  <div className="text-lg font-bold">#{module.number}</div>
                  <div className="text-lg font-bold">{module.title}</div>
                </div>
                <div className="p-4">
                  <FieldContainer label="תיאור" value={module.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}