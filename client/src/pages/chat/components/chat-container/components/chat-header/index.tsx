import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { selectedChatData, selectedChatType, closeChat } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      {/* Left side */}
      <div className="flex items-center gap-5 justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] 
                            flex items-center justify-center
                            rounded-full ${getColor(selectedChatData?.color ?? 0)}
                          `}
                  // ts says : “I can’t pass undefined into something that requires a number”
                  // ?? ==> It gives a default value only when the left side is null or undefined.
                  // nullish coalescing operator.
                >
                  {selectedChatData?.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData?.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          {/*  */}
          <div>
            {selectedChatType === "contact" &&
              (selectedChatData?.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName || ""}`
                : selectedChatData?.email)}
          </div>

          {/*  */}
        </div>

        <button
          onClick={closeChat}
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
