/*
 * author : 박은지
 * description : 채팅방 목록 조회, 소켓 연결 관리
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { getChatRoomList } from "../../api/chat/chatRoomApi";
import { getProfileSearch } from "../../api/profile";
import { getUserStringId } from "../../api/home";

import type { ChatRoomWithUser } from "../../types/chat";

interface UseChatRoomsReturn {
  chatRooms: ChatRoomWithUser[];
  isLoading: boolean;
  loadChatRooms: () => Promise<void>;
  markChatRoomAsRead: (chatRoomId: string) => void;
  refreshChatRooms: () => Promise<void>;
}

export const useChatRooms = (): UseChatRoomsReturn => {
  const [chatRooms, setChatRooms] = useState<ChatRoomWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 언마운트 가드
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  // 채팅방 목록 조회
  const loadChatRooms = useCallback(async () => {
    if (isLoading || hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;
    setIsLoading(true);
    try {
      const response = await getChatRoomList();
      if (response.resultType === "SUCCESS") {
        const chatRoomsData = response.success;

        // 상대방 정보가 이미 있는 경우 중복 API 호출 방지
        const chatRoomsWithUserInfo = await Promise.all(
          chatRoomsData.map(async (chatRoom) => {
            try {
              const opponentUserId = chatRoom.userId;

              // 상대방의 stringId 가져오기
              const stringId = await getUserStringId(opponentUserId);

              // 상대방의 전체 프로필 가져오기
              try {
                const profileResponse = await getProfileSearch(stringId);
                const userInfo = profileResponse.success?.userInfo;

                return {
                  ...chatRoom,
                  userInfo: userInfo
                    ? {
                        name: userInfo.name,
                        major: userInfo.dept,
                        profileImage: userInfo.profileImage,
                      }
                    : {
                        name: "상대방",
                        major: "",
                        profileImage: "",
                      },
                };
              } catch (profileError) {
                console.warn("상대방 프로필 조회 실패:", profileError);
                return {
                  ...chatRoom,
                  userInfo: {
                    name: "상대방",
                    major: "",
                    profileImage: "",
                  },
                };
              }
            } catch (error) {
              console.warn("상대방 정보 조회 실패:", error);
              return {
                ...chatRoom,
                userInfo: {
                  name: "상대방",
                  major: "",
                  profileImage: "",
                },
              };
            }
          }),
        );

        setChatRooms(chatRoomsWithUserInfo);
      }
    } catch (error) {
      console.error("채팅방 목록 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 채팅방 읽음 상태 업데이트
  const markChatRoomAsRead = useCallback((chatRoomId: string) => {
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((chatRoom) =>
        chatRoom.chatroomId === chatRoomId
          ? { ...chatRoom, check: true }
          : chatRoom,
      ),
    );
  }, []);

  // 채팅방 목록 새로고침
  const refreshChatRooms = useCallback(async () => {
    hasLoadedRef.current = false;
    await loadChatRooms();
  }, [loadChatRooms]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    chatRooms,
    isLoading,
    loadChatRooms,
    markChatRoomAsRead,
    refreshChatRooms,
  };
};
