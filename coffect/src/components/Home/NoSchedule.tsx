/*
  author      : 이희선
  description : 커피챗 일정이 없을 때의 안내 컴포넌트
*/
import NoCalendarImage from "../../assets/Home/NoCalendar.png";

const NoSchedule = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--gray-5)] text-center">
      {/* 안내 텍스트 */}
      <p className="mb-[0.5rem] text-xl font-bold text-[var(--gray-90)]">
        예정된 커피챗 일정이 없어요!
      </p>
      <p className="mb-[1rem] text-base font-medium text-[var(--gray-40)]">
        마음에 드는 친구와 커피챗 일정을 잡아보세요
      </p>
      {/* 안내 이미지 */}
      <img
        src={NoCalendarImage}
        alt="일정 없음"
        className="mx-auto h-auto w-[30%] object-contain"
      />
    </div>
  );
};

export default NoSchedule;
