"use client";

import React, { useState } from "react";
import { Category, Prompt } from "../types";
import Sidebar from "../components/Sidebar";
import PromptEditor from "../components/PromptEditor";
import { initialCategories } from "../initialData";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    categoryId: string;
    promptId: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getSelectedPromptData = () => {
    if (!selectedPrompt) return null;
    const category = categories.find((c) => c.id === selectedPrompt.categoryId);
    if (!category) return null;
    return category.prompts.find((p) => p.id === selectedPrompt.promptId);
  };

  const handlePromptSelect = (categoryId: string, promptId: string) => {
    setSelectedPrompt({ categoryId, promptId });
    setIsEditing(false);
  };

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    if (!selectedPrompt) return;
    setCategories(
      categories.map((category) =>
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

  const handleCreateNewPrompt = () => {
    const newPrompt: Prompt = {
      id: `p${Date.now()}`,
      title: "New Prompt",
      blocks: [],
      lastUsed: new Date(),
      lastEdited: new Date(),
      categoryId: categories[0].id,
    };

    setCategories(
      categories.map((category) =>
        category.id === categories[0].id
          ? {
              ...category,
              prompts: [...category.prompts, newPrompt],
            }
          : category
      )
    );

    setSelectedPrompt({
      categoryId: categories[0].id,
      promptId: newPrompt.id,
    });
    setIsEditing(true);
  };

  const handleBuildAndCopyPrompt = (promptId: string) => {
    setCategories(
      categories.map((category) =>
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
      )
    );
  };

  return (
    <div className="h-screen flex bg-[#343541] text-[#ECECF1]">
      <Sidebar
        categories={categories}
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
        onDeletePrompt={() => {}}
      />
    </div>
  );
}
