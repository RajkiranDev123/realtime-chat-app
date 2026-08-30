import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";

type Channel = {
  _id: string;
  name: string;
};
type Contact = {
  _id: string;
  lastMessageTime: string;

  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;

  color?: number;
};

// TypeScript type literal, so you don't need commas or semicolons between the properties. Newlines are enough.
// const { name, age }: { name: string; age: number } = user;

const ContactList = ({
  contacts,
  isChannel = false,
}: {
  contacts: (Contact | Channel)[]
  isChannel?: boolean;
}) => {

  const {
    selectedChatData,
    setSelectedChatData,
    //
    setSelectedChatType,
    //
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact: Contact | Channel) => {
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
        // no need ?. because of   contacts: (Contact | Channel)[]; in props
        
        <div
          onClick={() => handleClick(contact)}
          key={contact._id}
          className={`
                pl-10 py-1 transition duration-500 cursor-pointer  hover:border-b m-1
                hover:rounded-md
                ${
                  selectedChatData && selectedChatData?._id === contact._id
                  // === has higher precedence than &&, so no need ()
                    ? "bg-[#8417ff]/70 hover:bg-[#8417ff]/80 rounded-sm font-semibold"
                    : "hover:bg-[#f1f1f111]"
                }
                `}
        >

          <div className="flex gap-5 items-center justify-start text-neutral-300">

            {/* flex-item-1 */}

            {"email" in contact && (

              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (

                  <AvatarImage
                    src={`${contact.image}`}
                    alt="profile"
                    className="object-cover "
                  />
                ) : (
                  <div
                    className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-green-600 border-2 border-white"
                            : getColor(contact.color ?? 0)
                        }
                        uppercase h-10 w-10 text-lg border
                            flex items-center justify-center
                            rounded-full }
                          `}
                    // ts says : “I can’t pass undefined into something that requires a number”
                    // ?? ==> It gives a default value only when the left side is null or undefined.
                    // nullish coalescing operator.
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact?.email.split("").shift()}

                  </div>
                )}

              </Avatar>
            )}
            {/* flex-item-1 ends */}

            {/* flex-item-2 */}

            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}

            {/* flex-item-2 */}

            {/* flex-item-3 */}

            {"name" in contact ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {/* `${a} ${b}` ==> You are building a new string */}
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </span>
            )}

            {/* flex-item-3 ends */}

          </div>

        </div>

      ))}
      {/* map ends */}

    </div>
  );
};

export default ContactList;
