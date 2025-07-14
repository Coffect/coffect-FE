/*
  author      : 이희선
  description : 알림이 없을 때 보여주는 안내 컴포넌트
*/
import NoAlarmImage from "../../assets/Home/NoAlarm.png";

const NoAlarm = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <p className="mb-4 text-lg font-bold text-[var(--gray-90)]">
        확인할 알림이 없어요!
      </p>
      <img
        src={NoAlarmImage}
        alt="알림 없음"
        className="mx-auto h-auto w-[30%] object-contain"
      />
    </div>
  );
};

export default NoAlarm;
