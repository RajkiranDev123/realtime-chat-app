import { useState } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { Copy } from "lucide-react";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Auth = () => {
  const { setUserInfo, loading, setLoading } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  // validate signup
  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required", { duration: 2000 });
      return false;
    }
    if (!password.length) {
      toast.error("Password is required", { duration: 2000 });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be same!", {
        duration: 2000,
      });
      return false;
    }
    return true;
  };

  // validate login
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required", { duration: 2000 });
      return false;
    }
    if (!password.length) {
      toast.error("Password is required", { duration: 2000 });
      return false;
    }

    return true;
  };

  // login
  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        setLoading(true);
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true },
        );

        if (res.data.success) {
          setUserInfo(res.data.user);
          if (res.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error: unknown) {
        // “Turn off TypeScript completely for this value.” ==> any
        console.log("error from handleLogin ==> ", error);

        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Something went wrong", {
            duration: 1000,
          });
        } else {
          toast.error("Unknown error", { duration: 1000 });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // signup
  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        setLoading(true);

        const res = await apiClient.post(SIGNUP_ROUTE, { email, password });

        if (res.data.success) {
          setUserInfo(res.data.user);
          navigate("/profile");
        }
      } catch (error: unknown) {
        // unknown :  Now TypeScript forces you to narrow the type before using it.
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Something went wrong", {
            duration: 1000,
          });
        } else {
          toast.error("Unknown error", { duration: 1000 });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // grid ==>	grid enabled, but 1 column layout
  // grid grid-cols-2	==> 2 columns always
  // grid grid-cols-1 xl:grid-cols-2	==> responsive layout

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      {/* width >= xs : 480 , sm : 640 , md : 768 , lg : 1024 , xl : 1280 , 2xl : 1536 */}
      {/* border == border-1 border-black */}
      <div
        className="h-[80vh] w-[80vw] bg-white shadow-2xl 
        md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
      >
        {/* grid-item-1 starts */}
        <div className="flex flex-col gap-10 items-center justify-center">

          {/* item-1 ==> welcome , logo and fill */}
          <div className="flex flex-col items-center justify-center p-1">

            {/* item-1 ==> welcome text and hand */}
            <div className="flex items-center justify-center ">

              <h1 className="text-4xl font-bold md:text-5xl text-black/70">
                Welcome
              </h1>

              <img
                src={Victory}
                alt="victory"
                className="h-[70px] animate-bounce"
              />
              
            </div>
            {/* item-1 ends*/}

            {/* item-2 ==> Fill in... */}
            <p className="font-medium text-center">
              Fill in the details to get started.
            </p>
            {/* item-2 ends */}

          </div>
          {/* item-1 ends , welcome , logo and fill ends*/}

          {/* item-2 ==> tabs */}
          <div className="flex justify-center w-full">

            {/* if width full not given : it will take content width and width 3/4 is 75% */}

            {/* Tabs : Main container that controls the whole tabs system. */}

            <Tabs className="w-3/4" defaultValue="login">

              {/* TabsList : Wrapper for tab buttons (multiple TabsTrigger inisde) */}

              <TabsList className="bg-transparent w-full">
                
                {/* TabsTrigger 1 */}
                <TabsTrigger
                  className="
                data-[state=active]:bg-transparent text-black/90 border-b
                rounded-3xl w-full data-[state=active]:text-black data-[state=active]:font-semibold
                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                {/* TabsTrigger 1 ends */}

                {/* TabsTrigger 2 */}
                <TabsTrigger
                  className="
                data-[state=active]:bg-transparent text-black/90 border-b  
                rounded-3xl w-full data-[state=active]:text-black data-[state=active]:font-semibold
                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>

                {/* TabsTrigger 2 ends */}

              </TabsList>

              {/* TabsList : Wrapper for all tab buttons (TabsTrigger) */}

              {/* login : TabsContent starts */}
              <TabsContent className="flex flex-col gap-5" value="login">

                {/* copy email */}
                <div className="flex gap-2 items-center">
                  Copy Test Email{" "}
                  <Copy
                    onClick={() => {
                      // navigator ==> It is a browser object that exposes APIs like Clipboard API , Geolocation API
                      navigator.clipboard.writeText("rajtech645@gmail.com"); 
                      toast.success("Email copied!", { duration: 1000 });
                    }}
                    className="cursor-pointer animate-pulse text-blue-500"
                    size={18}
                  />
                </div>
                {/* copy email ends */}

                {/* email */}
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6  focus-visible:ring-0"
                  // ring = fake border drawn outside the element using shadow
                  // focus: == focus-visible: , some focus-visible works on mouse click too!
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* email ends */}


                {/* copy test password */}
                <div className="flex gap-2 items-center">
                  Copy Test Password{" "}
                  <Copy
                    onClick={() => {
                      navigator.clipboard.writeText("123"); 
                      toast.success("Password copied!", { duration: 1000 });
                    }}
                    className="cursor-pointer animate-pulse text-blue-500"
                    size={18}
                  />
                </div>
                {/* copy test password ends */}

                {/* password starts  */}
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 focus-visible:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* password ends */}

                <Button className="rounded-full" onClick={handleLogin}>
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Login"
                  )}
                </Button>

              </TabsContent>
              {/* login : TabsContent ends*/}


              {/* signup : TabsContent starts */}
              <TabsContent className="flex flex-col gap-5 " value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
              {/* signup : TabsContent ends */}


            </Tabs>

          </div>
          {/* item-2 , tabs ends */}

        </div>
        {/* grid-item-1 ends */}

        {/*grid-item-2 starts */}
        <div className="hidden xl:block">
          <img
            src={Background}
            alt="background"
            className="h-[80vh] rounded-sm object-cover"
          />
        </div>
        {/* grid-item-2 ends */}
      </div>
    </div>
  );
};

export default Auth;
