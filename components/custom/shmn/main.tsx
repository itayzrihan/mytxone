'use client';
import React, { useEffect } from 'react';
import { ProtocolManager } from './protocol-manager';
import { TeleprompterPlayer } from './teleprompter-player';
import { SharedModal } from './shared-modal';
import { ProtocolModalContent } from './protocol-modal-content';
import { DefinitionModalContent } from './definition-modal-content';

const Main = () => {  useEffect(() => {
    // Improve dropdown menu behavior
    const selfDropdownButton = document.getElementById('self-dropdown-button');
    const selfDropdownMenu = document.getElementById('self-dropdown-menu');
    
    if (selfDropdownButton && selfDropdownMenu) {
      // Toggle dropdown on click
      selfDropdownButton.addEventListener('click', (e) => {
        e.preventDefault();
        selfDropdownMenu.classList.toggle('hidden');
        const isExpanded = !selfDropdownMenu.classList.contains('hidden');
        selfDropdownButton.setAttribute('aria-expanded', isExpanded.toString());
      });
      
      // Close dropdown when clicking elsewhere
      document.addEventListener('click', (e) => {
        if (!selfDropdownButton.contains(e.target as Node) && 
            !selfDropdownMenu.contains(e.target as Node)) {
          selfDropdownMenu.classList.add('hidden');
          selfDropdownButton.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Set up shared modal close behavior
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modalId = (button as HTMLElement).getAttribute('data-modal-id');
        if (modalId) {
          const modal = document.getElementById(modalId);
          if (modal) modal.classList.add('hidden');
        }
      });
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="flex justify-between items-center py-5 border-b border-white/10">
        <div className="logo-container flex flex-col">
          <div className="logo text-3xl font-bold text-primary tracking-wider">SHMN</div>
          <div className="subtitle text-xs text-text-secondary">Spiritual Human Mental Network</div>
        </div>        <nav>
          <ul className="flex list-none items-center">
            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10 active:text-text-primary active:bg-slate-700/10" data-section="home">Home</a></li>            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10" data-section="protocols">Protocols</a></li>
            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10" data-section="concepts">Concepts</a></li>            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10" data-section="journal">Journal</a></li>
        
            <li className="ml-5 relative">
              <button
              id="self-dropdown-button"
              type="button"
              className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10 flex items-center focus:outline-none" 
              data-section="self"
              aria-haspopup="true"
              aria-expanded="false"
              >
              {/* Set to true via JS if dropdown is open, useful for click-toggled dropdowns */}
              Self
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>              </button><div
              id="self-dropdown-menu"
              className="absolute left-0 top-full w-48 rounded-md shadow-lg overflow-hidden bg-card-background ring-1 ring-primary/10 hidden z-20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="self-dropdown-button"
              >
              {/* Empty div for buffer space to make hover transition smoother */}
              <div className="h-2"></div>
              <div className="py-1">
                <a
                href="/shmn/definitions"
                className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-slate-700/20 w-full text-left"
                role="menuitem"
                data-section="definitions"
                >
                {/* This was on the original definitions link */}
                Definitions
                </a>
                {/* You can add more dropdown items here if needed */}
                {/* Example:
                <a
                href="#"
                className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-slate-700/20 w-full text-left"
                role="menuitem"
                >
                Another Item                </a>
                */}
              </div>
              </div>
            </li>
          </ul>
        </nav>
      </header>

      <main className="py-10">
        <section id="home" className="active-section">
          <h1 className="mb-5 text-primary text-4xl">Welcome to SHMN</h1>
          <p className="text-text-secondary mb-7 text-lg max-w-2xl">A framework for conceptualizing and implementing personal development protocols, mindfulness practices, and mental frameworks.</p>

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-text-primary">My Protocols</h2>
            <button 
              id="add-protocol-btn" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-primary/20"
              aria-label="Add new protocol"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {/* Protocol cards will be generated dynamically */}
          </div>          <div className="teleprompter-container mt-7 mb-7 flex flex-col bg-card-background rounded-lg p-5 shadow-lg border border-primary/10">
            <div className="flex items-center mb-3">
              <div className="progress-circle relative w-20 h-20 mr-5 flex-shrink-0" data-progress="0">
                <svg viewBox="0 0 36 36" className="circular-chart w-full h-full">
                  <path className="circle-bg fill-none stroke-primary/20" strokeWidth="2.8"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle fill-none stroke-primary" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="0, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-text-primary">0%</div>
              </div>              <div className="teleprompter flex-1 min-h-[100px] p-4 rounded-md bg-black/20 shadow-inner flex items-center justify-center">
                <p className="teleprompter-text text-lg leading-relaxed text-text-primary text-center w-full">Ready to begin your practice...</p>
              </div>
            </div>
            <div id="protocol-progress-bar" className="w-full h-2 bg-primary/20 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary w-0 transition-all duration-300"></div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Overall Progress</span>
              <span className="protocol-part-indicator">Part 0/0</span>
            </div>
          </div>

          <div className="console mt-7 bg-card-background rounded-lg shadow-lg overflow-hidden border border-primary/10">
            <div className="console-header flex justify-between items-center py-3 px-4 bg-black/20 border-b border-white/5">
              <span className="font-medium text-primary">Console Output</span>
              <button id="clear-console" className="small-btn bg-transparent text-text-secondary border border-text-secondary px-2 py-1 rounded text-xs transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-text-primary">Clear</button>
            </div>
            <div className="console-content p-4 min-h-[150px] max-h-[300px] overflow-y-auto font-mono text-sm text-text-primary leading-normal bg-black/10">
              {/* Console messages will appear here */}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-5 text-center text-text-secondary text-xs border-t border-white/10">
        <p>&copy; 2025 SHMN - Spiritual Human Mental Network. A framework for personal development and mindfulness.</p>      </footer>

      {/* Protocol Creation Modal */}
      <SharedModal id="protocol-modal" title="Create New Protocol">
        <ProtocolModalContent />
      </SharedModal>

      {/* Definition Creation Modal */}
      <SharedModal id="definition-modal" title="Create New Definition">
        <DefinitionModalContent />
      </SharedModal>

      {/* Include the Protocol Manager Component */}
      <ProtocolManager />
      
      {/* Include the Teleprompter Player Component */}
      <TeleprompterPlayer />
    </div>
  );
};

export { Main };
