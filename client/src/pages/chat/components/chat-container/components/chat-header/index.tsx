import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import type { Contact, Channel } from "@/store/slices/chat-slice";

const ChatHeader = () => {
  const { selectedChatData, selectedChatType, closeChat } = useAppStore();

  const contactData =
    selectedChatType === "contact" ? (selectedChatData as Contact) : undefined;

  const channelData =
    selectedChatType === "channel" ? (selectedChatData as Channel) : undefined;

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      {/* Left side */}
      <div className="flex items-center gap-5 justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {contactData?.image ? (
                  <AvatarImage
                    src={`${HOST}/${contactData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px]
                    flex items-center justify-center
                    rounded-full ${getColor(contactData?.color ?? 0)}
                  `}
                  >
                    {contactData?.firstName
                      ? contactData.firstName.split("").shift()
                      : contactData?.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>

          <div>
            {selectedChatType === "contact"
              ? contactData?.firstName
                ? `${contactData.firstName} ${contactData.lastName || ""}`
                : contactData?.email
              : channelData?.name}
          </div>
        </div>

        <button
          onClick={closeChat}
          className="text-neutral-500 transition-all duration-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-white"
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
