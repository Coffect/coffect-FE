import { useState } from "react";
import {
  getChatRoomList,
  getChatMessages,
  markChatAsRead,
  sendPhoto,
} from "../api/chat";

const TestAPI = () => {
  const [chatRoomsResult, setChatRoomsResult] = useState("");
  const [messagesResult, setMessagesResult] = useState("");
  const [markReadResult, setMarkReadResult] = useState("");
  const [socketResult, setSocketResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testChatRooms = async () => {
    setLoading(true);
    try {
      const response = await getChatRoomList();
      setChatRoomsResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setChatRoomsResult(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testChatMessages = async () => {
    setLoading(true);
    try {
      // 테스트용 chatRoomId (실제로는 존재하는 ID여야 함)
      const response = await getChatMessages("test-room-id");
      setMessagesResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setMessagesResult(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testMarkAsRead = async () => {
    setLoading(true);
    try {
      const response = await markChatAsRead("test-room-id");
      setMarkReadResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setMarkReadResult(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSendPhoto = async () => {
    setLoading(true);
    try {
      // 테스트용 파일 생성
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const response = await sendPhoto("test-room-id", testFile);
      setMarkReadResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setMarkReadResult(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSocketConnection = () => {
    setLoading(true);
    try {
      // 소켓 연결 시도
      socketManager.connect();
      
      // 연결 상태 확인
      setTimeout(() => {
        const isConnected = socketManager.isSocketConnected();
        setSocketResult(
          isConnected 
            ? "소켓 연결 성공!" 
            : "소켓 연결 실패 - 연결 상태를 확인해주세요."
        );
        setLoading(false);
      }, 2000);
    } catch (error: any) {
      setSocketResult(`소켓 연결 오류: ${error.message || error}`);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">API 테스트</h1>

      <div className="space-y-4">
        <div>
          <button
            onClick={testChatRooms}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
          >
            {loading ? "테스트 중..." : "채팅방 목록 테스트"}
          </button>
          <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-2 text-sm">
            {chatRoomsResult || "결과가 여기에 표시됩니다..."}
          </pre>
        </div>

        <div>
          <button
            onClick={testChatMessages}
            disabled={loading}
            className="rounded bg-green-500 px-4 py-2 text-white disabled:bg-gray-400"
          >
            {loading ? "테스트 중..." : "채팅 메시지 테스트"}
          </button>
          <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-2 text-sm">
            {messagesResult || "결과가 여기에 표시됩니다..."}
          </pre>
        </div>

        <div>
          <button
            onClick={testMarkAsRead}
            disabled={loading}
            className="rounded bg-yellow-500 px-4 py-2 text-white disabled:bg-gray-400"
          >
            {loading ? "테스트 중..." : "읽음 처리 테스트"}
          </button>
          <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-2 text-sm">
            {markReadResult || "결과가 여기에 표시됩니다..."}
          </pre>
        </div>

        <div>
          <button
            onClick={testSendPhoto}
            disabled={loading}
            className="rounded bg-purple-500 px-4 py-2 text-white disabled:bg-gray-400"
          >
            {loading ? "테스트 중..." : "사진 전송 테스트"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;
