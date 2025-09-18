"use client";

import { useState, useRef, useEffect } from "react";
import { HorizontalScrollGallery } from "./horizontal-scroll-gallery";

interface GlassCapsuleProps {}

export function GlassCapsules() {
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  const categories = [
    { name: 'Business', emoji: '💼' },
    { name: 'Technology', emoji: '💻' },
    { name: 'Health', emoji: '🏥' },
    { name: 'Education', emoji: '📚' },
    { name: 'Entertainment', emoji: '🎬' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Travel', emoji: '✈️' },
    { name: 'Food', emoji: '🍕' },
    { name: 'Music', emoji: '🎵' },
    { name: 'Art', emoji: '🎨' },
    { name: 'Science', emoji: '🔬' },
    { name: 'Finance', emoji: '💰' },
    { name: 'Fashion', emoji: '👗' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'Nature', emoji: '🌿' }
  ];

  // Split categories into two rows
  const firstRowCategories = categories.slice(0, Math.ceil(categories.length / 2));
  const secondRowCategories = categories.slice(Math.ceil(categories.length / 2));
  const languages = ['English', 'German', 'Spanish', 'French', 'Chinese', 'Italian', 'Dutch', 'Vietnamese', 'Arabic'];

  const filteredLanguages = languages.filter(language =>
    language.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.filter(cat => cat !== 'all');
      if (selectedCategories.includes(categoryName)) {
        const filtered = newCategories.filter(cat => cat !== categoryName);
        setSelectedCategories(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedCategories([...newCategories, categoryName]);
      }
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(selectedLanguage === language ? '' : language);
    setShowLanguages(false);
    setLanguageSearch('');
  };

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLanguages(!showLanguages);
    setLanguageSearch('');
  };

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguages) {
        setShowLanguages(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLanguages]);

  return (
    <div className="relative w-full mb-6">
      <HorizontalScrollGallery className="gap-3">
        <div className="flex flex-col gap-3 min-w-fit">
          {/* First Row */}
          <div className="flex gap-3 min-w-fit">
            {/* All button with glass effect */}
            <button
              onClick={() => handleCategoryClick('all')}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 overflow-hidden cursor-pointer group shadow-lg shadow-black/20 ${
                selectedCategories.includes('all')
                  ? 'text-black'
                  : 'text-white'
              }`}
            >
              {/* Glass layers for selected state */}
              {selectedCategories.includes('all') ? (
                <>
                  <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  <div className="absolute inset-0 shadow-lg shadow-cyan-400/30"></div>
                </>
              ) : (
                <>
                  {/* Glass effect layers */}
                  <div className="glass-filter--cards absolute inset-0 rounded-full"></div>
                  <div className="glass-overlay--cards absolute inset-0 rounded-full"></div>
                  <div className="glass-specular--cards absolute inset-0 rounded-full"></div>
                  <div className="absolute inset-0 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-full"></div>
                </>
              )}
              <span className="relative z-10">🌟</span>
              <span className="relative z-10">All</span>
            </button>

            {/* First Row Categories with glass effect */}
            {firstRowCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 overflow-hidden cursor-pointer group shadow-lg shadow-black/20 ${
                  selectedCategories.includes(category.name)
                    ? 'text-black'
                    : 'text-white'
                }`}
              >
                {/* Glass layers for selected state */}
                {selectedCategories.includes(category.name) ? (
                  <>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                    <div className="absolute inset-0 shadow-lg shadow-cyan-400/30"></div>
                  </>
                ) : (
                  <>
                    {/* Glass effect layers */}
                    <div className="glass-filter--cards absolute inset-0 rounded-full"></div>
                    <div className="glass-overlay--cards absolute inset-0 rounded-full"></div>
                    <div className="glass-specular--cards absolute inset-0 rounded-full"></div>
                    <div className="absolute inset-0 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-full"></div>
                  </>
                )}
                <span className="relative z-10">{category.emoji}</span>
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex gap-3 min-w-fit">
            {/* Language Selector with glass effect */}
            <div className="relative">
              <button
                onClick={handleLanguageToggle}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 overflow-hidden cursor-pointer group shadow-lg shadow-black/20 text-white"
                id="language-selector-button"
              >
                {/* Glass effect layers */}
                <div className="glass-filter--cards absolute inset-0 rounded-full"></div>
                <div className="glass-overlay--cards absolute inset-0 rounded-full"></div>
                <div className="glass-specular--cards absolute inset-0 rounded-full"></div>
                <div className="absolute inset-0 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-full"></div>
                
                <span className="relative z-10">🌍</span>
                <span className="relative z-10">{selectedLanguage && ` ${selectedLanguage}`}</span>
              </button>
            </div>

            {/* Second Row Categories with glass effect */}
            {secondRowCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 overflow-hidden cursor-pointer group shadow-lg shadow-black/20 ${
                  selectedCategories.includes(category.name)
                    ? 'text-black'
                    : 'text-white'
                }`}
              >
                {/* Glass layers for selected state */}
                {selectedCategories.includes(category.name) ? (
                  <>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                    <div className="absolute inset-0 shadow-lg shadow-cyan-400/30"></div>
                  </>
                ) : (
                  <>
                    {/* Glass effect layers */}
                    <div className="glass-filter--cards absolute inset-0 rounded-full"></div>
                    <div className="glass-overlay--cards absolute inset-0 rounded-full"></div>
                    <div className="glass-specular--cards absolute inset-0 rounded-full"></div>
                    <div className="absolute inset-0 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-full"></div>
                  </>
                )}
                <span className="relative z-10">{category.emoji}</span>
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </HorizontalScrollGallery>

      {/* Language Dropdown - Below capsules container with glass effect */}
      {showLanguages && (
        <div className="absolute mt-2 mx-4 md:mx-0 z-50">
          <div 
            className="relative overflow-hidden w-fit min-w-[120px] max-w-[200px] rounded-xl cursor-pointer group shadow-lg shadow-black/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass effect layers for dropdown */}
            <div className="glass-filter--cards absolute inset-0"></div>
            <div className="glass-overlay--cards absolute inset-0"></div>
            <div className="glass-specular--cards absolute inset-0"></div>
            <div className="absolute inset-0 border border-white/10 rounded-xl"></div>
            
            <div className="relative z-10 max-h-80 overflow-hidden">
              {/* Search Bar */}
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <svg
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 bg-transparent text-white text-xs placeholder-zinc-400 focus:outline-none border border-white/10 rounded-md focus:border-cyan-400/50"
                  />
                </div>
              </div>
              
              {/* Language List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredLanguages.length === 0 ? (
                  <div className="p-3 text-zinc-400 text-sm text-center">
                    No languages found
                  </div>
                ) : (
                  filteredLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageSelect(language)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 hover:bg-white/10 ${
                        selectedLanguage === language
                          ? 'text-cyan-400 bg-cyan-400/10'
                          : 'text-zinc-300'
                      }`}
                    >
                      {language}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}