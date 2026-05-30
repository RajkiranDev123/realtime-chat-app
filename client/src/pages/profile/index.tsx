import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  console.log(userInfo?.email.split("").shift());
  // shift() is an Array method that removes the first element of an array and returns it.

  // let arr = [10, 20, 30];
  // let removed = arr.shift();
  // console.log(arr);     // [20, 30]
  // console.log(removed); // 10

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo.firstName ?? "");
      setLastName(userInfo.lastName ?? "");
      setSelectedColor(userInfo.color ?? 0);
    }
    if (userInfo?.image) {
      console.log(`${HOST}/${userInfo.image}`);

      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile first.");
    }
  };

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true },
        );
      
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          ////////////////////////////////////////////////////
          // setUserInfo(response.data) ==>
          // ✔ calls your setter
          // ✔ calls set(...)
          // ✔ Zustand updates state
          // ✔ UI re-renders
          /////////////////////////////////////////////////

          ////////////////////////////////////////////////////////////
          // setUserInfo(response.data);
          // Zustand stores the same object reference
          // No cloning, no protection
          // This is perfectly valid ✅
          // Problem : If you later do:
          // const user = useStore.getState().userInfo;
          // user.email = "new@mail.com"; // ❌ mutation
          // You changed the object without calling set
          // Zustand doesn’t know anything changed
          // UI may not re-render
          //////////////////////////////////////////////////////////////
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileInputclick = () => {
    fileInputRef.current?.click();
    // current is null
    // null has no properties
    // so current.click is impossible : never
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    // ChangeEvent = value changed
    // MouseEvent = click / pointer action
    // for div click : event: React.MouseEvent<HTMLDivElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      // Browser / Axios detects FormData , Content-Type: multipart/form-data; boundary=----xyz ==> automatically
      // ----abc123
      // name: Rj
      // ----abc123
      // file: image.png
      if (res.status === 200 && res.data.image) {
        if (!userInfo) return; //c
        setUserInfo({ ...userInfo, image: res.data.image });
        toast.success("Image updated.");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        if (!userInfo) return; //c
        setUserInfo({ ...userInfo, image: null });
      }
      toast.success("Image removed");
      setImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center ">
      {/* arrow and inputs */}
      {/* w-max : only as wide as content needs and w-full : 100% of parent container */}
      <div className="flex flex-col gap-2 w-[80vw] md:w-max border border-white p-2 rounded-md shadow-md shadow-amber-100">
        {/* arrow */}
        <div onClick={handleNavigate}>
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
                  className="object-cover w-full h-full"
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
                onClick={image ? handleDeleteImage : handleFileInputclick}
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
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept=".png , .jpg , .jpeg , .webp , .svg"
              name="profile-image"
            />
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
            {/* email ends*/}
            {/* firstname */}
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            {/* firstname ends*/}
            {/* lastname */}
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            {/* lastname ends*/}

            {/* colors */}
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  onClick={() => setSelectedColor(index)}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer 
                  transition-all duration-300 ${selectedColor === index ? " outline-white/50 outline-4" : ""}`}
                  key={index}
                >
                  {/* Border = real line (inside) , Outline = extra line (outside)
                  Border → part of the box , Outline → not part of box , glow around the box , no space consumed
                  Padding ✅ adds space , Border ✅ adds space , Margin ✅ adds gap */}
                </div>
              ))}
            </div>

            {/* colors ends */}
          </div>
          {/* input fields */}
        </div>
        {/* avatar and inputs ends*/}

        <div className="w-full">
          <Button
            onClick={() => saveChanges()}
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition duration-300"
          >
            {/* Color will change instantly (no smooth effect) : if no transition used */}
            {/* transition = shortcut for transition-all */}
            {/* transition-colors : background , text color , border etc  */}
            Save
          </Button>
        </div>
      </div>
      {/* arrow and inputs */}
    </div>
  );
};

export default Profile;
