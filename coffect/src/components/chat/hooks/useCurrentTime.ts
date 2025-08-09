// author : 앨리스/박은지
/*
 * description : 현재 시간을 오전/오후 시:분 형태로 반환
 */
// 채팅방 내에서 활용

const useCurrentTime = () => {
  return () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes().toString().padStart(2, "0");
    const ampm = hour < 12 ? "오전" : "오후";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${ampm} ${hour12}:${minute}`;
  };
};

export default useCurrentTime;
