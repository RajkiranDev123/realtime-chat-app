import { useEffect } from "react";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTE,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";
import { Loader2 } from "lucide-react";

const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    //
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getDmContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (res.data.contacts) {
        setDirectMessagesContacts(res.data.contacts);
      }
    };
    getDmContacts();

    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (res.data.channels) {
        setChannels(res.data.channels);
      }
    };
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);


// Component is mounted to the DOM
// useEffect runs → 1 time
// setDirectMessagesContacts(...) and setChannels(...) update Zustand
// Component may re-render because we are using directMessagesContacts and channels.
// But the effect doesn't run again, assuming those setter references remain stable.

  return (
    // xs sm  md lg xl 2xl ......... 7xl
    <div className="relative rounded-xs md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      {/* if w-full removed : shrink to content width, or follow parent layout or look “auto-sized” (not full screen) */}
      {/* below md width full */}
      {/* relative because some child may be absolute */}

      {/* logo */}
      <div className="pt-3">
        <Logo />
      </div>
      {/* logo ends */}

      {/* direct messages */}

      <div className="my-5">

        {/* Direct Messages text and + */}
        <div className="flex items-center justify-between pr-10 border-b border-y-purple-800 p-2">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        {/* Direct Messages text and +  */}

        {/* contact list */}

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">

          {/* h-[38vh] : element is always 38% of the viewport height, even if there is very little content. */}
          {/* max-h-[38vh] : The element can be smaller than 38vh, but it will never become taller than 38vh. */}

          {/* overflow-y-auto scrollbar-hidden : vertical scrolling is enabled only when content is taller than the container. */}

        {directMessagesContacts?.length > 0 ? 
          <ContactList contacts={directMessagesContacts} /> 
        : <Loader2 className="animate-spin mx-auto  m-2"/>} 

        </div>

        {/* contact list  ends */}

      </div>

      {/* direct messages */}

      {/* channels */}
      <div className="my-5">
        <div className="flex items-center justify-between pr-10 border-b border-y-purple-800 p-2">
          <Title text="Channels" />
          <CreateChannel />
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      {/* channels ends*/}

      {/* profile info */}
      <ProfileInfo />
      {/* profile info  */}
      
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">

      <svg
        id="logo-38"
        width={78}
        height={32}
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          // d = drawing instructions.
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccomplil"
          fill="#975aed"
        ></path>
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>

      </svg>

      <span className="text-3xl font-semibold">Sync</span>

    </div>
  );
};

interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return (
    <h6
      className="uppercase tracking-widest text-neutral-300 pl-10 font-light text-opacity-95
      text-xs"
    >
      {text}
    </h6>
  );
};
