import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";
// LottieFiles animations in React are usually used for lightweight JSON-based animations instead of GIFs or videos.

const EmptyChatContainer = () => {
  return (

    // If you have 3 flex items and only one item has flex-1, then:
    // That item will take all the remaining available space.
    // The other items keep their natural/content width and same for grow too!

    // if one item has bigger content, that item can become wider because items start from their content size first ==> grow on all 3
    // if flex-1 on all 3 then all will take equal width.

    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">

      {/* The <div> doesn't exist in the layout ==> hidden
          flex-1, flex-col, justify-center, etc. have no visible effect. */}

      <Lottie
        isClickToPauseDisabled={false}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />

      <div className="text-white/80 mt-15 lg:text-4xl text-3xl text-center ">
        <h3 className="poppins-thin-italic">
          Hi <span className="text-purple-500">!</span> Welcome to
          <span className="text-purple-500"> Sync</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>

    </div>
  );
};

export default EmptyChatContainer;
