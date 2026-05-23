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
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";

type Contact = {
  email: string;
  profileSetup: boolean;
  _id: string;
  firstName?: string;
  lastName?: string;
  color?: number;
  image?: string | null;
};

const CreateChannel = () => {
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

        if (res.status === 200 && res.data.data) {
          //   return res.status(200).json({
          //   data: contacts,
          //   success: true,
          //   message: "Contacts fetched.",
          // });
          setSearchedContacts(res.data.data);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact: Contact) => {
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
              onClick={() => setOpenNewContactModal(true)}
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

     
        </DialogContent>
      </Dialog>

      {/* dialog */}
    </>
  );
};

export default CreateChannel;
