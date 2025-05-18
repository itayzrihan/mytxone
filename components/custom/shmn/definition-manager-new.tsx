"use client";

import React, { useEffect } from 'react';

interface Definition {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const DefinitionManagerUpdated = () => {
  useEffect(() => {
    // DOM elements
    const addDefinitionBtn = document.getElementById('add-definition-btn');
    const definitionModal = document.getElementById('definition-modal');
    const viewDefinitionModal = document.getElementById('view-definition-modal');
    const closeModalBtn = document.getElementById('close-definition-modal');
    const closeViewModalBtn = document.getElementById('close-view-definition-modal');
    const closeViewBtn = document.getElementById('close-view-btn');
    const cancelDefinitionBtn = document.getElementById('cancel-definition');
    const saveDefinitionBtn = document.getElementById('save-definition');
    const editViewDefinitionBtn = document.getElementById('edit-view-definition');
    const definitionSearchInput = document.getElementById('definition-search') as HTMLInputElement;

    // Open modal
    const openModal = () => {
      if (definitionModal) definitionModal.classList.remove('hidden');
    };
    
    // Close modal
    const closeModal = () => {
      if (definitionModal) definitionModal.classList.add('hidden');
      
      // Reset form
      const nameInput = document.getElementById('definition-name') as HTMLInputElement;
      const descriptionInput = document.getElementById('definition-description') as HTMLTextAreaElement;
      const definitionContentContainer = document.getElementById('definition-content-container');
      
      if (nameInput) nameInput.value = '';
      if (descriptionInput) descriptionInput.value = '';
      
      // Clear all content entries
      if (definitionContentContainer) {
        definitionContentContainer.innerHTML = '';
        // Add a fresh initial entry
        const addEntryBtn = document.getElementById('add-entry-btn');
        if (addEntryBtn) {
          // Trigger a click to add the initial entry
          addEntryBtn.click();
        }
      }
      
      // Reset save button if it was in edit mode
      if (saveDefinitionBtn) {
        saveDefinitionBtn.removeAttribute('data-editing-id');
        saveDefinitionBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Definition
        `;
      }
    };

    // Close view modal
    const closeViewModal = () => {
      if (viewDefinitionModal) viewDefinitionModal.classList.add('hidden');
    };
    
    // Delete definition
    const deleteDefinition = async (definitionId: string) => {
      if (!confirm("Are you sure you want to delete this definition? This action cannot be undone.")) {
        return;
      }
      
      try {
        // Delete definition via API
        const response = await fetch(`/api/definitions?id=${definitionId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete definition: ${response.statusText}`);
        }
        
        // Refresh the definition cards
        generateDefinitionCards();
      } catch (error) {
        console.error('Error deleting definition:', error);
        alert('Failed to delete definition. Please try again.');
      }
    };

    // Edit definition
    const editDefinition = async (definitionId: string) => {
      try {
        // Fetch definition data from API
        const response = await fetch(`/api/definitions?id=${definitionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch definition for editing: ${response.statusText}`);
        }
        
        const definition = await response.json();
        
        if (!definition) {
          throw new Error('Definition not found');
        }
        
        // Close view modal if open
        closeViewModal();
        
        // Open modal for editing
        if (definitionModal) definitionModal.classList.remove('hidden');
        
        // Fill form with existing definition data
        const nameInput = document.getElementById('definition-name') as HTMLInputElement;
        const descriptionInput = document.getElementById('definition-description') as HTMLTextAreaElement;
        const definitionContentContainer = document.getElementById('definition-content-container');
        
        if (nameInput) nameInput.value = definition.name;
        if (descriptionInput) descriptionInput.value = definition.description || '';
        
        // Clear existing entries
        if (definitionContentContainer) {
          definitionContentContainer.innerHTML = '';
            try {
            // Parse existing content as JSON
            let entries: Array<{index: number, content: string}> = [];
            try {
              entries = JSON.parse(definition.content);
            } catch {
              // If it's not JSON, treat it as a single entry
              entries = [{ index: 1, content: definition.content }];
            }
            
            // Add an entry for each part
            entries.forEach((entry: {index: number, content: string}, index: number) => {
              const addEntryBtn = document.getElementById('add-entry-btn');
              if (addEntryBtn) {
                // First, add a new empty entry
                addEntryBtn.click();
                
                // Then find the textarea in the last added entry and set its value
                const lastEntry = definitionContentContainer.lastElementChild;
                if (lastEntry) {
                  const textarea = lastEntry.querySelector('.entry-content') as HTMLTextAreaElement;
                  if (textarea) {
                    textarea.value = entry.content || '';
                  }
                }
              }
            });
          } catch (error) {
            console.error('Error parsing definition content:', error);
            // Add a single empty entry as fallback
            const addEntryBtn = document.getElementById('add-entry-btn');
            if (addEntryBtn) {
              addEntryBtn.click();
            }
          }
        }
        
        // Set a data attribute on save button to indicate we're editing
        if (saveDefinitionBtn) {
          saveDefinitionBtn.setAttribute('data-editing-id', definitionId);
          // Change button text to indicate we're editing
          saveDefinitionBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Update Definition
          `;
        }
      } catch (error) {
        console.error('Error preparing definition for editing:', error);
        alert('Failed to edit definition. Please try again.');
      }
    };

    // View definition details
    const viewDefinition = async (definitionId: string) => {
      try {
        // Fetch definition data from API
        const response = await fetch(`/api/definitions?id=${definitionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch definition details: ${response.statusText}`);
        }
        
        const definition = await response.json();
        
        if (!definition) {
          throw new Error('Definition not found');
        }
        
        // Open view modal
        if (viewDefinitionModal) viewDefinitionModal.classList.remove('hidden');
        
        // Fill modal with definition data
        const titleElement = document.getElementById('view-definition-title');
        const descriptionElement = document.getElementById('view-definition-description');
        const contentElement = document.getElementById('view-definition-content');
        
        if (titleElement) titleElement.textContent = definition.name;
        if (descriptionElement) descriptionElement.textContent = definition.description || 'No description provided';
        
        if (contentElement) {          // Try to parse the content as JSON
          try {
            const entries = JSON.parse(definition.content);
            // Format entries for display
            const formattedContent = entries.map((entry: {index: number, content: string}) => 
              `<div class="mb-3 pb-3 border-b border-white/10">
                <p>${entry.content}</p>
              </div>`
            ).join('');
            
            contentElement.innerHTML = formattedContent || 'No content provided';
          } catch {
            // If not JSON, display as is
            contentElement.textContent = definition.content || 'No content provided';
          }
        }
        
        // Set definition ID for edit button
        if (editViewDefinitionBtn) {
          editViewDefinitionBtn.setAttribute('data-definition-id', definitionId);
        }
      } catch (error) {
        console.error('Error viewing definition details:', error);
        alert('Failed to load definition details. Please try again.');
      }
    };

    // Save definition
    const saveDefinition = async () => {
      const nameInput = document.getElementById('definition-name') as HTMLInputElement;
      const descriptionInput = document.getElementById('definition-description') as HTMLTextAreaElement;
      const definitionContentContainer = document.getElementById('definition-content-container');
      
      // Get all content entries and combine them
      let combinedContent = '';
      if (definitionContentContainer) {        const contentEntries = definitionContentContainer.querySelectorAll('.entry-content') as NodeListOf<HTMLTextAreaElement>;
        
        // Convert entries to array of objects
        const entriesArray = Array.from(contentEntries).map((entryTextarea: HTMLTextAreaElement, index: number) => {
          return {
            index: index + 1,
            content: entryTextarea.value.trim()
          };
        });
        
        // Filter out empty entries
        const nonEmptyEntries = entriesArray.filter(entry => entry.content !== '');
        
        // Format content as JSON string to store in the database
        combinedContent = JSON.stringify(nonEmptyEntries);
      }
      
      const name = nameInput?.value.trim();
      const description = descriptionInput?.value.trim();
      
      if (!name) {
        alert('Please enter a name for your definition.');
        return;
      }
      
      if (!combinedContent || combinedContent === '[]') {
        alert('Please add at least one entry for your definition.');
        return;
      }
      
      try {
        // Check if we're in edit mode
        const editingId = saveDefinitionBtn?.getAttribute('data-editing-id');
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/definitions?id=${editingId}` : '/api/definitions';
        
        // API request to save definition
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description: description || undefined,
            content: combinedContent,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to ${editingId ? 'update' : 'save'} definition: ${response.statusText}`);
        }
        
        // Close modal and refresh definitions
        closeModal();
        generateDefinitionCards();
      } catch (error) {
        console.error('Error saving definition:', error);
        alert(`Failed to ${saveDefinitionBtn?.getAttribute('data-editing-id') ? 'update' : 'save'} definition. Please try again.`);
      }
    };
    
