import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex overflow-y-auto flex-1 justify-center items-center text-2xl font-bold">
        Login Page
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Login;
