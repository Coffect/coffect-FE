/*
  author      : 이희선
  description : 커피챗 일정이 없을 때의 안내 컴포넌트
*/

const NoSchedule = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white text-center">
      {/* 안내 텍스트 */}
      <p className="mb-[1vh] text-lg font-semibold">
        예정된 커피챗 일정이 없어요!
      </p>
      <p className="mb-[3vh] text-sm text-gray-500">
        마음에 드는 친구와 커피챗 일정을 잡아보세요
      </p>

      {/* 안내 이미지 */}
      <span className="text-8xl">📭</span>
    </div>
  );
};

export default NoSchedule;
