import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./components/layout/RootLayout";

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
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/userpage/:id",
        element: <UserPage />,
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
