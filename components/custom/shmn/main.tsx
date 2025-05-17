import React from 'react';
import { ProtocolManager } from './protocol-manager';
import { TeleprompterPlayer } from './teleprompter-player';

const Main = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="flex justify-between items-center py-5 border-b border-white/10">
        <div className="logo-container flex flex-col">
          <div className="logo text-3xl font-bold text-primary tracking-wider">SHMN</div>
          <div className="subtitle text-xs text-text-secondary">Spiritual Human Mental Network</div>
        </div>
        <nav>
          <ul className="flex list-none">
            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10 active:text-text-primary active:bg-slate-700/10" data-section="home">Home</a></li>
            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10" data-section="protocols">Protocols</a></li>
            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10" data-section="concepts">Concepts</a></li>
            <li className="ml-5"><a href="#" className="text-text-secondary no-underline px-2.5 py-1.5 rounded transition-all duration-300 ease-in-out hover:text-text-primary hover:bg-slate-700/10" data-section="journal">Journal</a></li>
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
        <p>&copy; 2025 SHMN - Spiritual Human Mental Network. A framework for personal development and mindfulness.</p>
      </footer>

      {/* Protocol Creation Modal */}
      <div id="protocol-modal" className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden">
        <div className="bg-card-background rounded-lg shadow-xl border border-primary/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-medium text-primary">Create New Protocol</h3>
            <button id="close-modal" className="text-text-secondary hover:text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="p-5">
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
                {/* Initial empty part */}
                <div className="protocol-part p-4 bg-black/30 rounded-md border border-white/10">
                  <div className="mb-3">
                    <label className="block text-text-secondary mb-1 text-sm">Part 1</label>
                    <textarea 
                      className="part-content w-full p-3 bg-black/20 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none min-h-[80px]"
                      placeholder="Enter the text for this part (e.g., a sentence or short paragraph)"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button className="remove-part bg-transparent hover:bg-red-900/20 text-red-500 border border-red-500 px-3 py-1 rounded text-xs">
                      Remove
                    </button>
                  </div>
                </div>
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
          </div>
        </div>
      </div>

      {/* Include the Protocol Manager Component */}
      <ProtocolManager />
      
      {/* Include the Teleprompter Player Component */}
      <TeleprompterPlayer />
    </div>
  );
};

export { Main };
