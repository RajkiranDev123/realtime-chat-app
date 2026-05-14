import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
  return (
    // h-screen == h-[100vh]
    // A div with position: fixed and no width shrinks to the width of its content.
    // and its children can only grow within that width.
    // xs sm md lg xl 2xl..............
    <div
      className="fixed top-0  flex flex-col rounded-sm text-white  h-screen bg-[#1c1d25] 
                 md:flex-1 md:static w-full"
    >
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
