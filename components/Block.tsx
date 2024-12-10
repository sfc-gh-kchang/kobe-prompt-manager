import React, { useRef, useEffect } from "react";
import { Block } from "../types";
import { GripVertical, AlignLeft, Code, Type } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface BlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate: (updatedBlock: Block) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  index: number;
}

const BlockComponent: React.FC<BlockProps> = ({
  block,
  isEditing,
  onUpdate,
  onReorder,
  index,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [block.content, block.description]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", block.id);
    if (blockRef.current) {
      blockRef.current.style.opacity = "0.5";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (e.clientY < midpoint) {
        blockRef.current.style.borderTop = "2px solid var(--color-primary)";
        blockRef.current.style.borderBottom = "none";
      } else {
        blockRef.current.style.borderBottom = "2px solid var(--color-primary)";
        blockRef.current.style.borderTop = "none";
      }
    }
  };

  const handleDragLeave = () => {
    if (blockRef.current) {
      blockRef.current.style.borderTop = "none";
      blockRef.current.style.borderBottom = "none";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    onReorder(draggedId, block.id);
    if (blockRef.current) {
      blockRef.current.style.opacity = "1";
      blockRef.current.style.borderTop = "none";
      blockRef.current.style.borderBottom = "none";
    }
  };

  const handleDragEnd = () => {
    if (blockRef.current) {
      blockRef.current.style.opacity = "1";
      blockRef.current.style.borderTop = "none";
      blockRef.current.style.borderBottom = "none";
    }
  };

  const blockIcons = {
    text: (
      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center">
        <AlignLeft size={12} className="text-white" />
      </div>
    ),
    example: (
      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm flex items-center justify-center">
        <Code size={12} className="text-white" />
      </div>
    ),
    input: (
      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-800 rounded-sm flex items-center justify-center">
        <Type size={12} className="text-white" />
      </div>
    ),
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, content: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({ ...block, description: e.target.value });
  };

  const renderContent = () => {
    // Input blocks have editable content and description in all modes
    if (block.type === "input") {
      return (
        <div className="space-y-2">
          <textarea
            ref={descriptionRef}
            className={`w-full p-2 rounded-md ${
              theme === "dark"
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            } resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500`}
            value={block.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Enter input description here..."
            rows={1}
            style={{ minHeight: "2.5rem", height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <textarea
            ref={contentRef}
            className={`w-full p-2 rounded-md ${
              theme === "dark"
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            } resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500`}
            value={block.content}
            onChange={handleContentChange}
            placeholder="Enter your input here..."
            rows={1}
            style={{ minHeight: "2.5rem", height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>
      );
    }

    // Show textarea in edit mode, div in view mode for non-input blocks
    return isEditing ? (
      <textarea
        ref={contentRef}
        className={`w-full p-2 rounded-md ${
          theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
        } resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 ${
          block.type === "example" ? "font-mono" : ""
        }`}
        value={block.content}
        onChange={handleContentChange}
        placeholder={
          block.type === "example"
            ? "Enter example code here..."
            : "Enter prompt text here..."
        }
        rows={1}
        style={{ minHeight: "2.5rem", height: "auto" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
    ) : (
      <div
        className={`w-full p-2 rounded-md ${
          theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
        } border border-gray-700 whitespace-pre-wrap ${
          block.type === "example" ? "font-mono" : ""
        }`}
      >
        {block.content}
      </div>
    );
  };

  return (
    <div
      ref={blockRef}
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`p-4 rounded-md ${
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
      } border border-gray-700 transition-all duration-200 ease-in-out`}
    >
      <div className="flex items-center mb-2 text-gray-400">
        {isEditing && <GripVertical size={16} className="cursor-move mr-2" />}
        {blockIcons[block.type]}
        <span className="text-xs uppercase ml-2">{block.type}</span>
      </div>
      {renderContent()}
    </div>
  );
};

export default BlockComponent;
