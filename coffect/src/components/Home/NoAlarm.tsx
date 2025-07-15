/*
  author      : 이희선
  description : 알림이 없을 때 보여주는 안내 컴포넌트
*/

const NoAlarm = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <p className="mb-4 text-xl font-bold">확인할 알림이 없어요!</p>
      <span className="text-8xl">📭</span>
    </div>
  );
};

export default NoAlarm;
