/*
 * author : 박은지
 * description : Socket.io 클라이언트 설정
 */

import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS, type SocketMessage } from "../../types/chat";

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;

  // Socket 연결
  connect(token?: string) {
    if (this.socket?.connected) {
      console.log("Socket 연결됨");
      return;
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://13.124.169.70:3000";

    console.log("소켓 연결 시도:", socketUrl);

    this.socket = io(socketUrl, {
      auth: {
        token: token || localStorage.getItem("accessToken"),
      },
      transports: ["polling", "websocket"], // polling을 먼저 시도
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  // 이벤트 리스너 설정
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket 연결 성공");
      this.isConnected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket 연결 해제:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket 연결 실패:", error);
      this.isConnected = false;
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket 재연결 성공:", attemptNumber);
      this.isConnected = true;
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket 재연결 실패:", error);
    });
  }

  // 채팅방 입장
  joinRoom(chatRoomId: string, userId: number) {
    if (!this.socket?.connected) {
      console.error("Socket 연결 끊김");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      chatRoomId,
      userId,
    });
  }

  // 채팅방 퇴장
  leaveRoom(chatRoomId: string, userId: number) {
    if (!this.socket?.connected) {
      console.error("Socket 연결 끊김");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.LEAVE_ROOM, {
      chatRoomId,
      userId,
    });
  }

  // 메시지 전송
  sendMessage(chatRoomId: string, message: string) {
    if (!this.socket?.connected) {
      console.error("Socket is not connected");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      chatRoomId,
      message,
    });
  }

  // 메시지 수신 리스너
  onReceiveMessage(callback: (message: SocketMessage) => void) {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }

  // 타이핑 시작
  startTyping(chatRoomId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit(SOCKET_EVENTS.TYPING, { chatRoomId });
  }

  // 타이핑 중지
  stopTyping(chatRoomId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit(SOCKET_EVENTS.STOP_TYPING, { chatRoomId });
  }

  // 타이핑 이벤트 리스너
  onTyping(callback: (data: { chatRoomId: string; userId: number }) => void) {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.TYPING, callback);
  }

  onStopTyping(
    callback: (data: { chatRoomId: string; userId: number }) => void,
  ) {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.STOP_TYPING, callback);
  }

  // 연결 상태 확인
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Socket 연결 해제
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 이벤트 리스너 제거
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// 싱글톤 인스턴스 생성
export const socketManager = new SocketManager();
export default socketManager;
