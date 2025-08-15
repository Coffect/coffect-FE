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
      return;
    }

    const socketUrl = import.meta.env.DEV
      ? "ws://localhost:3000" // 로컬 개발용
      : import.meta.env.VITE_SERVER_API_URL?.replace(/^http/, "ws") ||
        "wss://coffect.kro.kr";

    this.socket = io(socketUrl, {
      auth: {
        token: token || localStorage.getItem("accessToken"),
      },
      transports: ["websocket"], // websocket만 사용
      autoConnect: false, // 자동 연결 비활성화
      reconnection: true, // 자동 재연결 활성화
      reconnectionAttempts: 5, // 재연결 시도 횟수
      reconnectionDelay: 1000, // 재연결 간격 (1초)
      reconnectionDelayMax: 5000, // 최대 재연결 간격 (5초)
      timeout: 20000, // 연결 타임아웃 20초로 증가
      forceNew: false, // 기존 연결 재사용
    });

    // 수동으로 연결 시도
    this.socket.connect();

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
      // 연결 실패 시 즉시 연결 중단
      if (this.socket) {
        this.socket.disconnect();
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket 재연결 성공:", attemptNumber);
      this.isConnected = true;
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket 재연결 실패:", error);
      // 재연결 실패 시 즉시 연결 중단
      if (this.socket) {
        this.socket.disconnect();
      }
    });
  }

  // 메시지 전송
  sendMessage(chatRoomId: string, message: string) {
    if (!this.socket?.connected) {
      console.error("Socket is not connected");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.send, {
      chatRoomId,
      message,
    });
  }

  // 메시지 수신 리스너
  onReceiveMessage(callback: (message: SocketMessage) => void) {
    if (!this.socket) return;
    this.socket.on(SOCKET_EVENTS.receive, callback);
  }

  // 에러 수신 리스너
  onErrorAck(callback: (error: unknown) => void) {
    if (!this.socket) return;
    this.socket.on(SOCKET_EVENTS.errorAck, callback);
  }

  // 타이핑 시작
  startTyping(chatRoomId: string, userId: number) {
    if (!this.socket?.connected) return;

    this.socket.emit(SOCKET_EVENTS.typing, { chatRoomId, userId });
  }

  // 타이핑 이벤트 리스너
  onUserTyping(
    callback: (data: { chatRoomId: string; userId: number }) => void,
  ) {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.userTyping, callback);
  }

  // 메시지 읽음 상태 전송
  sendSeen(chatRoomId: string, messageId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit(SOCKET_EVENTS.seen, { chatRoomId, messageId });
  }

  // 메시지 읽음 상태 수신 리스너
  onMessageSeen(
    callback: (data: {
      chatRoomId: string;
      messageId: string;
      userId: number;
    }) => void,
  ) {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.messageSeen, callback);
  }

  // 연결 상태 확인
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // 채팅방 입장
  joinRoom(chatRoomId: string, userId: number) {
    if (!this.socket?.connected) {
      console.error("Socket is not connected");
      return;
    }
    this.socket.emit("join_room", { chatRoomId, userId });
  }

  // 채팅방 퇴장
  leaveRoom(chatRoomId: string, userId: number) {
    if (!this.socket?.connected) {
      console.error("Socket is not connected");
      return;
    }
    this.socket.emit("leave_room", { chatRoomId, userId });
  }

  // 연결 이벤트 리스너
  onConnect(callback: () => void) {
    if (!this.socket) return;
    this.socket.on("connect", callback);
  }

  // 연결 해제 이벤트 리스너
  onDisconnect(callback: (reason: string) => void) {
    if (!this.socket) return;
    this.socket.on("disconnect", callback);
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
  off(event: string, listener?: (...args: unknown[]) => void) {
    if (this.socket) {
      if (listener) {
        this.socket.off(event, listener);
      } else {
        this.socket.off(event);
      }
    }
  }

  // 특정 이벤트의 모든 리스너 제거
  offEvent(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// 싱글톤 인스턴스 생성
export const socketManager = new SocketManager();
export default socketManager;
