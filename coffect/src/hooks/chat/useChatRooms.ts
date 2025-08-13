/*
 * author : 박은지
 * description : 채팅방 목록 조회, 소켓 연결 관리
 */

import { useState, useEffect, useCallback } from "react";
import { getChatRoomList, socketManager } from "../../api/chat";
import {
  getUserStringId,
  getUserNameById,
  getUserDeptById,
} from "../../api/home";
import { getProfile } from "../../api/profile";
import type { ChatRoomWithUser } from "../../types/chat";

interface UseChatRoomsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useChatRooms = ({
  autoRefresh = false,
  refreshInterval = 30000, // 30초마다 자동 새로고침
}: UseChatRoomsOptions = {}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoomWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 채팅방 목록 조회
  const loadChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 소켓 연결 시작
      socketManager.connect();

      const response = await getChatRoomList();
      const chatRoomsData = response.success;

      // 각 채팅방의 사용자 정보를 병렬로 가져오기
      // 현재 사용자 정보 가져오기
      const currentUserProfile = await getProfile();
      const currentUserId = currentUserProfile.success?.userInfo?.userId;

      if (!currentUserId) {
        console.error("현재 사용자 ID를 가져올 수 없음");
        setError("사용자 정보를 가져올 수 없습니다.");
        return;
      }

      const chatRoomsWithUserInfo = await Promise.all(
        chatRoomsData.map(async (chatRoom) => {
          try {
            // chatRoom.userId가 상대방의 ID인지 확인
            // 만약 chatRoom.userId가 현재 사용자의 ID라면, 다른 방법으로 상대방 ID를 찾아야 함
            const opponentUserId =
              chatRoom.userId === currentUserId
                ? null // 현재 사용자와 같은 ID라면 상대방 ID를 찾는 다른 방법 필요
                : chatRoom.userId; // 상대방의 ID

            if (!opponentUserId) {
              console.log(
                `채팅방 ${chatRoom.chatroomId}에서 상대방 ID를 찾을 수 없음`,
              );
              return {
                ...chatRoom,
                userInfo: {
                  name: `상대방`,
                  major: "전공 정보 없음",
                },
              };
            }

            console.log(`상대방 ${opponentUserId} 정보 가져오기 시작`);

            // 상대방의 사용자 정보 가져오기
            const stringId = await getUserStringId(opponentUserId);
            console.log(`상대방 ${opponentUserId}의 stringId:`, stringId);

            if (stringId) {
              // 상대방 이름과 전공 정보 가져오기
              const [nameResponse, deptResponse] = await Promise.all([
                getUserNameById(stringId),
                getUserDeptById(stringId),
              ]);

              console.log(`상대방 ${opponentUserId}의 이름:`, nameResponse);
              console.log(`상대방 ${opponentUserId}의 전공:`, deptResponse);

              return {
                ...chatRoom,
                userInfo: {
                  name: nameResponse || `상대방`,
                  major: deptResponse || "전공 정보 없음",
                },
              };
            } else {
              console.log(
                `상대방 ${opponentUserId}의 stringId를 가져올 수 없음`,
              );
            }
          } catch (error) {
            console.error(
              `상대방 ${chatRoom.userId} 정보 가져오기 실패:`,
              error,
            );
          }

          // 실패 시 기본값 반환
          return {
            ...chatRoom,
            userInfo: {
              name: `상대방`,
              major: "전공 정보 없음",
            },
          };
        }),
      );

      setChatRooms(chatRoomsWithUserInfo);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: { reason?: string } } };
      };
      const errorMessage =
        error.response?.data?.error?.reason ||
        "채팅방 목록 조회에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // 자동 새로고침
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadChatRooms();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, loadChatRooms]);

  // 채팅방 목록 정렬 (최근 메시지 순)
  const sortedChatRooms = [...chatRooms].sort((a, b) => {
    // 시간순 정렬 (최신 메시지가 위로)
    const timeA = new Date(a.lastMessageTime ?? 0).getTime();
    const timeB = new Date(b.lastMessageTime ?? 0).getTime();
    return timeB - timeA;
  });

  return {
    chatRooms: sortedChatRooms,
    isLoading,
    error,
    loadChatRooms,
  };
};
