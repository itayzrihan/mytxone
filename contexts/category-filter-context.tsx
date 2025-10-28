"use client";

import React, { createContext, useContext, useState } from "react";

interface CategoryFilterContextType {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextType | undefined>(undefined);

export function CategoryFilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);

  return (
    <CategoryFilterContext.Provider value={{ selectedCategories, setSelectedCategories }}>
      {children}
    </CategoryFilterContext.Provider>
  );
}

export function useCategoryFilter() {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error("useCategoryFilter must be used within CategoryFilterProvider");
  }
  return context;
}
