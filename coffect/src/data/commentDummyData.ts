export interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
}

export const dummyComments: Comment[] = [
  {
    id: 1,
    user: { name: "shinwookKang", avatar: "https://via.placeholder.com/40" },
    content:
      "햇살이 유리창을 타고 들어와 방 안을 따뜻하게 채운다. 오늘도 작은 기쁨을 하나씩 찾아가는 하루.",
  },
  {
    id: 2,
    user: { name: "jehaPark", avatar: "https://via.placeholder.com/40" },
    content: "좋은 글 감사합니다~",
  },
  {
    id: 3,
    user: { name: "jehaPark", avatar: "https://via.placeholder.com/40" },
    content: " 안녕하세요~!",
  },
];
