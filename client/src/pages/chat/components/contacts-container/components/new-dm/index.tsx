import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
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
import { useState,useEffect } from "react";

import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import type { Contact } from "@/store/slices/chat-slice";

const NewDm = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  // if you put this in store , it may impact other models on other pages , keep it private to component.

  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  // Contact[] means an array where every element must follow the Contact type.
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {

  const timer = setTimeout(() => {
    searchContacts(searchTerm);
  }, 500);

  return () => {
    clearTimeout(timer);
  };

  // 0ms : type r => clearTimout and then setTimeout
  // 200ms : type a => clearTimout and then setTimeout

  // Yes. clearTimeout(timer) cancels/removes the old pending timer.

 }, [searchTerm]);

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

      {/* tooltip ends*/}

      {/* dialog */}

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>

        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">

          {/* header */}
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            {/* <DialogDescription></DialogDescription> */}
          </DialogHeader>
          {/* header ends */}

          {/* flex-col item-2 : input */}
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* flex-col item-2 : input ends */}


          {searchedContacts.length > 0 && (
            // no need ?. ==> Because searchedContacts is initialized as an array and has length 0 when empty too.
            // need only when it is null or undefined.


            <ScrollArea className="h-[250px] bg-[#1c1d25] p-1 rounded-xs">
              {/* For scrolling to happen, the ScrollArea needs a limited/available height,
               and the content must exceed it. */}

              <div className="flex flex-col gap-2">

                {searchedContacts.map((contact) => (
                  <div
                    onClick={() => selectNewContact(contact)}
                    key={contact._id} // no need ?. too because of useState<Contact[]>([]); 
                    // and if Contact type has: _id: string;
                    // but in runtime if we dont get _id property of contact from api then undefined and no type error
                    className="flex gap-3 border-b items-center cursor-pointer p-1
                     hover:bg-gray-700/30 hover:p- hover:rounded-xl rounded-sm "
                  >

                    {/* flex item-1 : avatar  */}

                    <div className="w-12 h-12 relative">

                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${contact.image}`}
                            alt="profile"
                            className="object-cover"
                          />
                        ) : (

                          <div
                            className={`uppercase h-12 w-12 text-lg border
                            flex items-center justify-center
                            rounded-full ${getColor(contact.color ?? 0)} 
                          `}
                            // (property) color?: number | undefined ( because of ? ) in export type Contact={}
                            // ts says : “I can’t pass undefined into something that requires a number”
                            // ?? ==> It gives a default value only when the left side is null or undefined.
                            // nullish coalescing operator.
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                              
                          </div>
                        )}
                      </Avatar>

                    </div>

                    {/* end of avatar  */}

                    {/* item-2 : firstName and lastName and email  */}

                    <div className="flex flex-col">

                      <span className="">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName.charAt(0).toUpperCase() + contact.firstName.slice(1)}
                             ${contact.lastName.charAt(0).toUpperCase()+contact.lastName.slice(1)}`
                          : contact.email}
                      </span>

                      {/* 
                      const name = "raj";
                      console.log(name.slice(1)); // aj ==> slice() takes a portion of a string.
                      charAt() gets one character from a string at a specific index.
                      */}

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
            // flex-1 can exist without md:flex or flex , but it only has an effect if the parent is a flex container.
            <div
              className="flex-1 mt-5 bg-[#1c1d25] lg:mt-1 flex flex-col justify-center 
            items-center  duration-1000 transition-all"
            >

              {/* Lottie */}
              <Lottie
                isClickToPauseDisabled={true}
                // isClickToPauseDisabled={true} is a prop used in react-lottie to 
                // prevent the animation from pausing when the user clicks on it.
                height={100}
                width={100}
                options={animationDefaultOptions}
                
              />

              {/* text */}
              <div
                className="text-white/80 mt-5
                            lg:text-2xl text-xl text-center "
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

      {/* dialog ends*/}
    </>
  );
};

export default NewDm;
