import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
  return (
    // h-screen == h-[100vh]
    // A div with position:fixed and no width shrinks to the width of its content.

    // xs sm md lg xl 2xl..............
    // 480 640 768 1024 1280 1536

    // You have two conflicting rules : fixed and md:static , after 768 its static
    // also static  → z-index normally doesn't work and no top , bottom etc
    <div
      className="fixed top-0  flex flex-col rounded-sm text-white  h-[100vh] bg-[#1c1d25] 
                 md:flex-1 md:static w-full"
    >
      {/* flex-1 is applied at md even though w-full is also applied. ✅ */}
      {/* Yes. In this class, w-full applies by default, so it applies to XS and SM too */}
      {/* if w-full removed then in mobile will not  become full width.  */}

      {/* also we can use ==> w-full md:w-auto md:flex-1 */}
      {/* A normal block with width: auto normally fills the available width of its own parent. */}
      {/* If the element with w-auto is a flex item, then Flexbox rules are involved. */}
      {/* w-auto = let CSS/Flexbox determine the width automatically , Flexbox/grid rules and Parent etc */}
  

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
