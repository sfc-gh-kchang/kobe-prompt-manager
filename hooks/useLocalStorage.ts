// hooks/useLocalStorage.ts
import { useState, useEffect } from "react";
import { Category, Prompt } from "../types";

const isValidCategoryArray = (data: any): data is Category[] => {
  if (!Array.isArray(data)) return false;

  return data.every((category) => {
    if (typeof category !== "object" || !category) return false;
    if (!category.id || !category.title || !Array.isArray(category.prompts))
      return false;

    return category.prompts.every((prompt: Prompt) => {
      if (!prompt.id || !prompt.title || !Array.isArray(prompt.blocks))
        return false;
      return true;
    });
  });
};

export const usePersistedCategories = () => {
  // Initialize with empty array to prevent hydration mismatch
  const [categories, setCategories] = useState<Category[]>([]);

  // Load data after component mounts
  useEffect(() => {
    try {
      const stored = localStorage.getItem("promptCategories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isValidCategoryArray(parsed)) {
          const processedCategories = parsed.map((category) => ({
            ...category,
            prompts: category.prompts.map((prompt) => ({
              ...prompt,
              lastUsed: new Date(prompt.lastUsed),
              lastEdited: new Date(prompt.lastEdited),
            })),
          }));
          setCategories(processedCategories);
        }
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }, []); // Run only once on mount

  const saveCategories = (newCategories: Category[]) => {
    try {
      const dataToStore = newCategories.map((category) => ({
        ...category,
        prompts: category.prompts.map((prompt) => ({
          ...prompt,
          lastUsed: prompt.lastUsed.toISOString(),
          lastEdited: prompt.lastEdited.toISOString(),
        })),
      }));

      localStorage.setItem("promptCategories", JSON.stringify(dataToStore));
      setCategories(newCategories);
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  };

  return { categories, saveCategories };
};
