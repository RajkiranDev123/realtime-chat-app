import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

type Contact = {
  _id: string;
  lastMessageTime: string;

  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;

  color?: number;
};

const ContactList = ({
  contacts,
  isChannel = false,
}: {
  contacts: Contact[];
  isChannel?: boolean;
}) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact: Contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          onClick={() => handleClick(contact)}
          key={contact._id}
          className={`
                pl-10 py-2 transition-all duration-300 cursor-pointer
                ${
                  selectedChatData && selectedChatData?._id === contact._id
                    ? "bg-[#8417ff] hover:bg-[#8417ff]"
                    : "hover:bg-[#f1f1f111]"
                }
                `}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
