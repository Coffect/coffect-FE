/*
 * author : 박은지
 * description : 채팅 관련 타입 정의
 */

// 기존 메시지 타입 (UI용)
export type Message =
  | { id: number; type: "text"; text: string; time: string; mine: boolean }
  | {
      id: number;
      type: "image";
      imageUrl: string;
      mine: boolean;
      time: string;
    };

// API 관련 타입들
export interface CreateChatRoomRequest {
  userId: number;
}

export interface CreateChatRoomResponse {
  resultType: string;
  error: null;
  success: {
    chatRoomId: string;
  };
}

export interface CreateChatRoomErrorResponse {
  resultType: "FAIL";
  error: {
    errorCode: string;
    reason: string;
    data: string;
  };
  success: null;
}

// 채팅방 목록 조회 응답 타입
export interface ChatRoom {
  chatroomId: string;
  userId: number;
  lastMessage: string;
  check: boolean;
  lastReadMessageId?: string; // 마지막으로 읽은 메시지 ID
  lastMessageTime?: string; // 마지막 메시지 시간 (시간순 정렬용)
}

// 사용자 정보가 포함된 채팅방 타입
export interface ChatRoomWithUser extends ChatRoom {
  userInfo?: {
    name: string;
    major: string;
    profileImage?: string;
  };
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

// 채팅방 메시지 읽음 처리 응답 타입
export interface MarkAsReadResponse {
  resultType: string;
  error: null;
  success: string;
}

// 메시지 사진 전송 응답 타입
export interface SendPhotoResponse {
  resultType: string;
  error: null;
  success: ChatMessage;
}

// Socket.io 이벤트 타입들
export interface SocketMessage {
  id: string;
  chatRoomId: string;
  userId: number;
  messageBody: string;
  createdAt: string;
  isPhoto: boolean;
  check: boolean;
}

export interface SocketJoinRoom {
  chatRoomId: string;
  userId: number;
}

export interface SocketLeaveRoom {
  chatRoomId: string;
  userId: number;
}

// Socket.io 이벤트 이름들
export const SOCKET_EVENTS = {
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",
  USER_JOINED: "user_joined",
  USER_LEFT: "user_left",
} as const;
