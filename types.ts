// types.ts - Update BlockType and Block interface
export type BlockType = "text" | "example" | "input" | "timestamp";

export interface TimestampBlockData {
  baseTimestamp: string; // ISO string
  minutesBack: number;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  description?: string;
  order: number;
  timestampData?: TimestampBlockData;
}

export interface Version {
  id: string;
  versionNumber: number;
  title: string;
  blocks: Block[];
  lastEdited: Date;
}

export interface Prompt {
  id: string;
  versions: Version[];
  lastUsed: Date;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  prompts: Prompt[];
  isExpanded?: boolean;
}
