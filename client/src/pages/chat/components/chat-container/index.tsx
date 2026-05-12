import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
  return (
    <div
      className="fixed top-0 text-white  h-[100vh] bg-[#1c1d25] w-[100vw] 
    flex flex-col md:flex-1 md:static"
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