    // Filter definitions based on search query
    const filterDefinitions = () => {
      const searchQuery = definitionSearchInput?.value.toLowerCase();
      const definitionCards = document.querySelectorAll('.definition-card');
      
      definitionCards.forEach((card) => {
        const titleElement = card.querySelector('h3');
        const descriptionElement = card.querySelector('p');
        
        const title = titleElement?.textContent?.toLowerCase() || '';
        const description = descriptionElement?.textContent?.toLowerCase() || '';
        
        if (title.includes(searchQuery) || description.includes(searchQuery)) {
          (card as HTMLElement).style.display = 'block';
        } else {
          (card as HTMLElement).style.display = 'none';
        }
      });
      
      // Show message if no results
      const dashboard = document.querySelector('.dashboard');
      const noResultsMessage = dashboard?.querySelector('.no-results-message');
      
      if (dashboard) {
        let visibleCards = 0;
        definitionCards.forEach((card) => {
          if ((card as HTMLElement).style.display !== 'none') {
            visibleCards++;
          }
        });
        
        if (visibleCards === 0 && searchQuery && !noResultsMessage) {
          const message = document.createElement('div');
          message.className = 'no-results-message col-span-full text-center py-10';
          message.innerHTML = `
            <p class="text-text-secondary">No definitions found matching "${searchQuery}"</p>
          `;
          dashboard.appendChild(message);
        } else if ((visibleCards > 0 || !searchQuery) && noResultsMessage) {
          noResultsMessage.remove();
        }
      }
    };
    
