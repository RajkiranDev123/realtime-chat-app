import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true },
      );
      if (res.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // absolute : It is removed from normal layout and Its width becomes auto (content-based) thats why use
    // w-full in child when required.
    // w-auto is content width
    <div
      className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full
    bg-[#2a2b33]"
    >
      {/* item 1 */}
      <div className="flex gap-3 items-center justify-center">

        {/* img avatar */}
        <div className="w-12 h-12 relative  ">

          <Avatar className="h-12 w-12 rounded-full overflow-hidden">

            {userInfo?.image ? (
              <AvatarImage
                src={`${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full"
                // shadcn's AvatarImage already has w-full h-full in its default CSS
                // no need w-full and h-full
              />

            ) : (
              // border == border-[1px]
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center
                  
                rounded-full ${getColor(userInfo?.color ?? 0)}
                `}
                // if userInfo is null then userInfo?.color give undefined
                // export const getColor = (color: number) => {}
                // ts says : “I can’t pass undefined into something that requires a number ”
                // ?? ==> It gives a default value right side only when the left side is null or undefined.
                // nullish coalescing operator.
              >
                {userInfo?.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo?.email.split("").shift()}
              </div>
            )}
          </Avatar>

        </div>
        {/* img avatar ends*/}

        {/* first and last name  */}

        <div>
          {/* if userInfo is null or undefined then userInfo?.firstName will give undefined */}
          {/* if ?. not used then error : type error */}
          {userInfo?.firstName && userInfo.lastName
            ? `${userInfo?.firstName} ${userInfo.lastName}`
            : ""}
        </div>

        {/* first and last name  ends  */}

      </div>
      {/* item 1 ends*/}

      {/* item 2 : edit and logout*/}

      <div className="flex gap-5">
        {/* edit profile */}

        <TooltipProvider>

          <Tooltip>

            <TooltipTrigger>

              <FiEdit2
                onClick={() => navigate("/profile")}
                className="text-purple-500 text-xl font-medium cursor-pointer"
              />

            </TooltipTrigger>

            <TooltipContent className="bg-black border-none text-white p-2">
              Edit Profile
            </TooltipContent>

          </Tooltip>

        </TooltipProvider>
        {/* edit profile ends */}

        {/* logout */}
        <TooltipProvider>

          <Tooltip>

            <TooltipTrigger>
              <IoPowerSharp
                onClick={logout}
                className="text-red-400 hover:text-red-500 text-xl font-medium cursor-pointer"
                // in icons ==> size use text-xl and color use text-red-600 etc and for thickness use font-bold
              />
            </TooltipTrigger>

            <TooltipContent className="bg-black border-none text-white p-2">
              Logout
            </TooltipContent>

          </Tooltip>

        </TooltipProvider>

        {/* logout ends*/}

      </div>

      {/* item 2 : edit and logout*/}

    </div>
  );
};

export default ProfileInfo;
