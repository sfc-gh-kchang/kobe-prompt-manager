import React from "react";
import { Category, Prompt } from "../types";
import { FileText, Plus } from "lucide-react";

interface SidebarProps {
  categories: Category[];
  selectedPrompt: { categoryId: string; promptId: string } | null;
  onPromptSelect: (categoryId: string, promptId: string) => void;
  onCreateNewPrompt: () => void;
}

const NorthStarIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 206 210"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M99.4999 114.793L1.48954e-05 103L99.4999 92.7929L206 103L99.4999 114.793Z" />
    <path d="M99.4999 114.793L1.48954e-05 103L99.4999 92.7929L206 103L99.4999 114.793Z" />
    <path d="M91.207 103.5L103 4L113.207 103.5L103 210L91.207 103.5Z" />
    <path d="M91.207 103.5L103 4L113.207 103.5L103 210L91.207 103.5Z" />
    <path d="M106.409 110.852L51.6648 153.994L95.5872 100.03L152.994 52.6648L106.409 110.852Z" />
    <path d="M106.409 110.852L51.6648 153.994L95.5872 100.03L152.994 52.6648L106.409 110.852Z" />
    <path d="M96.7746 109.376L53.6323 54.6324L107.596 98.5547L154.962 155.962L96.7746 109.376Z" />
    <path d="M96.7746 109.376L53.6323 54.6324L107.596 98.5547L154.962 155.962L96.7746 109.376Z" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedPrompt,
  onPromptSelect,
  onCreateNewPrompt,
}) => {
  const allPrompts = categories.flatMap((category) => category.prompts);
  const sortedPrompts = allPrompts.sort(
    (a, b) => b.lastUsed.getTime() - a.lastUsed.getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const todayPrompts = sortedPrompts.filter(
    (prompt) => prompt.lastUsed >= today
  );
  const weekPrompts = sortedPrompts.filter(
    (prompt) => prompt.lastUsed < today && prompt.lastUsed >= oneWeekAgo
  );
  const olderPrompts = sortedPrompts.filter(
    (prompt) => prompt.lastUsed < oneWeekAgo
  );

  const renderPromptList = (prompts: Prompt[], title: string) => (
    <div className="mb-6">
      <div className="text-sm text-[#8A8F98] mb-2 px-3">{title}</div>
      <div className="space-y-0.5">
        {prompts.map((prompt) => {
          const latestVersion = prompt.versions?.[prompt.versions?.length - 1];
          return (
            <div
              key={prompt.id}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                selectedPrompt?.promptId === prompt.id
                  ? "bg-[#343541] text-white"
                  : "hover:bg-[#2A2B32] text-[#ECECF1]"
              }`}
              onClick={() => onPromptSelect(prompt.categoryId, prompt.id)}
            >
              <div className="flex items-center">
                <FileText size={14} className="mr-2 opacity-70" />
                <span className="text-sm">{latestVersion?.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-[260px] bg-black text-white overflow-y-auto flex flex-col">
      <div className="p-4 flex items-center border-b border-white/10">
        <div className="flex items-center space-x-2">
          <NorthStarIcon className="w-8 h-8" />
          <span className="font-medium">Prompt Manager</span>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={onCreateNewPrompt}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
        >
          <Plus size={16} />
          <span className="font-medium">New Prompt</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {renderPromptList(todayPrompts, "Today")}
        {weekPrompts.length > 0 &&
          renderPromptList(weekPrompts, "Previous Week")}
        {olderPrompts.length > 0 && renderPromptList(olderPrompts, "Older")}
      </div>
    </div>
  );
};

export default Sidebar;
