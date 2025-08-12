/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

import usePreventZoom from "./hooks/usePreventZoom";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import ChatInputBox from "./ChatInputBox";
import ChatHeader from "./ChatHeader";
import ChatInterestsSection from "./ChatInterestsSection";
import ChatMessageArea from "./ChatMessageArea";
import { useChatRoom } from "./hooks/useChatRoom";

const ChatRoom = () => {
  usePreventZoom();

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

  const {
    messages,
    inputValue,
    setInputValue,
    schedule,
    user,
    handleSend,
    handleImageSend,
  } = useChatRoom();

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
      <ChatHeader username={user.username} userId={user.id} />

      {/* 관심 주제 & 버튼 */}
      <ChatInterestsSection
        interests={user.interests}
        schedule={schedule}
        onOpenModal={openModal}
      />

      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />

      {/* 메시지 영역 */}
      <ChatMessageArea messages={messages} />

      {/* 입력창 */}
      <ChatInputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        onImageSend={handleImageSend}
      />
    </div>
  );
};

export default ChatRoom;
