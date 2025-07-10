import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

import CommunityRoutes from "./routes/CommunityRoutes";
import CommunitySearchRoutes from "./routes/CommunitySearchRoutes";
import userPageRoutes from "./routes/userPageRoutes";

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
        path: "chat",
        element: <Chat />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "home",
        element: <Home />,
      },
      ...CommunityRoutes,
      ...CommunitySearchRoutes,
      ...userPageRoutes,
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
