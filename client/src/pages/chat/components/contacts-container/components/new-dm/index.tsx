import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

import { FaPlus } from "react-icons/fa";

const NewDm = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);

  const searchContacts = async () => {};
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

      

      {/* dialog */}
    </>
  );
};

export default NewDm;
