import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
  return (
    // h-screen == h-[100vh]
    // A div with position: fixed and no width shrinks to the width of its content.
    // and its children can only grow within that width.
    // xs sm md lg xl 2xl..............
    // 480 640 768 1024 1280 1536

    // You have two conflicting rules : fixed and md:static , after 768 its static
    // also static  → z-index normally doesn't work and no top etc
    <div
      className="fixed top-0  flex flex-col rounded-sm text-white  h-[98vh] bg-[#1c1d25] 
                 md:flex-1 md:static w-full"
    >
      {/* if w-full removed then in mobile will not  become full width.  */}

      {/* static = default normal positioning. So it overrides : fixed */}
      {/* On medium screens and larger , position becomes static  */}
      {/* top-0 only works when position is : fixed , absolute , relative , sticky */}
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
