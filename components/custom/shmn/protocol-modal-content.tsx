'use client';

import React, { useEffect } from 'react';

const ProtocolModalContent: React.FC = () => {
  useEffect(() => {
    const protocolPartsContainer = document.getElementById('protocol-parts');
    const addPartBtn = document.getElementById('add-part-btn');
    
    // Add initial empty part 
    const addInitialPart = () => {
      if (protocolPartsContainer && protocolPartsContainer.children.length === 0) {
        addProtocolPart(1);
      }
    };

    // Add a new protocol part
    const addProtocolPart = (partNumber: number, content: string = '') => {
      if (!protocolPartsContainer) return;
      
      const partElement = document.createElement('div');
      partElement.className = 'protocol-part p-4 bg-black/30 rounded-md border border-white/10';
      partElement.innerHTML = `
        <div class="mb-3">
          <label class="block text-text-secondary mb-1 text-sm">Part ${partNumber}</label>
          <textarea 
            class="part-content w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none min-h-[80px]"
            placeholder="Enter the text for this part (e.g., a sentence or short paragraph)"
          >${content}</textarea>
        </div>
        <div class="flex justify-end">
          <button class="remove-part bg-transparent hover:bg-red-900/20 text-red-500 border border-red-500 px-3 py-1 rounded text-xs">
            Remove
          </button>
        </div>
      `;
      
      protocolPartsContainer.appendChild(partElement);
      
      // Add event listener to the remove button
      const removeBtn = partElement.querySelector('.remove-part');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          // Only remove if there's more than one part
          if (protocolPartsContainer.children.length > 1) {
            partElement.remove();
            // Renumber the remaining parts
            renumberParts();
          } else {
            // If it's the last part, just clear the content
            const textarea = partElement.querySelector('.part-content') as HTMLTextAreaElement;
            if (textarea) textarea.value = '';
          }
        });
      }
    };
    
    // Renumber all protocol parts in order
    const renumberParts = () => {
      if (protocolPartsContainer) {
        const partLabels = protocolPartsContainer.querySelectorAll('.text-text-secondary.mb-1');
        partLabels.forEach((label, index) => {
          label.textContent = `Part ${index + 1}`;
        });
      }
    };
    
    // When Add Part button is clicked
    if (addPartBtn) {
      addPartBtn.addEventListener('click', () => {
        if (protocolPartsContainer) {
          addProtocolPart(protocolPartsContainer.children.length + 1);
        }
      });
    }
    
    // Initialize with one empty part
    addInitialPart();
    
    // Clean up event listeners on unmount
    return () => {
      if (addPartBtn) {
        addPartBtn.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <>
      <div className="mb-5">
        <label htmlFor="protocol-name" className="block text-text-primary mb-2">Protocol Name</label>
        <input 
          type="text" 
          id="protocol-name" 
          className="w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none"
          placeholder="Enter protocol name"
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="protocol-description" className="block text-text-primary mb-2">Description</label>
        <textarea 
          id="protocol-description" 
          className="w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none min-h-[100px]"
          placeholder="Enter protocol description"
        ></textarea>
      </div>
      
      <div className="mb-5">
        <label className="block text-text-primary mb-2">Protocol Parts</label>
        <div id="protocol-parts" className="space-y-4">
          {/* Initial empty part - will be populated by JS */}
        </div>
        
        <button 
          id="add-part-btn" 
          className="mt-3 bg-transparent hover:bg-primary/10 text-primary border border-primary px-4 py-2 rounded flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Another Part
        </button>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button 
          id="cancel-protocol" 
          className="bg-transparent hover:bg-white/10 text-text-secondary border border-white/20 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button 
          id="save-protocol" 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Protocol
        </button>
      </div>
    </>
  );
};

export { ProtocolModalContent };
