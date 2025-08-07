/*
 * author : 박은지
 * description : 채팅 관련 타입 정의
 */

// 채팅방 목록 조회 응답 타입
export interface ChatRoom {
  chatroomId: string;
  userId: number;
  lastMessage: string;
  check: boolean;
}

export interface ChatRoomListResponse {
  resultType: string;
  error: null;
  success: ChatRoom[];
}

// 채팅방 메시지 조회 응답 타입
export interface ChatMessage {
  id: string;
  chatRoomId: string;
  userId: number;
  messageBody: string;
  createdAt: string;
  isPhoto: boolean;
  check: boolean;
}

export interface ChatMessageListResponse {
  resultType: string;
  error: null;
  success: ChatMessage[];
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  message: string;
}

// 메시지 전송 응답 타입
export interface SendMessageResponse {
  resultType: string;
  error: null;
  success: string;
}
