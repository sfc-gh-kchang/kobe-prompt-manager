import { Block, Category } from "./types";

export interface Prompt {
  id: string;
  title: string;
  blocks: Block[];
  lastUsed: Date;
  lastEdited: Date;
  categoryId: string;
}

export const initialCategories: Category[] = [
  {
    id: "1",
    title: "Code Prompts",
    isExpanded: true,
    prompts: [
      {
        id: "1-1",
        title: "Code Restyling",
        categoryId: "1",
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        blocks: [
          {
            id: "b1",
            type: "text",
            content: "Please restyle the following code to match this example:",
            order: 0,
          },
          {
            id: "b2",
            type: "example",
            content:
              "// Example of desired code style\nfunction greeting(name) {\n  return `Hello, ${name}!`;\n}",
            order: 1,
          },
          { id: "b3", type: "input", content: "", order: 2 },
        ],
      },
      {
        id: "1-2",
        title: "React Component Generator",
        categoryId: "1",
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        blocks: [
          {
            id: "b4",
            type: "text",
            content:
              "Create a React component with the following requirements:",
            order: 0,
          },
          {
            id: "b5",
            type: "example",
            content:
              '// Example component structure:\nimport React from "react";\n\nconst MyComponent = () => {\n  return <div>Content</div>;\n};',
            order: 1,
          },
          { id: "b6", type: "text", content: "Requirements:", order: 2 },
          { id: "b7", type: "input", content: "", order: 3 },
        ],
      },
    ],
  },
];
