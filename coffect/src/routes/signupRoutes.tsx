/*
  author      : 이희선
  description : 회원가입 관련 라우트 정의 파일입니다.
*/

import SignupPage from "../pages/Signup";
import TermsDetail from "../components/Signup/TermsDetail"; //약관 보기 페이지
import OnboardingPage from "../components/Signup/OnboardingPage"; // 온보딩 페이지
const signupRoutes = [
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/signup/terms",
    element: <TermsDetail />,
  },
];

export default signupRoutes;
