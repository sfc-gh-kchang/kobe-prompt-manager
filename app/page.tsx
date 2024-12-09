// page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Category, Prompt } from "../types";
import Sidebar from "../components/Sidebar";
import PromptEditor from "../components/PromptEditor";
import { initialCategories } from "../initialData";
import { usePersistedCategories } from "../hooks/useLocalStorage";

export default function Page() {
  // Use null as initial state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const { categories, saveCategories } = usePersistedCategories();
  const [draftCategories, setDraftCategories] = useState<Category[]>(
    categories.length > 0 ? categories : initialCategories
  );
  const [selectedPrompt, setSelectedPrompt] = useState<{
    categoryId: string;
    promptId: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getSelectedPromptData = () => {
    if (!selectedPrompt) return null;
    const category = draftCategories.find(
      (c) => c.id === selectedPrompt.categoryId
    );
    if (!category) return null;
    return category.prompts.find((p) => p.id === selectedPrompt.promptId);
  };

  const handlePromptSelect = (categoryId: string, promptId: string) => {
    setSelectedPrompt({ categoryId, promptId });
    setIsEditing(false);
  };

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    if (!selectedPrompt) return;
    setDraftCategories(
      draftCategories.map((category) =>
        category.id === selectedPrompt.categoryId
          ? {
              ...category,
              prompts: category.prompts.map((prompt) =>
                prompt.id === selectedPrompt.promptId
                  ? { ...updatedPrompt, lastEdited: new Date() }
                  : prompt
              ),
            }
          : category
      )
    );
  };

  const handleSavePrompt = () => {
    saveCategories(draftCategories);
    setIsEditing(false);
  };

  const handleCreateNewPrompt = () => {
    const newPrompt: Prompt = {
      id: `p${Date.now()}`,
      title: "New Prompt",
      blocks: [],
      lastUsed: new Date(),
      lastEdited: new Date(),
      categoryId: draftCategories[0].id,
    };

    const updatedCategories = draftCategories.map((category) =>
      category.id === draftCategories[0].id
        ? {
            ...category,
            prompts: [...category.prompts, newPrompt],
          }
        : category
    );

    setDraftCategories(updatedCategories);
    setSelectedPrompt({
      categoryId: draftCategories[0].id,
      promptId: newPrompt.id,
    });
    setIsEditing(true);
  };

  const handleBuildAndCopyPrompt = (promptId: string) => {
    const updatedCategories = draftCategories.map((category) =>
      category.prompts.some((prompt) => prompt.id === promptId)
        ? {
            ...category,
            prompts: category.prompts.map((prompt) =>
              prompt.id === promptId
                ? { ...prompt, lastUsed: new Date() }
                : prompt
            ),
          }
        : category
    );

    setDraftCategories(updatedCategories);
    saveCategories(updatedCategories); // Save after copying
  };

  const handleDeletePrompt = () => {
    if (!selectedPrompt) return;

    const updatedCategories = draftCategories.map((category) =>
      category.id === selectedPrompt.categoryId
        ? {
            ...category,
            prompts: category.prompts.filter(
              (prompt) => prompt.id !== selectedPrompt.promptId
            ),
          }
        : category
    );

    setDraftCategories(updatedCategories);
    saveCategories(updatedCategories); // Save after deletion
    setSelectedPrompt(null);
    setIsEditing(false);
  };

  // Initialize client-side state after hydration
  useEffect(() => {
    setIsClient(true);
    setDraftCategories(categories.length > 0 ? categories : initialCategories);
  }, [categories]);

  // Don't render until after hydration
  if (!isClient) {
    return (
      <div className="h-screen flex bg-[#343541] text-[#ECECF1]">
        <div className="w-full flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#343541] text-[#ECECF1]">
      <Sidebar
        categories={draftCategories}
        selectedPrompt={selectedPrompt}
        onPromptSelect={handlePromptSelect}
        onCreateNewPrompt={handleCreateNewPrompt}
      />
      <PromptEditor
        prompt={getSelectedPromptData() ?? null}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onUpdatePrompt={handleUpdatePrompt}
        onBuildAndCopyPrompt={handleBuildAndCopyPrompt}
        onDeletePrompt={handleDeletePrompt}
        onSave={handleSavePrompt}
      />
    </div>
  );
}
