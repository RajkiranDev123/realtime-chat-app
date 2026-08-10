import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store"; // @ = alias for src/ (usually)
import { useNavigate } from "react-router-dom"; // BrowserRouter, Navigate, Route, Routes , useNavigate
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
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  // null ==> Because you don’t have an image yet when the component first loads.

  const [hovered, setHovered] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setImage(userInfo.image);
    }
  }, [userInfo]);

  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup your profile first.");
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

  // save button api call
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true },
        );

        if (response.status === 200 && response.data.user) {
          setUserInfo({ ...response.data.user });

          ////////////////////////////////////////////////////////////
          //    const user = {
          //    name: "Raj",
          //    age: 21
          //    };
          //   const newUser = { ...user };

          //  console.log(newUser);
          // { name: "Raj", age: 21 }
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
    // fileInputRef.current?.click();

    // current is null
    // null has no properties

    // if you dont want ?. then ==>
    if (fileInputRef.current) {
      fileInputRef.current.click(); // now TypeScript knows current cannot be null here.
    }

    //  So yes, TypeScript is tracking both possibilities (HTMLInputElement and null) until your
    //  code proves that one of them cannot happen. This feature is called :
    //  control flow analysis or type narrowing.
  };

  // <input type="file"  triggers when ==> onChange={handleImageChange} name="profile-image"/>
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    // ChangeEvent = value changed
    // MouseEvent = click / pointer action
    // for div click ==> event: React.MouseEvent<HTMLDivElement>
  ) => {
    const file = event.target.files?.[0]; // FileList object
    // FileList { 0: File, 1: File, length: 2 }
    // Why "array-like"? You can access items by index : files[0]
    // But it's not a true JavaScript array : no map , filter etc

    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file); // This adds a file to a FormData object so it can be uploaded in an HTTP request.
      // upload.single("profile-image") in backend side ==> Both names must match.

      const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });

      if (res.status === 200 && res.data.image) {
        if (!userInfo) return; // requires a valid object to spread (...userInfo).
        setUserInfo({ ...userInfo, image: res.data.image });
        // const user = { name: "Ravi", age: 20 };
        // const updatedUser = { ...user, age: 21 };
        toast.success("Image updated.");
      } else {
        toast.error("Profile Image failed to upload. Try again!");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (res.status === 200) {
        if (!userInfo) return;
        setUserInfo({ ...userInfo, image: null }); // userInfo changes → useEffect runs.
        // image becomes null because you explicitly set it to null here : that's why < string | null >
      }
      toast.success("Image removed");
      setImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] w-[100vw] flex items-center justify-center ">
      {/* w-max : only as wide as content needs and w-full : 100% of parent container */}

      <div className="flex flex-col gap-2 w-[80vw] md:w-max   p-2 rounded-md shadow-sm shadow-amber-100">
        {/* background-color is not inherited by default */}
        {/* If you don’t set a background on a child, it’s just transparent,
         so you see the parent’s background behind it */}

        {/* arrow */}
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-2xl lg:text-4xl text-white/90 cursor-pointer" />
        </div>
        {/* arrow ends */}

        {/* avatar and inputs : grid*/}

        <div className="grid md:grid-cols-2 gap-1 ">
          {/* Don’t force alignment — use normal/default positioning” : md:justify-self-auto  */}
          {/* self ==> Apply this alignment to this item only , centered horizontally : justify-self-center */}

          {/* avatar starts : grid-item-1 */}
          <div
            className="w-32 md:w-48 relative flex items-center justify-center justify-self-center md:justify-self-auto "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/*  */}
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full border-0 overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center
                rounded-full ${getColor(selectedColor)}
                `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo?.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {/*  */}

            {hovered && (
              // absolute inset-0 ==> is a very common Tailwind combo used to make an element cover its parent completely.
              <div
                onClick={image ? handleDeleteImage : handleFileInputclick}
                className="absolute inset-0 flex items-center justify-center 
              bg-black/60  rounded-full 
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

            {/* input */}
            <input
              type="file"
              className="hidden" // still exists in DOM , can still be accessed via ref
              ref={fileInputRef}
              onChange={handleImageChange}
              accept=".png , .jpg , .jpeg , .webp , .svg"
              name="profile-image"
            />
            {/* input ends */}
          </div>
          {/* avatar ends */}

          {/* --------------------------------------------------------- */}

          {/* input fields : grid-item-2 */}

          {/* 1 = 0.25rem = 4px , 64 × 4px = 256px , m-w-? The element cannot go below this value, but it can go above it freely.*/}

          <div className="flex flex-col gap-2 min-w-32 md:min-w-64  text-white items-center justify-center">
            {/* email */}
            <div className="w-full">
              {" "}
              {/* If you this div to follow container width (most common): w-full */}
              {/* inputs default behave like block-level elements in many UI libs may take w-full */}
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
                  transition-all duration-300 ${selectedColor === index ? "outline-white/50 outline-2" : ""}`}
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
          {/* input fields ends*/}
        </div>

        {/* avatar and inputs ends : grid*/}

        {/* save button  */}

        <div className="w-full">
          <Button
            onClick={() => saveChanges()}
            className="h-10 w-full bg-purple-700 hover:bg-purple-800 transition duration-300"
          >
            {/* Color will change instantly (no smooth effect) : if no "transition" used */}
            {/* transition = shortcut for transition-all */}
            {/* duration-300 = “how long”
            transition = “turn animation ON” , duration-300 by itself does nothing , must need transition , transition == transition-all*/}
            Save
          </Button>
        </div>

        {/* save button ends */}
      </div>
    </div>
  );
};

export default Profile;
