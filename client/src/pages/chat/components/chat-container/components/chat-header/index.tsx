import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      {/* Left side */}
      <div className="flex items-center gap-5">
        <span>Close</span>

        <button
          className="text-neutral-500 transition-all duration-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-white"
        >
          {/* ring follows the element’s shape , rounded-md will round ring too */}
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
