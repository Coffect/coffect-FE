/*
 * author : 앨리스/박은지
 * description : 채팅방 유틸 함수
 */

export function getMessageMargin(
  idx: number,
  messages: Array<{ mine: boolean }>,
) {
  if (idx === 0) return "mt-4";
  const prev = messages[idx - 1];
  return prev && prev.mine !== messages[idx].mine ? "mt-6" : "mt-2";
}
