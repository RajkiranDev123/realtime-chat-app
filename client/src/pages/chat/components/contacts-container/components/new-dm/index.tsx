import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import type { Contact } from "@/store/slices/chat-slice";

// type Contact = {
//   email: string;
//   profileSetup: boolean;
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   color?: number;
//   image?: string | null;
// };

const NewDm = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true },
        );

        if (res.status === 200 && res.data.contacts) {
          //   return res.status(200).json({
          //   data: contacts,
          //   success: true,
          //   message: "Contacts fetched.",
          // });
          setSearchedContacts(res.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact: Contact) => {
    // console.log("contact from dm ==> ", contact);

    // {
    //       "_id": "6a0708a181849d247e796d0f",
    //       "email": "rajkir783@gmail.com",
    //       "password": "$2b$10$EnQCRg1y070wTGWnQCviYuKlEp/1dcmzlGgIADElfNqmVKPhsUD4W",
    //       "profileSetup": true,
    //       "createdAt": "2026-05-15T11:50:57.263Z",
    //       "updatedAt": "2026-05-20T06:45:32.302Z",
    //       "__v": 0,
    //       "color": 0,
    //       "firstName": "raj2",
    //       "lastName": "raj2"
    //   }

    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };
  return (
    <>
      {/* tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => {
                setOpenNewContactModal(true);
                setSearchedContacts([]);
              }}
              className="text-neutral-400/90 text-xl font-light text-start hover:text-neutral-100
          cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>

          <TooltipContent className="bg-black border-none text-white p-2">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* tooltip */}

      {/* dialog */}
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-8 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    onClick={() => selectNewContact(contact)}
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact?.image ? (
                          <AvatarImage
                            src={`${contact.image}`}
                            alt="pr"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] 
                            flex items-center justify-center
                            rounded-full ${getColor(contact?.color ?? 0)}
                          `}
                            // ts says : “I can’t pass undefined into something that requires a number”
                            // ?? ==> It gives a default value only when the left side is null or undefined.
                            // nullish coalescing operator.
                          >
                            {contact?.firstName
                              ? contact.firstName.split("").shift()
                              : contact?.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    {/*  */}

                    <div className="flex flex-col">
                      <span className="">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>

                      <span className="text-xs">{contact.email}</span>
                    </div>

                    {/*  */}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* when empty */}
          {searchedContacts.length <= 0 && (
            <div
              className="flex-1 mt-5 md:bg-[#1c1d25] lg:mt-0 md:flex flex-col justify-center 
            items-center  duration-1000 transition-all"
            >
              <Lottie
                isClickToPauseDisabled={true}
                // isClickToPauseDisabled={true} is a prop used in react-lottie to prevent the animation from pausing when the user clicks on it.
                height={100}
                width={100}
                options={animationDefaultOptions}
              />

              <div
                className=" text-white/80   mt-5
                            lg:text-2xl text-xl  text-center "
              >
                <h3 className="poppins-thin-italic">
                  Hi <span className="text-purple-500">!</span> Search
                  <span className="text-purple-500"> new</span> contact
                  <span className="text-purple-500">.</span>
                </h3>
              </div>
            </div>
          )}
          {/* when empty */}


        </DialogContent>
      </Dialog>

      {/* dialog */}
    </>
  );
};

export default NewDm;
