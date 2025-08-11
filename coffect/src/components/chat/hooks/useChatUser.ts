/*
 * author : 앨리스/박은지
 * description : 채팅방 유저 정보 훅
 */

export interface ChatUser {
  id: number;
  username: string;
  info: string;
  interests: string[];
}

export const useChatUser = () => {
  const user: ChatUser = {
    id: 1,
    username: "김라떼",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "창업", "글쓰기"],
  };

  return user;
};
