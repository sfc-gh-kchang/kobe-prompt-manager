export type BlockType = "text" | "example" | "input";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  order: number;
}

export interface Prompt {
  id: string;
  title: string;
  blocks: Block[];
  lastUsed: Date;
  lastEdited: Date;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  prompts: Prompt[];
  isExpanded?: boolean;
}
