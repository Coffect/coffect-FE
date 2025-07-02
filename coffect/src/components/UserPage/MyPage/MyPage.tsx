import BottomNavbar from "../../shareComponents/BottomNavbar";

const MyPage = () => {
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="flex overflow-y-auto flex-col flex-1 w-full h-full bg-white">
          {/* 상단 닉네임 */}
          <div className="mt-4 ml-4 text-2xl font-bold">jeha_0714</div>

          {/* 프로필 카드 */}
          <div className="flex flex-col items-center p-4 mx-4 mt-4 rounded-none border border-black">
            <div className="flex flex-row justify-center items-center w-full">
              {/* 프로필 이미지 */}
              <div className="mb-2 ml-2 bg-gray-200 rounded-full h-25 w-25" />
              {/* 프로필 정보 */}
              <div className="flex flex-col flex-1">
                <div className="flex gap-2 justify-center items-end mb-4">
                  <span className="text-xl font-bold">재하</span>
                  <span className="text-xs text-gray-500">
                    컴퓨터과학전공 19학번
                  </span>
                </div>
                <div className="flex gap-8 justify-center mb-3">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-gray-500">포스트</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-gray-500">팔로워</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-gray-500">팔로잉</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 프로필/시간표 버튼 */}
            <div className="flex gap-2 mt-2 w-full">
              <button className="flex-1 py-2 font-semibold text-white bg-black rounded transition hover:bg-gray-800">
                내 프로필
              </button>
              <button className="flex-1 py-2 font-semibold text-white bg-black rounded transition hover:bg-gray-800">
                내 시간표
              </button>
            </div>
          </div>

          {/* 커피챗 기록 */}
          <div className="mx-4 mt-6">
            <div className="flex justify-between items-center mb-2">
              <button className="font-bold transition hover:text-blue-600">
                커피챗 기록
              </button>
              <span className="text-2xl text-gray-500">&gt;</span>
            </div>
            <div className="flex gap-3">
              <div className="aspect-[11/12] min-w-0 flex-1 rounded-lg bg-gray-200" />
              <div className="aspect-[11/12] min-w-0 flex-1 rounded-lg bg-gray-200" />
              <div className="aspect-[11/12] min-w-0 flex-1 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* 저장한 콘텐츠, 로그아웃, 회원탈퇴 */}
          <div className="flex flex-col gap-2 pt-4 mx-4 mt-8 border-t border-gray-200">
            <button className="flex justify-between items-center px-2 py-2 rounded transition cursor-pointer hover:bg-gray-100">
              <span>저장한 콘텐츠 조회</span>
              <span className="text-xl text-gray-500">&gt;</span>
            </button>
            <button className="px-2 py-2 text-left text-gray-400 rounded transition hover:text-red-500">
              로그아웃
            </button>
            <button className="px-2 py-2 text-left text-gray-400 rounded transition hover:text-red-500">
              회원탈퇴
            </button>
          </div>
        </div>
        <BottomNavbar activeLabel="마이" />
      </div>
    </>
  );
};

export default MyPage;
