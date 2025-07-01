import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Home = () => {
  return (
    <div className="flex h-full min-h-[calc(100dvh-81px)] flex-col items-center justify-center">
      <div className="text-2xl font-bold">Home Page</div>
      <BottomNavbar activeLabel="홈" />
    </div>
  );
};

export default Home;
