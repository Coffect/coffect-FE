/*
 * author : 박은지
 * description : 채팅방 목록 조회, 소켓 연결 관리
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getChatRoomList } from "../../api/chat/chatRoomApi";
import { getProfile, getProfileSearch } from "../../api/profile";
import { getUserStringId } from "../../api/home";
import { socketManager } from "../../api/chat";
import type { ChatRoomWithUser } from "../../types/chat";

interface UseChatRoomsReturn {
  chatRooms: ChatRoomWithUser[];
  isLoading: boolean;
  error: string | null;
  loadChatRooms: () => Promise<void>;
}

export const useChatRooms = (): UseChatRoomsReturn => {
  const [chatRooms, setChatRooms] = useState<ChatRoomWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 언마운트 가드
  const isMountedRef = useRef(true);

  // 채팅방 목록 조회
  const loadChatRooms = useCallback(async () => {
    if (isLoading) return; // 이미 로딩 중이면 중복 호출 방지
    try {
      setIsLoading(true);
      setError(null);

      // 소켓 연결
      try {
        socketManager.connect();
      } catch (error) {
        console.warn("소켓 연결 실패:", error);
      }

      const response = await getChatRoomList();

      // 응답 타입 확인
      if (response.resultType === "FAIL") {
        const errorMessage =
          response.error?.reason || "채팅방 목록 조회에 실패했습니다.";
        setError(errorMessage);
        return;
      }

      const chatRoomsData = response.success;

      // 현재 사용자 정보 가져오기
      const currentUserProfile = await getProfile();
      const currentUserId = currentUserProfile.success?.userInfo?.userId;

      if (!currentUserId) {
        console.warn(
          "사용자 정보를 가져올 수 없습니다. 기본 채팅방 목록만 표시합니다.",
        );
        // 사용자 정보 없이 기본 채팅방 목록만 설정
        const basicChatRooms = chatRoomsData.map((room) => ({
          ...room,
          userInfo: {
            name: "알 수 없는 사용자",
            major: "정보 없음",
            profileImage: "",
          },
        }));
        setChatRooms(basicChatRooms);
        return;
      }

      const chatRoomsWithUserInfo = await Promise.all(
        chatRoomsData.map(async (chatRoom) => {
          try {
            // 상대방 ID 찾기
            const opponentUserId =
              chatRoom.userId === currentUserId ? null : chatRoom.userId;

            if (!opponentUserId) {
              return {
                ...chatRoom,
                userInfo: {
                  name: "상대방",
                  major: "전공 정보 없음",
                  profileImage: "",
                },
              };
            }

            // 상대방의 stringId 가져오기
            const stringId = await getUserStringId(opponentUserId);

            // 상대방의 전체 프로필 가져오기
            try {
              const profileResponse = await getProfileSearch(stringId);
              const userInfo = profileResponse.success?.userInfo;

              return {
                ...chatRoom,
                userInfo: {
                  name: userInfo?.name || "상대방",
                  major: userInfo?.dept || "전공 정보 없음",
                  profileImage: userInfo?.profileImage || "",
                },
              };
            } catch {
              // 프로필 로딩 실패 시 기본값 반환
              return {
                ...chatRoom,
                userInfo: {
                  name: "상대방",
                  major: "전공 정보 없음",
                  profileImage: "",
                },
              };
            }
          } catch {
            // 전체 처리 실패 시 기본값 반환
            return {
              ...chatRoom,
              userInfo: {
                name: "상대방",
                major: "전공 정보 없음",
                profileImage: "",
              },
            };
          }
        }),
      );

      // undefined 값 필터링 및 타입 명시
      const validChatRooms = chatRoomsWithUserInfo.filter(
        (room) => room !== undefined,
      ) as ChatRoomWithUser[];

      setChatRooms(validChatRooms);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: { reason?: string } } };
      };
      const errorMessage =
        error.response?.data?.error?.reason ||
        "채팅방 목록 조회에 실패했습니다.";
      if (!isMountedRef.current) return;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadChatRooms();

    // 언마운트 시 가드 설정
    return () => {
      isMountedRef.current = false;
    };
  }, []); // loadChatRooms 의존성 제거

  // 채팅방 목록 정렬 (최근 메시지 순)
  const sortedChatRooms = useMemo(() => {
    return [...chatRooms].sort((a, b) => {
      // 시간순 정렬 (최신 메시지가 위로)
      const timeA = new Date(a.lastMessageTime ?? 0).getTime();
      const timeB = new Date(b.lastMessageTime ?? 0).getTime();
      return timeB - timeA;
    });
  }, [chatRooms]);

  return {
    chatRooms: sortedChatRooms,
    isLoading,
    error,
    loadChatRooms,
  };
};
