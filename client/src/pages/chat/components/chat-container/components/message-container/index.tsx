import React from "react";

const MessageContainer = () => {
  return (
    // If you give flex-1 to MessageContainer, then it will take all remaining vertical space inside the flex column parent.
    // Parent = outer box
    // xs sm md lg xl 2xl....
    // In a flex column (flex-col): align-items: stretch is the default (items-stretch)
    // That means : Every child automatically stretches to full width of the parent , no need md:w-[60vw] here...
    <div
      className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 

    "
    >
      MessageContainer
    </div>
  );
};

export default MessageContainer;
