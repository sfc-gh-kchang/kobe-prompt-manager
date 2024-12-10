import React, { useState, useRef, useEffect } from "react";
import { Prompt, Block, Version } from "../types";
import {
  Copy,
  Edit2,
  Save,
  Plus,
  X,
  Trash2,
  Moon,
  Sun,
  Check,
  ChevronDown,
} from "lucide-react";
import BlockComponent from "./Block";
import { useTheme } from "../contexts/ThemeContext";

interface PromptEditorProps {
  prompt: Prompt | null;
  isEditing: boolean;
  onEditToggle: () => void;
  onUpdatePrompt: (updatedPrompt: Prompt) => void;
  onBuildAndCopyPrompt: (promptId: string) => void;
  onDeletePrompt: (promptId: string) => void;
  onSave: (currentVersion: Version) => void;
  onCreateNewPrompt: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  isEditing,
  onEditToggle,
  onUpdatePrompt,
  onBuildAndCopyPrompt,
  onDeletePrompt,
  onSave,
  onCreateNewPrompt,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
  const addBlockButtonRef = useRef<HTMLButtonElement>(null);
  const blockMenuRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prompt && prompt.versions && prompt.versions.length > 0) {
      setCurrentVersion(prompt.versions[prompt.versions.length - 1]);
    } else {
      setCurrentVersion(null);
    }
  }, [prompt]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        blockMenuRef.current &&
        !blockMenuRef.current.contains(event.target as Node) &&
        addBlockButtonRef.current &&
        !addBlockButtonRef.current.contains(event.target as Node)
      ) {
        setShowBlockMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (titleRef.current && currentVersion) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [currentVersion?.title]);

  if (!prompt || !currentVersion) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="text-center space-y-4 max-w-xl px-4">
          <h2 className="text-2xl font-semibold">Welcome to Prompt Manager</h2>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Select a prompt from the sidebar or create a new one to get started
          </p>
          <button
            onClick={() => {
              onCreateNewPrompt();
              onEditToggle();
            }}
            className={`px-4 py-2 ${
              theme === "dark"
                ? "bg-white text-black hover:bg-white/90"
                : "bg-black text-white hover:bg-black/90"
            } rounded-md flex items-center space-x-2 transition-colors mx-auto`}
          >
            <Plus size={18} />
            <span>New Prompt</span>
          </button>
        </div>
      </div>
    );
  }

  const handleBlockUpdate = (updatedBlock: Block) => {
    console.log("Block being updated:", updatedBlock);
    const updatedBlocks = currentVersion.blocks.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    const newVersion = { ...currentVersion, blocks: updatedBlocks };
    console.log("Updated version:", newVersion);
    setCurrentVersion(newVersion);
  };

  const handleSave = () => {
    if (!prompt || !currentVersion) return;
    console.log("Saving current version:", currentVersion);
    onSave(currentVersion);
    onEditToggle();
  };

  const handleBlockReorder = (draggedId: string, targetId: string) => {
    const updatedBlocks = [...currentVersion.blocks];
    const draggedIndex = updatedBlocks.findIndex(
      (block) => block.id === draggedId
    );
    const targetIndex = updatedBlocks.findIndex(
      (block) => block.id === targetId
    );

    const [draggedBlock] = updatedBlocks.splice(draggedIndex, 1);
    updatedBlocks.splice(targetIndex, 0, draggedBlock);

    setCurrentVersion({ ...currentVersion, blocks: updatedBlocks });
  };

  const shouldUpdateTimestamp = (lastTimestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastTimestamp.getTime();
    const hoursDiff = diff / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  const handleCopyPrompt = async () => {
    const promptText = currentVersion.blocks
      .map((block) => {
        if (block.type === "input") {
          return `${block.description}: ${
            block.content || "[Your input here]"
          }`;
        }
        return block.content;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(promptText);
      if (shouldUpdateTimestamp(prompt.lastUsed)) {
        onBuildAndCopyPrompt(prompt.id);
      }
      setShowCopyConfirmation(true);
      setTimeout(() => setShowCopyConfirmation(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleAddBlock = (type: "text" | "example" | "input") => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      description: type === "input" ? "" : undefined,
      order: currentVersion.blocks.length,
    };
    setCurrentVersion({
      ...currentVersion,
      blocks: [...currentVersion.blocks, newBlock],
    });
    setShowBlockMenu(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentVersion({ ...currentVersion, title: e.target.value });
  };

  const handleVersionChange = (versionId: string) => {
    const selectedVersion = prompt.versions.find((v) => v.id === versionId);
    if (selectedVersion) {
      setCurrentVersion(selectedVersion);
    }
  };

  const handleGetFeedback = async () => {
    const promptText = currentVersion.blocks
      .map((block) => {
        if (block.type === "input") {
          return `${block.description}: ${
            block.content || "[Your input here]"
          }`;
        }
        return block.content;
      })
      .join("\n\n");

    const feedbackPrompt = `XXX: ${promptText}`;

    try {
      await navigator.clipboard.writeText(feedbackPrompt);
      setShowCopyConfirmation(true);
      setTimeout(() => setShowCopyConfirmation(false), 2000);
    } catch (err) {
      console.error("Failed to copy feedback prompt:", err);
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`min-h-[4rem] flex items-center justify-between px-4 border-b ${
          theme === "dark" ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col flex-1 py-2 mr-4">
          <textarea
            ref={titleRef}
            value={currentVersion.title}
            onChange={handleTitleChange}
            className={`w-full text-lg font-medium bg-transparent border-none focus:outline-none resize-none ${
              theme === "dark" ? "placeholder-white/40" : "placeholder-gray-400"
            }`}
            readOnly={!isEditing}
            placeholder="Untitled Prompt"
            rows={1}
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          <div
            className={`text-sm ${
              theme === "dark" ? "text-white/40" : "text-gray-500"
            }`}
          >
            Last edited: {currentVersion.lastEdited.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <select
            value={currentVersion.id}
            onChange={(e) => handleVersionChange(e.target.value)}
            className={`p-2 rounded-md ${
              theme === "dark"
                ? "bg-zinc-800 text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {prompt.versions.map((version) => (
              <option key={version.id} value={version.id}>
                Version {version.versionNumber}
              </option>
            ))}
          </select>
          <button
            onClick={toggleTheme}
            className={`p-2 ${
              theme === "dark"
                ? "text-white/60 hover:bg-white/10"
                : "text-gray-600 hover:bg-gray-100"
            } rounded-md`}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {!isEditing ? (
            <button
              onClick={onEditToggle}
              className={`px-3 py-1.5 text-sm ${
                theme === "dark"
                  ? "text-white hover:bg-white/10"
                  : "text-black hover:bg-gray-100"
              } rounded-md transition-colors flex items-center space-x-2`}
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          ) : (
            <button
              onClick={onEditToggle}
              className={`p-2 ${
                theme === "dark"
                  ? "text-white/60 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100"
              } rounded-md`}
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => onDeletePrompt(prompt.id)}
            className={`p-2 ${
              theme === "dark"
                ? "text-red-500 hover:bg-white/10"
                : "text-red-600 hover:bg-gray-100"
            } rounded-md`}
            title="Delete Prompt"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 p-6 overflow-y-auto ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="space-y-4">
            {currentVersion.blocks.map((block, index) => (
              <BlockComponent
                key={block.id}
                block={block}
                isEditing={isEditing}
                onUpdate={handleBlockUpdate}
                onReorder={handleBlockReorder}
                index={index}
              />
            ))}
          </div>
          {isEditing && (
            <button
              ref={addBlockButtonRef}
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className={`px-3 py-1.5 ${
                theme === "dark"
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              } rounded-md flex items-center space-x-2 transition-colors`}
            >
              <Plus size={16} />
              <span>Add Block</span>
            </button>
          )}
        </div>
      </div>
      <div
        className={`h-16 flex items-center justify-between px-4 ${
          theme === "dark"
            ? "bg-black border-t border-white/10"
            : "bg-gray-100 border-t border-gray-200"
        }`}
      >
        {isEditing ? (
          <button
            onClick={handleSave}
            className={`px-4 py-2 ${
              theme === "dark"
                ? "bg-white text-black hover:bg-white/90"
                : "bg-black text-white hover:bg-black/90"
            } rounded-md flex items-center space-x-2 transition-colors`}
          >
            <Save size={18} />
            <span>Save Prompt</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleGetFeedback}
              className={`px-4 py-2 ${
                theme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } rounded-md flex items-center space-x-2 transition-colors`}
            >
              <span>Get Feedback for Prompt</span>
            </button>
            <div className="relative">
              {showCopyConfirmation && (
                <div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#1a7f64] text-white px-3 py-1.5 rounded-md text-sm flex items-center space-x-2 animate-fadeOutUp"
                  style={{
                    animation: "fadeOutUp 2s ease-out forwards",
                  }}
                >
                  <Check size={14} className="text-white" />
                  <span>Prompt copied to clipboard</span>
                </div>
              )}
              <button
                onClick={handleCopyPrompt}
                className={`px-4 py-2 ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                } rounded-md flex items-center space-x-2 transition-colors`}
              >
                <Copy size={18} />
                <span>Build and Copy Prompt</span>
              </button>
            </div>
          </>
        )}
      </div>
      {showBlockMenu && (
        <div
          ref={blockMenuRef}
          className={`absolute ${
            theme === "dark"
              ? "bg-zinc-800 border-white/10"
              : "bg-white border-gray-200"
          } border rounded-md shadow-lg z-10`}
          style={{
            bottom: "4rem",
            left: addBlockButtonRef.current?.offsetLeft,
          }}
        >
          {["text", "example", "input"].map((type) => (
            <button
              key={type}
              onClick={() => handleAddBlock(type as any)}
              className={`w-full px-4 py-2 text-left ${
                theme === "dark"
                  ? "text-white hover:bg-white/10"
                  : "text-black hover:bg-gray-100"
              } first:rounded-t-md last:rounded-b-md`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Block
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptEditor;
