import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

import { RiCloseFill } from "react-icons/ri";
import type { Contact, Channel } from "@/store/slices/chat-slice";

const ChatHeader = () => {

  const { selectedChatData, selectedChatType, closeChat } = useAppStore();

  // Think of selectedChatData as a value that can represent either a contact or a channel.

  const contactData =
    selectedChatType === "contact" ? selectedChatData as Contact : undefined;

  // If selectedChatType isn't "contact", contactData becomes undefined.

  // as is not type narrowing. It is type assertion.
  // TypeScript narrows the type based on a condition:
  // if (selectedChatType === "contact") {   // TypeScript can narrow based on the condition

    
  const channelData =
    selectedChatType === "channel" ? (selectedChatData as Channel) : undefined;

  return (

    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center px-5">

  

      <div className="flex items-center  justify-between w-full">

         {/* flex item-1 : avatar and names */}
        <div className="flex gap-3 items-center justify-center">

          <div className="w-12 h-12 relative">

            {selectedChatType === "contact" ? (

              <Avatar className={`h-12 w-12 rounded-full overflow-hidden `}>
                {contactData?.image ? (
                  <AvatarImage
                    src={`${contactData.image}`}
                    alt="profile"
                    className="object-cover  "
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border
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
              <div className="bg-[#ffffff22] border-2 border-green-500 h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>

           {/* firstName and lastName or channel name*/}
          <div>
            {/* {selectedChatType==="channel" && selectedChatData.name} */}
            {selectedChatType === "contact"
              ? contactData?.firstName
                ? `${contactData.firstName} ${contactData.lastName || ""}`
                : contactData?.email
              : channelData?.name}

              {/* why ?. ==> contactData or channelData itself can still be undefined because of your ternary */}
          </div>
           {/* firstName and lastName or channel name*/}


        </div>
         {/* flex item-1  */}

        {/* flex item-2 : close button */}
        <button
          onClick={closeChat}
          className="text-neutral-500 transition-all duration-300 rounded-md
          hover:cursor-pointer hover:border
          focus:outline-none focus:ring-2 focus:ring-white"
        >
          <RiCloseFill className="text-3xl hover:text-white" />
        </button>
        {/* flex item-2 : close button */}

      </div>
    </div>
  );
};

export default ChatHeader;