    // Generate definition cards
    const generateDefinitionCards = async () => {
      const dashboard = document.querySelector('.dashboard');
      if (!dashboard) return;
      
      // Clear existing cards
      dashboard.innerHTML = '';
      
      try {
        // Fetch definitions from API
        const response = await fetch('/api/definitions');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch definitions: ${response.statusText}`);
        }
        
        const definitions = await response.json();
        
        if (definitions.length === 0) {
          dashboard.innerHTML = `
            <div class="col-span-full text-center py-10">
              <p class="text-text-secondary">No definitions yet. Click the "New Definition" button to create your first definition.</p>
            </div>
          `;
          return;
        }
        
        // Create a card for each definition
        definitions.forEach((definition: Definition) => {
          const card = document.createElement('div');
          card.className = 'definition-card bg-card-background rounded-lg p-5 border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg cursor-pointer';
          card.setAttribute('data-definition-id', definition.id);
          
          // Format the date
          const createdDate = new Date(definition.createdAt).toLocaleDateString();
          const updatedDate = new Date(definition.updatedAt).toLocaleDateString();
          
          // Try to parse content to get entry count
          let entryCount = 1;
          try {
            const entries = JSON.parse(definition.content);
            entryCount = entries.length;
          } catch {
            // Not JSON, just one entry
          }
          
          // Truncate description if it's too long
          const truncatedDescription = definition.description 
            ? (definition.description.length > 100 
                ? definition.description.substring(0, 100) + '...' 
                : definition.description)
            : 'No description';
            
          card.innerHTML = `
            <h3 class="text-xl text-primary mb-2">${definition.name}</h3>
            <p class="text-text-secondary text-sm mb-4">${truncatedDescription}</p>
            <div class="flex justify-between items-center">
              <span class="text-text-secondary text-xs">
                ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} • Updated: ${updatedDate}
              </span>
              <div class="flex gap-2">
                <button 
                  class="edit-definition bg-transparent hover:bg-blue-500/10 text-blue-500 border border-blue-500 px-3 py-1 rounded text-sm"
                  data-definition-id="${definition.id}"
                >
                  Edit
                </button>
                <button 
                  class="delete-definition bg-transparent hover:bg-red-500/10 text-red-500 border border-red-500 px-3 py-1 rounded text-sm"
                  data-definition-id="${definition.id}"
                >
                  Delete
                </button>
              </div>
            </div>
          `;
          
          dashboard.appendChild(card);
          
          // Add event listeners
          card.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            // Only open view modal if not clicking on a button
            if (!target.closest('button')) {
              const definitionId = card.getAttribute('data-definition-id');
              if (definitionId) {
                viewDefinition(definitionId);
              }
            }
          });
          
          const editBtn = card.querySelector('.edit-definition');
          if (editBtn) {
            editBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent event bubbling
              const target = e.target as HTMLElement;
              const definitionId = target.getAttribute('data-definition-id');
              if (definitionId) {
                editDefinition(definitionId);
              }
            });
          }
          
          const deleteBtn = card.querySelector('.delete-definition');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent event bubbling
              const target = e.target as HTMLElement;
              const definitionId = target.getAttribute('data-definition-id');
              if (definitionId) {
                deleteDefinition(definitionId);
              }
            });
          }
        });
        
        // Apply any existing search filter
        if (definitionSearchInput && definitionSearchInput.value) {
          filterDefinitions();
        }
      } catch (error) {
        console.error('Error fetching definitions:', error);
        dashboard.innerHTML = `
          <div class="col-span-full text-center py-10 text-red-500">
            <p>Error loading definitions. Please try again later.</p>
          </div>
        `;
      }
    };

    // Event listeners
    if (addDefinitionBtn) addDefinitionBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeViewModalBtn) closeViewModalBtn.addEventListener('click', closeViewModal);
    if (closeViewBtn) closeViewBtn.addEventListener('click', closeViewModal);
    if (cancelDefinitionBtn) cancelDefinitionBtn.addEventListener('click', closeModal);
    if (saveDefinitionBtn) saveDefinitionBtn.addEventListener('click', saveDefinition);
    if (editViewDefinitionBtn) {
      editViewDefinitionBtn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const definitionId = target.getAttribute('data-definition-id');
        if (definitionId) {
          editDefinition(definitionId);
        }
      });
    }
    if (definitionSearchInput) {
      definitionSearchInput.addEventListener('input', filterDefinitions);
    }

    // Initialize
    generateDefinitionCards();

    // Clean up event listeners on component unmount
    return () => {
      if (addDefinitionBtn) addDefinitionBtn.removeEventListener('click', openModal);
      if (closeModalBtn) closeModalBtn.removeEventListener('click', closeModal);
      if (closeViewModalBtn) closeViewModalBtn.removeEventListener('click', closeViewModal);
      if (closeViewBtn) closeViewBtn.removeEventListener('click', closeViewModal);
      if (cancelDefinitionBtn) cancelDefinitionBtn.removeEventListener('click', closeModal);
      if (saveDefinitionBtn) saveDefinitionBtn.removeEventListener('click', saveDefinition);
      if (editViewDefinitionBtn) {
        editViewDefinitionBtn.removeEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const definitionId = target.getAttribute('data-definition-id');
          if (definitionId) {
            editDefinition(definitionId);
          }
        });
      }
      if (definitionSearchInput) {
        definitionSearchInput.removeEventListener('input', filterDefinitions);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export { DefinitionManagerUpdated as DefinitionManager };
