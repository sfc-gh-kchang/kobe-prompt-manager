import React from "react";
import { Category, Prompt } from "../types";
import { FileText, Plus } from "lucide-react";

interface SidebarProps {
  categories: Category[];
  selectedPrompt: { categoryId: string; promptId: string } | null;
  onPromptSelect: (categoryId: string, promptId: string) => void;
  onCreateNewPrompt: () => void;
}

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
        {prompts.map((prompt) => (
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
              <span className="text-sm">{prompt.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-[260px] bg-[#202123] overflow-y-auto flex flex-col">
      <div className="p-4 flex items-center border-b border-[#4E4F60]/20">
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_5005_25226)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.1592 16.2371L16.1797 17.2167C16.0488 17.3475 15.8368 17.3475 15.706 17.2167L14.7265 16.2372C14.5958 16.1065 14.5958 15.8944 14.7265 15.7637L15.706 14.7841C15.8369 14.6532 16.0489 14.6532 16.1798 14.7841L17.1592 15.7636C17.29 15.8943 17.29 16.1064 17.1592 16.2371ZM19.2083 15.0038L16.9394 12.735C16.3891 12.1847 15.4968 12.1847 14.9464 12.735L12.6775 15.004C12.127 15.5544 12.127 16.4466 12.6775 16.997L14.9463 19.2658C15.4966 19.8162 16.3888 19.8162 16.9392 19.2658L19.2083 16.9968C19.7586 16.4464 19.7586 15.5541 19.2083 15.0038Z"
                fill="#29B5E8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.1727 0C11.0554 0 10.1497 0.905749 10.1497 2.02299V6.21188L6.49449 4.10153C5.52695 3.5429 4.28971 3.8744 3.73108 4.84203C3.17246 5.80958 3.50396 7.04682 4.4715 7.60544L10.8888 11.3105C11.238 11.5976 11.6852 11.7701 12.1727 11.7701C13.2899 11.7701 14.1957 10.8644 14.1957 9.74715V2.02299C14.1957 0.905749 13.2899 0 12.1727 0Z"
                fill="#29B5E8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.1727 20.2305C11.6852 20.2305 11.2381 20.4029 10.8888 20.6901L4.4715 24.3951C3.50396 24.9537 3.17246 26.1909 3.73108 27.1586C4.28971 28.1261 5.52695 28.4577 6.49449 27.8991L10.1497 25.7887V29.9776C10.1497 31.0949 11.0554 32.0006 12.1727 32.0006C13.2899 32.0006 14.1957 31.0949 14.1957 29.9776V22.2535C14.1957 21.1362 13.2899 20.2305 12.1727 20.2305Z"
                fill="#29B5E8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M27.4141 24.3951L20.9968 20.6901C20.6475 20.4029 20.2004 20.2305 19.7129 20.2305C18.5957 20.2305 17.6899 21.1362 17.6899 22.2535V29.9776C17.6899 31.0949 18.5957 32.0006 19.7129 32.0006C20.8302 32.0006 21.7359 31.0949 21.7359 29.9776V25.7887L25.3911 27.899C26.3587 28.4577 27.596 28.1261 28.1546 27.1586C28.7132 26.1909 28.3816 24.9537 27.4141 24.3951Z"
                fill="#29B5E8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30.8736 18.1108L27.2188 16.0007L30.8736 13.8905C31.8411 13.3319 32.1727 12.0946 31.6141 11.1271C31.0555 10.1595 29.8181 9.82798 28.8506 10.3866L22.1613 14.2487C22.155 14.2523 22.1495 14.2567 22.1434 14.2603C22.1056 14.2826 22.0691 14.3071 22.0327 14.3318C22.0132 14.3451 21.993 14.3578 21.9741 14.3718C21.9414 14.3958 21.9104 14.4218 21.8792 14.4478C21.8581 14.4652 21.8365 14.4821 21.8163 14.5003C21.7912 14.5229 21.7677 14.5474 21.7436 14.5715C21.7196 14.5955 21.6952 14.6191 21.6724 14.6442C21.6543 14.6644 21.6374 14.686 21.6199 14.707C21.5939 14.7382 21.5679 14.7693 21.5439 14.802C21.53 14.8209 21.5173 14.841 21.5039 14.8605C21.4792 14.897 21.4547 14.9334 21.4325 14.9712C21.4288 14.9774 21.4244 14.9828 21.4208 14.9892C21.4115 15.0054 21.4044 15.0221 21.3956 15.0385C21.3765 15.074 21.3575 15.1095 21.3405 15.146C21.3271 15.1747 21.3152 15.2038 21.3033 15.2329C21.2908 15.2632 21.2784 15.2936 21.2675 15.3244C21.2552 15.359 21.2445 15.3938 21.2342 15.4287C21.2263 15.4555 21.2185 15.4822 21.2118 15.5093C21.2023 15.5467 21.1944 15.5841 21.1872 15.6218C21.1822 15.6484 21.1774 15.6749 21.1733 15.7016C21.1678 15.7384 21.1636 15.7752 21.1602 15.8121C21.1574 15.8413 21.1551 15.8707 21.1536 15.9001C21.1519 15.9336 21.1514 15.9671 21.1514 16.0007C21.1514 16.0342 21.1519 16.0676 21.1536 16.1012C21.1551 16.1307 21.1574 16.1599 21.1602 16.1893C21.1636 16.2262 21.1678 16.2628 21.1733 16.2997C21.1774 16.3265 21.1822 16.353 21.1872 16.3794C21.1944 16.4171 21.2023 16.4546 21.2118 16.492C21.2185 16.519 21.2263 16.5457 21.2342 16.5725C21.2445 16.6075 21.2552 16.6422 21.2675 16.6767C21.2784 16.7077 21.2908 16.738 21.3033 16.7683C21.3152 16.7975 21.3271 16.8265 21.3405 16.8553C21.3575 16.8918 21.3765 16.9274 21.3957 16.963C21.4044 16.9792 21.4115 16.996 21.4208 17.0122C21.4244 17.0183 21.4288 17.0239 21.4324 17.0301C21.4547 17.0678 21.4792 17.1044 21.504 17.1407C21.5173 17.1603 21.53 17.1805 21.5439 17.1993C21.5679 17.2319 21.5939 17.2631 21.6201 17.2944C21.6375 17.3153 21.6543 17.337 21.6724 17.3571C21.6952 17.3821 21.7196 17.4057 21.7437 17.4298C21.7677 17.4538 21.7913 17.4783 21.8163 17.5009C21.8365 17.5191 21.8581 17.536 21.8792 17.5534C21.9104 17.5795 21.9414 17.6056 21.9741 17.6295C21.993 17.6434 22.0132 17.6561 22.0327 17.6695C22.0691 17.6943 22.1056 17.7187 22.1434 17.741C22.1495 17.7447 22.155 17.7489 22.1613 17.7526L28.8506 21.6147C29.8181 22.1734 31.0555 21.8418 31.6141 20.8743C32.1727 19.9066 31.8411 18.6694 30.8736 18.1108Z"
                fill="#29B5E8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.1546 4.84203C27.596 3.87449 26.3587 3.5429 25.3911 4.10153L21.7359 6.21188V2.02299C21.7359 0.905749 20.8303 0 19.7129 0C18.5957 0 17.6899 0.905749 17.6899 2.02299V9.74715C17.6899 10.8645 18.5957 11.7701 19.7129 11.7701C20.2004 11.7701 20.6476 11.5976 20.9968 11.3105L27.4141 7.60544C28.3817 7.04691 28.7132 5.80958 28.1546 4.84203Z"
                fill="#29B5E8"
              />
            </g>
            <defs>
              <clipPath id="clip0_5005_25226">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-[#ECECF1] font-medium">Prompt Manager</span>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={onCreateNewPrompt}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#29B5E8] hover:bg-[#1C9BCE] text-white rounded-md transition-colors"
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
