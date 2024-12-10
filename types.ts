export type BlockType = "text" | "example" | "input";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  description?: string;
  order: number;
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
