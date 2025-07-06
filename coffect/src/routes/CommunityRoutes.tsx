import type { RouteObject } from "react-router-dom";
import Community from "../pages/Community";
import WritePost from "../components/communityComponents/writeComponents/WritePost";

const CommunityRoutes: RouteObject[] = [
  {
    path: "community",
    element: <Community />,
  },
  {
    path: "community/write",
    element: <WritePost />,
  },
];

export default CommunityRoutes;
