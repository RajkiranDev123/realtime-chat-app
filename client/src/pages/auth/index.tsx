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

        // res is object and inside res we have object like ==>  data : and inside it has user object ,
        // config object , request, headers and prop like status
        if (res.data.success) {
          setUserInfo(res.data.user);
          if (res.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error: any) {
        toast.error(error.response.data.message, { duration: 1000 });
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
      } catch (error: any) {
        // If you write catch (error), TypeScript will infer it as unknown , unknown may not have a .message or .response etc
        // Chrome console often shows AxiosError instances as a string (AxiosError: ...) for readability.
        toast.error(error.response.data.message, { duration: 1000 });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      {/* width >= xs : 480 , sm : 640 , md : 768 , lg : 1024 , xl : 1280 , 2xl : 1536 */}
      {/* border == border-1 border-black */}
      <div
        className="h-[80vh] w-[80vw] bg-white shadow-2xl 
        md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
      >
        {/* col-1 starts */}
        <div className="flex flex-col gap-10 items-center justify-center ">
          {/* welcome , logo and fill */}
          <div className="flex items-center justify-center flex-col p-1">
            {/* col-1 */}
            <div className="flex items-center justify-center ">
              <h1 className="text-4xl font-bold md:text-5xl text-black/70">
                Welcome
              </h1>
              <img
                src={Victory}
                alt="victory"
                className="h-[80px] animate-bounce"
              />
            </div>
            {/* col-1 */}
            {/* col-2 */}
            <p className="font-medium text-center">
              Fill in the details to get started
            </p>
            {/* col-2 */}
          </div>
          {/* welcome , logo and fill ends*/}

          {/* tabs */}
          <div className="flex justify-center w-full">
            {/* if width full not given : it will take content width and width 3/4 : 75% */}

            {/* Tabs : Main container that controls the whole tabs system. */}

            <Tabs className="w-3/4 " defaultValue="login">
              {/* TabsList : Wrapper for all tab buttons (multiple TabsTrigger inisde) */}
              <TabsList className="bg-transparent rounded-none w-full">
                {/* TabsTrigger 1 */}
                <TabsTrigger
                  className="
                data-[state=active]:bg-transparent text-black text-opactity-90 border-b
                rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold
                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                {/* TabsTrigger 1 */}

                {/* TabsTrigger 2 */}
                <TabsTrigger
                  className="
                data-[state=active]:bg-transparent text-black text-opactity-90 border-b
                rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold
                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
                {/* TabsTrigger 2 */}
              </TabsList>
              {/* TabsList : Wrapper for all tab buttons (TabsTrigger) */}

              {/* login : TabsContent */}
              <TabsContent className="flex flex-col gap-5" value="login">
                {/* copy email */}
                <div className="flex gap-2 items-center">
                  Copy Test Email{" "}
                  <Copy
                    onClick={() => {
                      navigator.clipboard.writeText("rajtech645@gmail.com"); // ✅ fixed email
                      toast.success("Email copied!", { duration: 1000 });
                    }}
                    className="cursor-pointer animate-pulse text-blue-500"
                    size={18}
                  />
                </div>
                {/* copy email ends */}
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6  focus-visible:ring-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/*  */}
                <div className="flex gap-2 items-center">
                  Copy Test Password{" "}
                  <Copy
                    onClick={() => {
                      navigator.clipboard.writeText("123"); // ✅ fixed email
                      toast.success("Password copied!", { duration: 1000 });
                    }}
                    className="cursor-pointer animate-pulse text-blue-500"
                    size={18}
                  />
                </div>
                {/*  */}
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 focus-visible:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full" onClick={handleLogin}>
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </TabsContent>
              {/* login : TabsContent */}

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
            </Tabs>
          </div>
          {/* tabs ends */}
        </div>
        {/* col-1 ends */}

        {/*col-2 starts */}
        <div className="hidden xl:block">
          <img
            src={Background}
            alt="background"
            className="h-[80vh] rounded-sm object-cover"
          />
        </div>
        {/* col-2 ends */}
      </div>
    </div>
  );
};

export default Auth;
