import BottomNavbar from "../components/shareComponents/BottomNavbar";
import LoginChoice from "../components/Login/Login";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <LoginChoice
        onLogin={(email, password) => {
          // 로그인 처리 로직 (추후 API 호출 후 홈화면 이동)
          // 현재 api가 없어서 변수 미사용 에러 막기 위해 console.log에 올림.
          console.log("로그인 시도:", email, password);
          navigate("/home"); // 홈 화면으로 이동
        }}
        onSignUp={() => {
          // 회원가입 페이지 이동
          navigate("/signup");
        }}
      />
      <BottomNavbar />
    </div>
  );
};

export default Login;
