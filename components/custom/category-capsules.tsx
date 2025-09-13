"use client";

import { useState } from "react";

interface CategoryCapsuleProps {}

export function CategoryCapsules() {
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

  const handleLanguageToggle = () => {
    setShowLanguages(!showLanguages);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguages(false);
    setLanguageSearch('');
  };

  const handleClearLanguage = () => {
    setSelectedLanguage('');
    setShowLanguages(false);
    setLanguageSearch('');
  };

  return (
    <div className="mb-8">
      {/* Category Capsules */}
      <div className="w-screen relative -mx-4 md:w-full md:mx-0">
        {/* Horizontally scrollable container */}
        <div className="overflow-x-auto scrollbar-hide px-4 md:px-0">
          <div className="flex flex-col gap-3 min-w-fit pb-2">
            {/* First Row */}
            <div className="flex gap-3 min-w-fit">
              {/* All Category */}
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                  selectedCategories.includes('all')
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                    : 'bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10'
                }`}
              >
                🌟 All
              </button>

              {/* First Row Categories */}
              {firstRowCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                    selectedCategories.includes(category.name)
                      ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                      : 'bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex gap-3 min-w-fit">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={handleLanguageToggle}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10 flex items-center gap-1 whitespace-nowrap"
                  id="language-selector-button"
                >
                  🌍{selectedLanguage && ` ${selectedLanguage}`}
                </button>
              </div>

              {/* Second Row Categories */}
              {secondRowCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                    selectedCategories.includes(category.name)
                      ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                      : 'bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language Dropdown - Below capsules container */}
      {showLanguages && (
        <div className="absolute mt-2 mx-4 md:mx-0 z-50">
          <div 
            className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl max-h-80 overflow-hidden w-fit min-w-[120px] max-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Search Bar */}
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-zinc-400"
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
                placeholder="Search..."
                value={languageSearch}
                onChange={(e) => setLanguageSearch(e.target.value)}
                className="w-full bg-white/5 text-white placeholder-zinc-400 pl-7 pr-2 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400/50 border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          {/* Languages List */}
          <div className="max-h-48 overflow-y-auto">
            {/* Clear/All Option */}
            <button
              onClick={handleClearLanguage}
              className={`w-full text-left px-3 py-2 text-xs transition-colors duration-200 whitespace-nowrap ${
                !selectedLanguage
                  ? 'bg-cyan-400/20 text-cyan-400'
                  : 'text-zinc-300 hover:bg-white/10'
              }`}
            >
              All Languages
            </button>
            
            {/* Filtered Languages */}
            {filteredLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors duration-200 whitespace-nowrap ${
                  selectedLanguage === language
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : 'text-zinc-300 hover:bg-white/10'
                }`}
              >
                {language}
              </button>
            ))}
            
            {/* No results message */}
            {filteredLanguages.length === 0 && languageSearch && (
              <div className="px-3 py-2 text-xs text-zinc-500 whitespace-nowrap">
                No languages found
              </div>
            )}
          </div>
          </div>
        </div>
      )}

      {/* Click outside to close languages dropdown */}
      {showLanguages && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLanguages(false)}
        />
      )}
    </div>
  );
}