import { useState, useEffect } from "react";
import { Category, Prompt, Version } from "../types";

const isValidVersionArray = (versions: any[]): versions is Version[] => {
  return versions.every(
    (version) =>
      typeof version === "object" &&
      version !== null &&
      typeof version.id === "string" &&
      typeof version.versionNumber === "number" &&
      typeof version.title === "string" &&
      Array.isArray(version.blocks) &&
      version.blocks.every(
        (block: any) =>
          typeof block === "object" &&
          block !== null &&
          typeof block.id === "string" &&
          typeof block.type === "string" &&
          typeof block.content === "string" &&
          typeof block.order === "number"
      )
  );
};

const isValidCategoryArray = (data: any): data is Category[] => {
  if (!Array.isArray(data)) return false;

  return data.every((category) => {
    if (typeof category !== "object" || !category) return false;
    if (!category.id || !category.title || !Array.isArray(category.prompts))
      return false;

    return category.prompts.every(
      (prompt: any) =>
        typeof prompt === "object" &&
        prompt !== null &&
        typeof prompt.id === "string" &&
        Array.isArray(prompt.versions) &&
        isValidVersionArray(prompt.versions)
    );
  });
};

export const usePersistedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Load data after component mounts
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
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
              versions: prompt.versions.map((version: any) => ({
                ...version,
                lastEdited: new Date(version.lastEdited),
              })),
            })),
          }));
          setCategories(processedCategories);
        }
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const saveCategories = (newCategories: Category[]) => {
    try {
      const dataToStore = newCategories.map((category) => ({
        ...category,
        prompts: category.prompts.map((prompt) => ({
          ...prompt,
          lastUsed: prompt.lastUsed.toISOString(),
          versions: prompt.versions.map((version) => ({
            ...version,
            lastEdited: version.lastEdited.toISOString(),
          })),
        })),
      }));

      localStorage.setItem("promptCategories", JSON.stringify(dataToStore));
      setCategories(newCategories);
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem("promptCategories");
      setCategories([]);
      console.log("Local storage cleared successfully");
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  };

  return { categories, saveCategories, clearStorage, loadCategories };
};
