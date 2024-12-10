import { Block, Category, Prompt, Version } from "./types";

export const initialCategories: Category[] = [
  {
    id: "1",
    title: "Code Prompts",
    isExpanded: true,
    prompts: [
      {
        id: "1-1",
        categoryId: "1",
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        versions: [
          {
            id: "v1-1-1",
            versionNumber: 1,
            title: "Code Restyling",
            lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            blocks: [
              {
                id: "b1",
                type: "text",
                content:
                  "Please restyle the following code to match this example:",
                order: 0,
              },
              {
                id: "b2",
                type: "example",
                content:
                  "// Example of desired code style\nfunction greeting(name) {\n  return `Hello, ${name}!`;\n}",
                order: 1,
              },
              {
                id: "b3",
                type: "input",
                content: "",
                order: 2,
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        categoryId: "1",
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        versions: [
          {
            id: "v1-2-1",
            versionNumber: 1,
            title: "State-based React component",
            lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            blocks: [
              {
                id: "b4",
                type: "text",
                content:
                  "Your task is to create a Typescript React component that follows the given specifications, delivered in this code styling format:",
                order: 0,
              },
              {
                id: "b5",
                type: "example",
                content:
                  "import { themeTokens } from '@snowflake/balto-tokens';\nimport type { IconType } from '@snowflake/core-ui';\nimport { Button, Icon, LoadingIndicator, Row, Text } from '@snowflake/core-ui';\nimport type { IntlShape } from 'react-intl';\nimport { useIntl } from 'react-intl';\nimport type {\n  CortexAnalystEditorMode,\n  CortexAnalystState,\n} from '../../../reduxStore/features/cortex/cortexAnalyst/types/CortexAnalystState';",
                order: 1,
              },
              {
                id: "b6",
                type: "text",
                content:
                  "There are a few main areas about this golden code styling example that I want you to internalize:\n\nClear Separation of Display and Logic\nThe component itself remains purely presentational\nAll state-dependent styling logic is extracted into a separate function\nThis separation makes the code easier to maintain and test independently.",
                order: 2,
              },
              {
                id: "b7",
                type: "input",
                content:
                  "I'm building a new component called CortexAnalystSemanticFileNode\n\nexport interface CortexAnalystSemanticFileNodeProps {\n  fileLocation: CortexAnalystState['semanticModel']['fileLocation'];\n  semanticModelStatus: CortexAnalystState['semanticModel']['status'];\n}",
                order: 3,
              },
            ],
          },
        ],
      },
    ],
  },
];
