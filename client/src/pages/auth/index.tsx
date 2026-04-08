import  { useState } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {};
  const handleSignup = async () => {};
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      {/* width >= , sm : 640 , md : 768 , lg : 1024 , xl : 1280 , 2xl : 1536 */}
      <div
        className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]
        md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
      >
        {/* col-1 */}
        <div className="flex flex-col gap-10 items-center justify-center bg-yellow-300">
          <div className="flex items-center justify-center flex-col bg-red-300 p-1">
            <div className="flex items-center justify-center bg-green-200">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="victory" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="
                data-[state=active]:bg-transparent text-black text-opactity-90 border-b-2
                rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold
                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="
                data-[state=active]:bg-transparent text-black text-opactity-90 border-b-2
                rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold
                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 " value="login">
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
                <Button className="rounded-full" onClick={handleLogin}>
                  Signup
                </Button>
              </TabsContent>

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
        </div>
        {/* col-1 */}
        {/*col-2  */}
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="background"
            className="h-[580px] rounded-sm object-cover"
          />
        </div>

        {/* col-2 */}
      </div>
    </div>
  );
};

export default Auth;
