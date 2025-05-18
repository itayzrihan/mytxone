'use client';

import React from 'react';

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const SharedModal: React.FC<ModalProps> = ({ id, title, children }) => {
  return (
    <div id={id} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden">
      <div className="bg-card-background rounded-lg shadow-xl border border-primary/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-medium text-primary">{title}</h3>
          <button id={`close-${id}`} className="text-text-secondary hover:text-text-primary close-modal-btn" data-modal-id={id}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export { SharedModal };
