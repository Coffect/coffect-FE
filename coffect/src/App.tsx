import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import UserPage from "./pages/UserPage";
import Search from "./pages/Search";
import CommunityRoutes from "./routes/CommunityRoutes";

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
        path: "home",
        element: <Home />,
      },
      ...CommunityRoutes,
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "userpage/:id",
        element: <UserPage />,
      },
      {
        path: "community/search",
        element: <Search />,
      },
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