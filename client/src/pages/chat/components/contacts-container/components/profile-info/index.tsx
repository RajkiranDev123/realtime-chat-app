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
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
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
    // absolute : It is removed from normal layout and Its width becomes auto (content-based)
    <div
      className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full 
    bg-[#2a2b33]"
    >
      {/* item 1 */}
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center
                rounded-full ${getColor(userInfo?.color ?? 0)}
                `}
                // ts says : “I can’t pass undefined into something that requires a number”
                // ?? ==> It gives a default value only when the left side is null or undefined.
                // nullish coalescing operator.
              >
                {userInfo?.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo?.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        {/*  */}

        <div>
          {userInfo?.firstName && userInfo.lastName
            ? `${userInfo?.firstName} ${userInfo.lastName}`
            : ""}
        </div>

        {/*  */}
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
                className="text-purple-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-black border-none text-white p-2">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* edit profile */}

        {/* logout */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                onClick={logout}
                className="text-red-400 hover:text-red-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-black border-none text-white p-2">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* logout */}
      </div>
      {/* item 2 : edit and logout*/}
    </div>
  );
};

export default ProfileInfo;
