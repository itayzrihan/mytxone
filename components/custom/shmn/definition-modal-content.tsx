'use client';

import React, { useEffect } from 'react';

const DefinitionModalContent: React.FC = () => {
  useEffect(() => {
    const definitionContentContainer = document.getElementById('definition-content-container');
    const addEntryBtn = document.getElementById('add-entry-btn');
    
    // Add initial empty content entry
    const addInitialEntry = () => {
      if (definitionContentContainer && definitionContentContainer.children.length === 0) {
        addDefinitionEntry(1);
      }
    };

    // Add a new definition entry
    const addDefinitionEntry = (entryNumber: number, content: string = '') => {
      if (!definitionContentContainer) return;
      
      const entryElement = document.createElement('div');
      entryElement.className = 'definition-entry p-4 bg-black/30 rounded-md border border-white/10';
      entryElement.innerHTML = `
        <div class="mb-3">
          <label class="block text-text-secondary mb-1 text-sm">Entry ${entryNumber}</label>
          <textarea 
            class="entry-content w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none min-h-[80px]"
            placeholder="Enter the content for this entry"
          >${content}</textarea>
        </div>
        <div class="flex justify-end">
          <button class="remove-entry bg-transparent hover:bg-red-900/20 text-red-500 border border-red-500 px-3 py-1 rounded text-xs">
            Remove
          </button>
        </div>
      `;
      
      definitionContentContainer.appendChild(entryElement);
      
      // Add event listener to the remove button
      const removeBtn = entryElement.querySelector('.remove-entry');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          // Only remove if there's more than one entry
          if (definitionContentContainer.children.length > 1) {
            entryElement.remove();
            // Renumber the remaining entries
            renumberEntries();
          } else {
            // If it's the last entry, just clear the content
            const textarea = entryElement.querySelector('.entry-content') as HTMLTextAreaElement;
            if (textarea) textarea.value = '';
          }
        });
      }
    };
    
    // Renumber all definition entries in order
    const renumberEntries = () => {
      if (definitionContentContainer) {
        const entryLabels = definitionContentContainer.querySelectorAll('.text-text-secondary.mb-1');
        entryLabels.forEach((label, index) => {
          label.textContent = `Entry ${index + 1}`;
        });
      }
    };
    
    // When Add Entry button is clicked
    if (addEntryBtn) {
      addEntryBtn.addEventListener('click', () => {
        if (definitionContentContainer) {
          addDefinitionEntry(definitionContentContainer.children.length + 1);
        }
      });
    }
    
    // Initialize with one empty entry
    addInitialEntry();
    
    // Clean up event listeners on unmount
    return () => {
      if (addEntryBtn) {
        addEntryBtn.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <>
      <div className="mb-5">
        <label htmlFor="definition-name" className="block text-text-primary mb-2">Definition Name</label>
        <input 
          type="text" 
          id="definition-name" 
          className="w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none"
          placeholder="Enter definition name"
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="definition-description" className="block text-text-primary mb-2">Description</label>
        <textarea 
          id="definition-description" 
          className="w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none min-h-[80px]"
          placeholder="Enter a brief description (optional)"
        ></textarea>
      </div>
      
      <div className="mb-5">
        <label className="block text-text-primary mb-2">Definition Content</label>
        <div id="definition-content-container" className="space-y-4">
          {/* Initial empty entry - will be populated by JS */}
        </div>
        
        <button 
          id="add-entry-btn" 
          className="mt-3 bg-transparent hover:bg-primary/10 text-primary border border-primary px-4 py-2 rounded flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Another Entry
        </button>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button 
          id="cancel-definition" 
          className="bg-transparent hover:bg-white/10 text-text-secondary border border-white/20 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button 
          id="save-definition" 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Definition
        </button>
      </div>
    </>
  );
};

export { DefinitionModalContent };
