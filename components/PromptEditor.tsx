import React, { useState, useRef, useEffect } from "react";
import { Prompt, Block } from "../types";
import { Copy, Edit2, Save, Plus, X, Trash2 } from "lucide-react";
import BlockComponent from "./Block";

interface PromptEditorProps {
  prompt: Prompt | null;
  isEditing: boolean;
  onEditToggle: () => void;
  onUpdatePrompt: (updatedPrompt: Prompt) => void;
  onBuildAndCopyPrompt: (promptId: string) => void;
  onDeletePrompt: (promptId: string) => void;
  onSave: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  isEditing,
  onEditToggle,
  onUpdatePrompt,
  onBuildAndCopyPrompt,
  onDeletePrompt,
  onSave,
}) => {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const addBlockButtonRef = useRef<HTMLButtonElement>(null);
  const blockMenuRef = useRef<HTMLDivElement>(null);

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

  if (!prompt) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#343541] text-[#ECECF1]">
        <div className="text-center space-y-4 max-w-xl px-4">
          <h2 className="text-2xl font-semibold">Welcome to Prompt Manager</h2>
          <p className="text-[#8A8F98]">
            Select a prompt from the sidebar or create a new one to get started
          </p>
        </div>
      </div>
    );
  }

  const handleBlockUpdate = (updatedBlock: Block) => {
    const updatedBlocks = prompt.blocks.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    onUpdatePrompt({ ...prompt, blocks: updatedBlocks });
  };

  const handleBlockReorder = (draggedId: string, targetId: string) => {
    const updatedBlocks = [...prompt.blocks];
    const draggedIndex = updatedBlocks.findIndex(
      (block) => block.id === draggedId
    );
    const targetIndex = updatedBlocks.findIndex(
      (block) => block.id === targetId
    );

    const [draggedBlock] = updatedBlocks.splice(draggedIndex, 1);
    updatedBlocks.splice(targetIndex, 0, draggedBlock);

    onUpdatePrompt({ ...prompt, blocks: updatedBlocks });
  };

  const handleCopyPrompt = async () => {
    const promptText = prompt.blocks
      .map((block) => {
        if (block.type === "input") {
          return block.content || "[Your input here]";
        }
        return block.content;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(promptText);
      onBuildAndCopyPrompt(prompt.id);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleAddBlock = (type: "text" | "example" | "input") => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      order: prompt.blocks.length,
    };
    onUpdatePrompt({ ...prompt, blocks: [...prompt.blocks, newBlock] });
    setShowBlockMenu(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePrompt({ ...prompt, title: e.target.value });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#343541]">
      <div className="h-14 flex items-center justify-between px-4 bg-[#2A2B32] border-b border-[#4E4F60]/20">
        <div className="flex flex-col">
          <input
            type="text"
            value={prompt.title}
            onChange={handleTitleChange}
            className="text-lg font-medium bg-transparent border-none focus:outline-none text-[#ECECF1] placeholder-[#8A8F98]"
            readOnly={!isEditing}
            placeholder="Untitled Prompt"
          />
          <div className="text-sm text-[#8A8F98]">
            Last edited: {prompt.lastEdited.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={onEditToggle}
              className="px-3 py-1.5 text-sm text-[#29B5E8] hover:bg-[#2A2B32] rounded-md transition-colors flex items-center space-x-2"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          ) : (
            <button
              onClick={onEditToggle}
              className="p-2 text-[#8A8F98] hover:bg-[#2A2B32] rounded-md"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => onDeletePrompt(prompt.id)}
            className="p-2 text-red-500 hover:bg-[#2A2B32] rounded-md"
            title="Delete Prompt"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {isEditing && (
            <div className="flex items-center space-x-2 mb-6">
              <button
                ref={addBlockButtonRef}
                onClick={() => setShowBlockMenu(!showBlockMenu)}
                className="px-3 py-1.5 bg-[#2A2B32] hover:bg-[#40414F] text-[#ECECF1] rounded-md flex items-center space-x-2 transition-colors"
              >
                <Plus size={16} />
                <span>Add Block</span>
              </button>
              {showBlockMenu && (
                <div
                  ref={blockMenuRef}
                  className="absolute bg-[#2A2B32] border border-[#4E4F60]/20 rounded-md shadow-lg z-10"
                  style={{
                    top: addBlockButtonRef.current
                      ? addBlockButtonRef.current.offsetTop +
                        addBlockButtonRef.current.offsetHeight +
                        4
                      : "auto",
                    left: addBlockButtonRef.current
                      ? addBlockButtonRef.current.offsetLeft
                      : "auto",
                  }}
                >
                  {["text", "example", "input"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAddBlock(type as any)}
                      className="w-full px-4 py-2 text-left text-[#ECECF1] hover:bg-[#40414F] first:rounded-t-md last:rounded-b-md"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)} Block
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-4">
            {prompt.blocks.map((block) => (
              <BlockComponent
                key={block.id}
                block={block}
                isEditing={isEditing}
                onUpdate={handleBlockUpdate}
                onReorder={handleBlockReorder}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-16 flex items-center justify-center px-4 bg-[#2A2B32] border-t border-[#4E4F60]/20">
        {isEditing ? (
          <button
            onClick={() => {
              onSave();
              onEditToggle();
            }}
            className="px-4 py-2 bg-[#10A37F] hover:bg-[#1A7F64] text-white rounded-md flex items-center space-x-2 transition-colors"
          >
            <Save size={18} />
            <span>Save Prompt</span>
          </button>
        ) : (
          <button
            onClick={handleCopyPrompt}
            className="px-4 py-2 bg-[#29B5E8] hover:bg-[#1C9BCE] text-white rounded-md flex items-center space-x-2 transition-colors"
          >
            <Copy size={18} />
            <span>Build and Copy Prompt</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
