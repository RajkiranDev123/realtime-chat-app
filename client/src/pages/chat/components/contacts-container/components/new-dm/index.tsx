import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { animationDefaultOptions } from "@/lib/utils";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";

const NewDm = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true },
        );
        console.log(3333,res.data.data)
        if (res.status === 200 && res.data.data) {
          setSearchedContacts(res.data.data);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
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
          {searchedContacts.length <= 0 && (
            <div
              className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center 
            items-center  duration-1000 transition-all"
            >
              <Lottie
                isClickToPauseDisabled={true}
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
        </DialogContent>
      </Dialog>

      {/* dialog */}
    </>
  );
};

export default NewDm;
