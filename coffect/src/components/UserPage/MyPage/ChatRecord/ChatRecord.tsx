/*
author : 재하
description : 마이페이지에서 나의 커피챗 기록 카드 목록을 출력하는 컴포넌트입니다.
*/

import { useNavigate } from "react-router-dom";
import backIcon from "../../../../assets/icon/mypage/back.png";
import coffeeIcon from "../../../../assets/icon/mypage/inCoffeeChatRecord.png";
import emptyChatRecordImg from "../../../../assets/icon/mypage/emptyChatRecord.png";

// 각 카드별로 사용할 그라데이션 색상, 날짜, 이름 정보를 포함한 예시 데이터
const chatRecords: {
  id: number;
  gradient: string;
  date: string;
  name: string;
}[] = [
  {
    id: 1,
    gradient: "from-[var(--design-bg)] via-pink-100 to-[var(--design-bg)]",
    date: "2025.07.07",
    name: "김라떼님과",
  },
  {
    id: 2,
    gradient: "from-[var(--design-bg)] via-orange-100 to-[var(--design-bg)]",
    date: "2025.07.07",
    name: "최현비님과",
  },
  {
    id: 3,
    gradient: "from-[var(--design-bg)] via-green-100 to-[var(--design-bg)]",
    date: "2025.10.20",
    name: "재하님과",
  },
  {
    id: 4,
    gradient: "from-[var(--design-bg)] via-blue-100 to-[var(--design-bg)]",
    date: "2025.10.20",
    name: "가나디님과",
  },
  {
    id: 5,
    gradient: "from-[var(--design-bg)] via-purple-100 to-[var(--design-bg)]",
    date: "2025.10.20",
    name: "뜌어어님과",
  },
];

/*
커피챗 기록 카드 목록을 렌더링하는 함수형 컴포넌트입니다.
*/
const ChatRecord = () => {
  const navigate = useNavigate();
  const hasRecords = chatRecords.length > 0;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-4">
      {/* 뒤로가기 버튼 */}
      <button
        className="py-4 text-left text-3xl"
        onClick={() => navigate("/mypage")}
      >
        <img src={backIcon} className="h-6 w-6" />
      </button>

      {/* 상단 중앙 타이틀 및 총 커피챗 기록 */}
      {hasRecords && (
        <div className="mt-2 mb-2 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-[var(--gray-90)]">
            나의 커피챗 기록
          </div>
          <div className="text-md py-2 text-[var(--gray-50)]">
            우리의 연결이 더 큰 영향력이 되도록
          </div>
          <div className="m-4 flex flex-row items-center rounded-full bg-[var(--gray-70)] px-4 py-3">
            <img
              src={coffeeIcon}
              className="mr-2 h-5 w-5 text-[var(--gray-20)]"
            />
            <span className="text-sm text-white">
              {" "}
              총 {chatRecords.length}번의 커피챗
            </span>
          </div>
        </div>
      )}

      {/* 커피챗 기록이 있을 때 카드 목록, 없을 때 안내 메시지 */}
      {hasRecords ? (
        <div className="flex flex-col gap-3 py-4">
          {Array.from({ length: Math.ceil(chatRecords.length / 3) }).map(
            (_, groupIdx) => {
              const start = groupIdx * 3;
              const group = chatRecords.slice(start, start + 3);
              const isEven = groupIdx % 2 === 0;
              return (
                <div key={groupIdx} className="flex w-full flex-row gap-3">
                  {isEven ? (
                    <>
                      {/* 좌측: 정사각 2개 세로 */}
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="aspect-square min-h-0 w-full min-w-0">
                          {group[0] && (
                            <Card record={group[0]} navigate={navigate} />
                          )}
                        </div>
                        <div className="aspect-square min-h-0 w-full min-w-0">
                          {group[2] && (
                            <Card record={group[2]} navigate={navigate} />
                          )}
                        </div>
                      </div>
                      {/* 우측: 세로 긴 카드 */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        {group[1] && (
                          <div className="aspect-[1/2.06] min-h-0 w-full min-w-0">
                            <Card record={group[1]} navigate={navigate} />
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 좌측: 세로 긴 카드 */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        {group[0] && (
                          <div className="aspect-[1/2.06] min-h-0 w-full min-w-0">
                            <Card record={group[0]} navigate={navigate} />
                          </div>
                        )}
                      </div>
                      {/* 우측: 정사각 2개 세로 */}
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="aspect-square min-h-0 w-full min-w-0">
                          {group[1] && (
                            <Card record={group[1]} navigate={navigate} />
                          )}
                        </div>
                        <div className="aspect-square min-h-0 w-full min-w-0">
                          {group[2] && (
                            <Card record={group[2]} navigate={navigate} />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            },
          )}
        </div>
      ) : (
        <div className="mb-15 flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-3 text-xl font-bold text-[var(--gray-90)]">
            아직 커피챗 기록이 없어요!
          </p>
          <p className="mb-2 text-[var(--gray-50)]">
            지금 바로 추천 카드를 통해
          </p>
          <p className="mb-3 text-[var(--gray-50)]">커피챗을 제안해보세요!</p>
          <img
            src={emptyChatRecordImg}
            alt="채팅 기록 없음"
            className="h-[110px] w-[110px]"
          />
        </div>
      )}
    </div>
  );
};

export default ChatRecord;

// 카드 렌더링용 컴포넌트
const Card = ({
  record,
  navigate,
}: {
  record: (typeof chatRecords)[0];
  navigate: (path: string) => void;
}) => (
  <div
    className={`relative rounded-xl bg-gradient-to-br ${record.gradient} flex h-full min-h-0 w-full min-w-0 items-start justify-start overflow-hidden`}
    // 카드 클릭 시 상세로 이동
    onClick={() => {
      navigate(`/mypage/chatrecord/${record.id}`);
    }}
  >
    {/* 날짜 */}
    <div className="absolute top-3 right-3 rounded-full bg-white/80 px-3 py-1.5 text-sm text-[var(--gray-60)]">
      {record.date}
    </div>
    {/* 이름 */}
    <div className="absolute bottom-4 left-4 text-xl font-semibold text-[var(--gray-70)]">
      {record.name}
    </div>
  </div>
);
