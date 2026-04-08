import React from "react";

const Auth = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      {/* width >= , sm : 640 , md : 768 , lg : 1024 , xl : 1280 , 2xl : 1536 */}
      <div
        className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]
        md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-3"
      >
        <div className="flex flex-col gap-10 items-center justify-center bg-yellow-300">
          <div className="flex items-center justify-center flex-col bg-red-300 p-1">
            <div className="flex items-center justify-center bg-green-200">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
