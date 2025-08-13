/*
 * author : 앨리스/박은지
 * description : 채팅방 유저 정보 훅
 */

import { useState, useEffect } from "react";
import { getProfile } from "../../../api/profile";

export interface ChatUser {
  id: number;
  username: string;
  info: string;
  interests: string[];
  profileImage?: string;
}

export const useChatUser = () => {
  const [user, setUser] = useState<ChatUser>({
    id: 1,
    username: "로딩 중...",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "창업", "글쓰기"],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success) {
          setUser({
            id: response.success.userInfo.userId,
            username: response.success.userInfo.name || "사용자",
            info: "이런 주제에 관심 있어요!",
            interests: response.success.interest?.map(
              (item: { category: { categoryName: string } }) =>
                item.category.categoryName,
            ) || ["디자인", "개발", "창업", "글쓰기"],
            profileImage: response.success.userInfo.profileImage,
          });
        }
      } catch {
        // 프로필 로딩 실패 시 기본값 유지
      }
    };

    fetchUserProfile();
  }, []);

  return user;
};
