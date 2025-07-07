import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex overflow-y-auto flex-1 justify-center items-center text-2xl font-bold">
        Home Page
      </div>
      <BottomNavbar activeLabel="홈" />
    </div>
  );
};

export default Home;
