"use client";

import { useEffect, useState } from 'react';
import { Search } from "lucide-react";
import Link from "next/link";
import { DefinitionManager } from '@/components/custom/shmn/definition-manager-new';
import { SharedModal } from '@/components/custom/shmn/shared-modal';
import { DefinitionModalContent } from '@/components/custom/shmn/definition-modal-content';

export default function DefinitionsPage() {
  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 text-text-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Definitions</h1>
            <p className="text-text-secondary max-w-2xl">
              Create and manage personal definitions for concepts, ideas, and entities that matter to you.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-4">
            <Link
              href="/shmn"
              className="px-6 py-2 border border-primary/50 text-primary rounded-md hover:bg-primary/10 transition-all"
            >
              Back to SHMN
            </Link>
            
            <button
              id="add-definition-btn"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Definition
            </button>
          </div>
        </div>
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          <input
            type="search"
            id="definition-search"
            className="block w-full pl-10 pr-3 py-2 bg-card-background/50 border border-white/10 rounded-md text-text-primary focus:border-primary focus:outline-none"
            placeholder="Search definitions..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Definition cards will be generated here dynamically */}
        </div>
        
        {/* Definition Creation Modal */}
        <SharedModal id="definition-modal" title="Create New Definition">
          <DefinitionModalContent />
        </SharedModal>
        
        {/* View Definition Modal */}
        <div id="view-definition-modal" className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden">
          <div className="bg-card-background rounded-lg shadow-xl border border-primary/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <h3 id="view-definition-title" className="text-xl font-medium text-primary">Definition Title</h3>
              <button id="close-view-definition-modal" className="text-text-secondary hover:text-text-primary close-modal-btn" data-modal-id="view-definition-modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-5">
              <div id="view-definition-description" className="text-text-secondary mb-6 italic">
                Description will appear here
              </div>
              
              <div id="view-definition-content" className="text-text-primary whitespace-pre-wrap">
                Definition content will appear here
              </div>
            </div>
            
            <div className="p-5 border-t border-white/10 flex justify-end space-x-3">
              <button 
                id="close-view-btn" 
                className="bg-transparent hover:bg-white/10 text-text-secondary border border-white/20 px-4 py-2 rounded"
              >
                Close
              </button>
              <button 
                id="edit-view-definition" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                data-definition-id=""
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
        
        {/* Include the Definition Manager Component */}
        <DefinitionManager />
      </div>
    </div>
  );
}
