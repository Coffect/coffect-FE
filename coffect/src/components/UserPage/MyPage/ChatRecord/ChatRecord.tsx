/*
author : 재하
description : 마이페이지에서 나의 커피챗 기록 카드 목록을 출력하는 컴포넌트입니다.
*/

import { useNavigate } from "react-router-dom";

// 각 카드별로 사용할 그라데이션 색상 정보를 포함한 예시 데이터
const chatRecords: { id: number; gradient: string }[] = [
  { id: 1, gradient: "from-blue-200 to-blue-200" },
  //   { id: 1, gradient: "from-blue-200 to-green-300" },
  //   { id: 1, gradient: "from-blue-200 to-amber-400" },
  //   { id: 1, gradient: "from-blue-200 to-yellow-200" },
  //   { id: 1, gradient: "from-blue-200 to-pink-400" },
  //   { id: 1, gradient: "from-blue-200 to-purple-600" },
  { id: 2, gradient: "from-blue-100 to-orange-300" },
  { id: 3, gradient: "from-green-400 to-amber-500" },
  { id: 4, gradient: "from-pink-200 to-yellow-200" },
  { id: 5, gradient: "from-purple-600 to-pink-400" },
  { id: 6, gradient: "from-pink-200 to-blue-200" },
];

/*
커피챗 기록 카드 목록을 렌더링하는 함수형 컴포넌트입니다.
*/
const ChatRecord = () => {
  const navigate = useNavigate();
  const hasRecords = chatRecords.length > 0;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white">
      {/* 뒤로가기 버튼 */}
      <button
        className="mt-4 ml-4 text-left text-3xl"
        onClick={() => navigate("/mypage")}
      >
        &#x25C0;
      </button>
      {/* 타이틀 및 서브타이틀 */}
      <div className="mt-2 ml-4 text-xl font-bold">나의 커피챗 기록</div>
      <div className="mt-1 ml-4 text-sm text-gray-500">
        우리의 연결이 더 큰 영향력이 되도록
      </div>
      {/* 커피챗 기록이 있을 때 카드 목록, 없을 때 안내 메시지 */}
      {hasRecords ? (
        <div className="grid grid-cols-2 gap-4 p-4 pt-6">
          {/* chatRecords 배열을 map으로 카드 렌더링 */}
          {chatRecords.map((record) => (
            <div
              key={record.id}
              className={`aspect-[11/12] w-full rounded-xl bg-gradient-to-b ${record.gradient} flex cursor-pointer items-center justify-center border-2 border-black`}
              onClick={() =>
                navigate(`/mypage/chatrecord/${record.id}`, {
                  state: { gradient: record.gradient },
                })
              }
            >
              {/* 카드 내용이 필요하면 여기에 추가 */}
            </div>
          ))}
        </div>
      ) : (
        // 커피챗 기록이 없는 경우의 렌더링
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-2 text-5xl">😢</div>
          <div className="text-lg text-gray-700">
            아직 커피챗을 진행한 기록이 없어요!
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRecord;
