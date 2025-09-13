"use client";

import { useState } from "react";

export function SearchSection() {
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const categories = ['Business', 'Technology', 'Health', 'Education', 'Entertainment', 'Sports'];
  const languages = ['All', 'English', 'German', 'Spanish', 'French', 'Chinese', 'Italian', 'Dutch', 'Vietnamese', 'Arabic'];

  const handleCategoryClick = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.filter(cat => cat !== 'all');
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter(cat => cat !== category);
        setSelectedCategories(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguages(false);
  };

  return (
    <div className="mb-8">
      {/* Search Bar with Enhanced Glass Morphism */}
      <div className="relative max-w-md mx-auto mb-6">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 h-5 w-5 text-zinc-400"
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
            placeholder="Search for people or meetings..."
            className="w-full bg-transparent text-white placeholder-zinc-400 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Capsules */}
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto relative">
        {/* All Category */}
        <button
          onClick={() => handleCategoryClick('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategories.includes('all')
              ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
              : 'bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10'
          }`}
        >
          All
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10 flex items-center gap-1"
          >
            🌍 {selectedLanguage}
          </button>
          
          {/* Language Dropdown */}
          {showLanguages && (
            <div className="absolute top-full mt-2 left-0 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl z-50 min-w-[160px] max-h-64 overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                    selectedLanguage === language
                      ? 'bg-cyan-400/20 text-cyan-400'
                      : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Regular Categories */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategories.includes(category)
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                : 'bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

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