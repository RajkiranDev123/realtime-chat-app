import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth"; // "./pages/auth" is treated as : "./pages/auth/index.tsx"
// If you import a folder, it automatically looks for an index file inside it (Bundler : webpack)
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import type { UserInfo } from "./store/slices/auth-slice";

// Logged in ✅ → “you can enter chat/profile”
// Not logged in ❌ → “go to login page first”
// Chat and Profile
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to={"/auth"} />;
};

// AuthRoute = block login page for logged-in users , if logged in go to chat otherwise children.
// Auth
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // !!null ==> !null = true and again !true ==> false (falsey becomes falsey and same with truthy)
  return isAuthenticated ? <Navigate to={"/chat"} /> : children; // children will be Auth only
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getUserData
    const getUserData = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log("res from App.ts x==> ", res);
        // res == {config , data , headers , request , status , statusText}
        if (res.status === 200 && res.data.id) {
          console.log("firstName from app.tsx ==> ", res.data.firstName);
          setUserInfo(res.data);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    // getUserData ends

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Logged in ❌ → “You don’t need login page” → go to chat
  // Not logged in ❌ → “Ok, show login page”

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* route 1 */}
          <Route
            path="/auth"
            element={
              <AuthRoute>
                {" "}
                <Auth />
              </AuthRoute>
            }
          />
          {/* route 2 */}
          <Route path="*" element={<Auth />} />
          {/* route 3 */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          {/* route 4 */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
