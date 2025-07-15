import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CommunityRoutes from "./routes/CommunityRoutes";
import ChatRouter from "./routes/ChatRouter";
import userPageRoutes from "./routes/userPageRoutes";
import homePageRoutes from "./routes/homePageRoutes";
import signupRoutes from "./routes/signupRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "/chat/*",
        element: <ChatRouter />,
      },
      ...CommunityRoutes,
      ...userPageRoutes,
      ...homePageRoutes,
      ...signupRoutes,
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
