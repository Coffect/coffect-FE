// Post ( 피드 API 호출 ) 타입 정의
export interface Post {
  id: number;
  user: {
    profileImage: string;
    nickname: string;
  };
  image: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

// 필터 타입 정의
interface Filters {
  type: string | null;
  topic: string | null;
}

export const generateDummyPosts = (filters: Filters): Post[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    user: {
      profileImage: `https://randomuser.me/api/portraits/men/${i}.jpg`,
      nickname: `user_${i + 1}_${filters.type || "all"}`,
    },
    image: `https://picsum.photos/400/300?random=${i + 1}`,
    title: `[${filters.topic || "전체"}] 게시물 제목 ${i + 1}`,
    content: `이것은 게시물 내용입니다. 필터: ${filters.type}, ${filters.topic}`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
  }));
};
