import { animationDefaultOptions } from "@/lib/utils";

import Lottie from "react-lottie";
const EmptyChatContainer = () => {
  return (
    // If you have 3 flex items and only one item has flex: 1, then:
    // That item will take all the remaining available space.
    // The other items keep their natural/content width. same for grow too!
    // if one item has bigger content, that item can become wider because items start from their content size first, if grow on all 3
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div
        className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 
      lg:text-4xl text-3xl transition-all duration-300 text-center "
      >
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
