import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Community from "./pages/Community";
import ChatRouter from "./routes/ChatRouter";
import userPageRoutes from "./routes/userPageRoutes";
import homePageRoutes from "./routes/homePageRoutes";
import signupRoutes from "./routes/signupRoutes";
import CommunityRoutes from "./routes/CommunityRoutes";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="signup" />,
      },
      // chat 경로 제거 - ChatRouter에서 처리
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/chat/*",
        element: <ChatRouter />,
      },
      ...userPageRoutes,
      ...homePageRoutes,
      ...signupRoutes,
      ...CommunityRoutes,
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
