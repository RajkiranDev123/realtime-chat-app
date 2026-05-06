import { useState } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  console.log(userInfo?.email.split("").shift());
  // shift() is an Array method that removes the first element of an array and returns it.

  // let arr = [10, 20, 30];
  // let removed = arr.shift();
  // console.log(arr);     // [20, 30]
  // console.log(removed); // 10

  const saveChanges = async () => {};

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center ">
      {/* arrow and inputs */}
      {/* w-max : only as wide as content needs and w-full : 100% of parent container */}
      <div className="flex flex-col gap-2 w-[80vw] md:w-max border border-white p-2 rounded-md shadow-md shadow-amber-100">
        {/* arrow */}
        <div>
          <IoArrowBack className="text-2xl lg:text-4xl text-white/90 cursor-pointer" />
        </div>
        {/* arrow ends */}

        {/* avatar and inputs */}
        <div className="grid md:grid-cols-2 gap-2 ">
          {/* avatar starts : col-1 */}
          {/* Don’t force alignment — use normal/default positioning” : md:justify-self-auto  */}
          <div
            className=" border  w-32 md:w-48 relative flex items-center justify-center justify-self-center md:justify-self-auto "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center
                rounded-full ${getColor(selectedColor)}
                `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo?.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              // inset-0 : Child covers entire parent
              <div
                className="absolute inset-0 flex items-center justify-center 
              bg-black/50 ring-2 ring-white rounded-full
              "
              >
                {/*ring : tailwind applies a very tight box-shadow around the element. */}
                {/* Border pushes inward/outward and Ring floats outside */}
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
          {/* avatar ends */}
          {/* --------------------------------------------------------- */}
          {/* input fields : col-2 */}
          <div className="flex min-w-32 md:min-w-64 flex-col gap-2 border text-white items-center justify-center">
            {/* email */}
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo?.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            {/* email */}
            {/* email */}
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo?.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            {/* email */}
          </div>
          {/* input fields */}
        </div>
        {/* avatar and inputs */}
      </div>
      {/* arrow and inputs */}
    </div>
  );
};

export default Profile;
