"use client";

import React, { useEffect } from 'react';

interface ProtocolPart {
  content: string;
}

interface Protocol {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  parts: ProtocolPart[] | string; // Can be string (serialized JSON from DB)
  createdAt: string;
}

// Helper function to parse parts if needed
const getParsedParts = (protocol: Protocol): ProtocolPart[] => {
  if (typeof protocol.parts === 'string') {
    try {
      return JSON.parse(protocol.parts);
    } catch (error) {
      console.error('Error parsing protocol parts:', error);
      return [];
    }
  }
  return protocol.parts as ProtocolPart[];
};

const ProtocolManager = () => {
  useEffect(() => {    // DOM elements
    const addProtocolBtn = document.getElementById('add-protocol-btn');
    const protocolModal = document.getElementById('protocol-modal');
    const closeModalBtn = document.getElementById('close-protocol-modal');
    const cancelProtocolBtn = document.getElementById('cancel-protocol');
    const addPartBtn = document.getElementById('add-part-btn');
    const protocolPartsContainer = document.getElementById('protocol-parts');
    const saveProtocolBtn = document.getElementById('save-protocol');

    // Open modal
    const openModal = () => {
      if (protocolModal) protocolModal.classList.remove('hidden');
    };    // Close modal
    const closeModal = () => {
      if (protocolModal) protocolModal.classList.add('hidden');
      
      // Reset form
      const nameInput = document.getElementById('protocol-name') as HTMLInputElement;
      const descriptionInput = document.getElementById('protocol-description') as HTMLTextAreaElement;
      
      if (nameInput) nameInput.value = '';
      if (descriptionInput) descriptionInput.value = '';
      
      // Reset parts (keep only one empty part)
      if (protocolPartsContainer) {
        protocolPartsContainer.innerHTML = '';
        addInitialPart();
      }
      
      // Reset save button if it was in edit mode
      if (saveProtocolBtn) {
        saveProtocolBtn.removeAttribute('data-editing-id');
        saveProtocolBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Protocol
        `;
      }
    };

    // Add initial empty part
    const addInitialPart = () => {
      addProtocolPart(1);
    };

    // Add a new protocol part
    const addProtocolPart = (partNumber: number, content: string = '') => {
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
      
      if (protocolPartsContainer) {
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
    
    // Delete protocol
    const deleteProtocol = async (protocolId: string) => {
      if (!confirm("Are you sure you want to delete this protocol? This action cannot be undone.")) {
        return;
      }
      
      try {
        // Delete protocol via API
        const response = await fetch(`/api/protocols?id=${protocolId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete protocol: ${response.statusText}`);
        }
        
        // Show confirmation
        const consoleContent = document.querySelector('.console-content');
        if (consoleContent) {
          const message = document.createElement('div');
          message.className = 'mb-2';
          message.innerHTML = `<span class="text-red-500">[${new Date().toLocaleTimeString()}]</span> Protocol <strong>deleted</strong> successfully.`;
          consoleContent.appendChild(message);
          consoleContent.scrollTop = consoleContent.scrollHeight;
        }
        
        // Refresh the protocol cards
        generateProtocolCards();
      } catch (error) {
        console.error('Error deleting protocol:', error);
        alert('Failed to delete protocol. Please try again.');
      }
    };

    // Edit protocol
    const editProtocol = async (protocolId: string) => {
      try {
        // Fetch protocol data from API
        const response = await fetch(`/api/protocols?id=${protocolId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch protocol for editing: ${response.statusText}`);
        }
        
        const protocol = await response.json();
        
        if (!protocol) {
          throw new Error('Protocol not found');
        }
        
        // Parse parts if needed
        const parsedParts = getParsedParts(protocol);
        
        // Open modal for editing
        if (protocolModal) protocolModal.classList.remove('hidden');
        
        // Fill form with existing protocol data
        const nameInput = document.getElementById('protocol-name') as HTMLInputElement;
        const descriptionInput = document.getElementById('protocol-description') as HTMLTextAreaElement;
        
        if (nameInput) nameInput.value = protocol.name;
        if (descriptionInput) descriptionInput.value = protocol.description || '';
        
        // Set a data attribute on save button to indicate we're editing
        if (saveProtocolBtn) {
          saveProtocolBtn.setAttribute('data-editing-id', protocolId);
          // Change button text to indicate we're editing
          saveProtocolBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Update Protocol
          `;
        }
        
        // Clear existing parts container
        if (protocolPartsContainer) {
          protocolPartsContainer.innerHTML = '';
          
          // Add each existing part
          parsedParts.forEach((part, index) => {
            addProtocolPart(index + 1, part.content);
          });
          
          // If no parts, add an empty one
          if (parsedParts.length === 0) {
            addInitialPart();
          }
        }
        
        // Show confirmation
        const consoleContent = document.querySelector('.console-content');
        if (consoleContent) {
          const message = document.createElement('div');
          message.className = 'mb-2';
          message.innerHTML = `<span class="text-blue-500">[${new Date().toLocaleTimeString()}]</span> Editing protocol: <strong>${protocol.name}</strong>`;
          consoleContent.appendChild(message);
          consoleContent.scrollTop = consoleContent.scrollHeight;
        }
      } catch (error) {
        console.error('Error preparing protocol for editing:', error);
        alert('Failed to edit protocol. Please try again.');
      }
    };

    // Save protocol
    const saveProtocol = async () => {
      const nameInput = document.getElementById('protocol-name') as HTMLInputElement;
      const descriptionInput = document.getElementById('protocol-description') as HTMLTextAreaElement;
      
      const name = nameInput?.value || '';
      const description = descriptionInput?.value || '';
      
      if (!name.trim()) {
        alert('Please enter a protocol name');
        return;
      }
      
      // Get all protocol parts content
      const parts: ProtocolPart[] = [];
      
      if (protocolPartsContainer) {
        const partElements = protocolPartsContainer.querySelectorAll('.part-content');
        
        partElements.forEach((part) => {
          const textarea = part as HTMLTextAreaElement;
          const content = textarea.value.trim();
          if (content) {
            parts.push({ content });
          }
        });
      }
      
      if (parts.length === 0) {
        alert('Please add at least one protocol part with content');
        return;
      }
      
      try {
        const editingId = saveProtocolBtn?.getAttribute('data-editing-id');
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/protocols?id=${editingId}` : '/api/protocols';

        // Save protocol to database via API
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            parts,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save protocol: ${response.statusText}`);
        }
        
        const savedProtocol = await response.json();
        console.log('Protocol saved successfully:', savedProtocol);
        
        // Show confirmation
        const consoleContent = document.querySelector('.console-content');
        if (consoleContent) {
          const message = document.createElement('div');
          message.className = 'mb-2';
          message.innerHTML = `<span class="text-green-500">[${new Date().toLocaleTimeString()}]</span> Protocol <strong>${name}</strong> ${editingId ? 'updated' : 'created'} successfully with ${parts.length} parts.`;
          consoleContent.appendChild(message);
          consoleContent.scrollTop = consoleContent.scrollHeight;
        }
        
        // Refresh the protocol cards
        generateProtocolCards();
        
        // Close the modal
        closeModal();
      } catch (error) {
        console.error('Error saving protocol:', error);
        alert('Failed to save protocol. Please try again.');
      }
    };
    
    // Generate protocol cards
    const generateProtocolCards = async () => {
      const dashboard = document.querySelector('.dashboard');
      if (!dashboard) return;
      
      // Clear existing cards
      dashboard.innerHTML = '';
      
      try {
        // Fetch protocols from API
        const response = await fetch('/api/protocols');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch protocols: ${response.statusText}`);
        }
        
        const protocols = await response.json();
        
        if (protocols.length === 0) {
          dashboard.innerHTML = `
            <div class="col-span-full text-center py-10">
              <p class="text-text-secondary">No protocols yet. Click the + button to create your first protocol.</p>
            </div>
          `;
          return;
        }
      
        // Create a card for each protocol
        protocols.forEach((protocol: Protocol) => {
          // Parse parts if they're stored as a JSON string
          const parsedParts = getParsedParts(protocol);
          
          const card = document.createElement('div');
          card.className = 'protocol-card bg-card-background rounded-lg p-5 border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg';
          card.innerHTML = `            <h3 class="text-xl text-primary mb-2">${protocol.name}</h3>
            <p class="text-text-secondary text-sm mb-4">${protocol.description || 'No description'}</p>
            <div class="flex justify-between items-center">
              <span class="text-text-secondary text-xs">${parsedParts.length} parts</span>
              <div class="flex gap-2">
                <button 
                  class="edit-protocol bg-transparent hover:bg-blue-500/10 text-blue-500 border border-blue-500 px-3 py-1 rounded text-sm"
                  data-protocol-id="${protocol.id}"
                  data-protocol-name="${protocol.name}"
                  data-protocol-description="${protocol.description || ''}"
                >
                  Edit
                </button>
                <button 
                  class="delete-protocol bg-transparent hover:bg-red-500/10 text-red-500 border border-red-500 px-3 py-1 rounded text-sm"
                  data-protocol-id="${protocol.id}"
                >
                  Delete
                </button>
                <button 
                  class="start-protocol bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded text-sm"
                  data-protocol-id="${protocol.id}"
                >
                  Start
                </button>
              </div>
            </div>
          `;
          
          dashboard.appendChild(card);
          
          // Add event listeners to buttons
          const startBtn = card.querySelector('.start-protocol');
          if (startBtn) {
            startBtn.addEventListener('click', (e) => {
              const target = e.target as HTMLElement;
              const protocolId = target.getAttribute('data-protocol-id');
              if (protocolId) {
                startProtocol(protocolId);
              }
            });
          }
          
          const deleteBtn = card.querySelector('.delete-protocol');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent event bubbling
              const target = e.target as HTMLElement;
              const protocolId = target.getAttribute('data-protocol-id');
              if (protocolId) {
                deleteProtocol(protocolId);
              }
            });
          }

          const editBtn = card.querySelector('.edit-protocol');
          if (editBtn) {
            editBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent event bubbling
              const target = e.target as HTMLElement;
              const protocolId = target.getAttribute('data-protocol-id');
              if (protocolId) {
                editProtocol(protocolId);
              }
            });
          }
        });
      } catch (error) {
        console.error('Error fetching protocols:', error);
        dashboard.innerHTML = `
          <div class="col-span-full text-center py-10 text-red-500">
            <p>Error loading protocols. Please try again later.</p>
          </div>
        `;
      }
    };

    // Start a protocol teleprompter
    const startProtocol = (protocolId: string) => {
      // Update console
      const consoleContent = document.querySelector('.console-content');
      if (consoleContent) {
        const message = document.createElement('div');
        message.className = 'mb-2';
        message.innerHTML = `<span class="text-blue-500">[${new Date().toLocaleTimeString()}]</span> Starting protocol with ID: <strong>${protocolId}</strong>`;
        consoleContent.appendChild(message);
        consoleContent.scrollTop = consoleContent.scrollHeight;
      }
      
      // The actual teleprompter functionality is implemented in the teleprompter-player component
    };

    // Event listeners
    if (addProtocolBtn) addProtocolBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelProtocolBtn) cancelProtocolBtn.addEventListener('click', closeModal);
    if (addPartBtn) {
      addPartBtn.addEventListener('click', () => {
        const newPartNumber = protocolPartsContainer ? protocolPartsContainer.children.length + 1 : 1;
        addProtocolPart(newPartNumber);
      });
    }
    if (saveProtocolBtn) saveProtocolBtn.addEventListener('click', saveProtocol);

    // Initialize
    addInitialPart();
    generateProtocolCards();

    // Clean up event listeners on component unmount
    return () => {
      if (addProtocolBtn) addProtocolBtn.removeEventListener('click', openModal);
      if (closeModalBtn) closeModalBtn.removeEventListener('click', closeModal);
      if (cancelProtocolBtn) cancelProtocolBtn.removeEventListener('click', closeModal);
      if (addPartBtn) {
        addPartBtn.removeEventListener('click', () => {
          const newPartNumber = protocolPartsContainer ? protocolPartsContainer.children.length + 1 : 1;
          addProtocolPart(newPartNumber);
        });
      }
      if (saveProtocolBtn) saveProtocolBtn.removeEventListener('click', saveProtocol);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export { ProtocolManager };


