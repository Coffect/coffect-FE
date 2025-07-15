/*
  author      : 이희선
  description : 커피챗 제안하기 모달 컴포넌트
                - 사용자가 간단한 메시지를 작성해 커피챗을 제안할 수 있습니다.
                - 메시지 작성 후 제안 버튼 클릭 시 상위로 메시지를 전달합니다.
*/

import { useState } from "react";

// props 타입 정의
interface CoffeeSuggestModalProps {
  onSubmit: (message: string) => void; // 작성 완료 시 호출되는 핸들러
  onCancel: () => void; // 모달 닫기 핸들러
}

const CoffeeSuggestModal: React.FC<CoffeeSuggestModalProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState<string>(""); // 입력 메시지 상태

  // 텍스트 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // 제안 제출 핸들러
  const handleSubmit = () => {
    onSubmit(text); // 입력된 텍스트 전달
  };

  return (
    // 모달 배경
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 컨테이너 */}
      <div className="flex w-[305px] flex-col items-center justify-between rounded-[20px] bg-[var(--gray-0)] shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 상단 콘텐츠 */}
        {/* 제목 */}
        <div className="mt-[6%] mb-[2%] ml-[6%] flex items-center justify-center px-[4%]">
          <h3 className="text-center text-base font-semibold text-[var(--gray-90)]">
            커피챗 제안하기✏️
          </h3>
        </div>

        {/* 설명 문구 */}
        <p className="mb-[6%] text-center text-sm leading-normal text-[var(--gray-50)]">
          메시지를 함께 적어서 보낼 경우
          <br />
          성사율이 높아져요!
        </p>

        {/* 메시지 입력창 */}
        <textarea
          maxLength={200} //200자 제한
          className="mb-[6%] aspect-[7/6] w-[88%] overflow-hidden rounded-[13px] bg-[var(--gray-5)] p-4 text-sm leading-tight font-normal break-keep focus:border-[var(--gray-40)] focus:ring-1 focus:ring-[var(--gray-40)] focus:outline-none"
          placeholder="하고 싶은 이야기나, 공통 관심사 등을 여쭤보세요! (최대 200자)"
          value={text}
          onChange={handleChange}
        />

        {/* 버튼 영역(닫기/제안 전송)*/}
        <div className="flex h-[50px] w-full overflow-hidden text-base">
          {/* 창 닫기 */}
          <button
            onClick={onCancel}
            className="flex-1 rounded-bl-xl border border-[var(--gray-0)] bg-white font-medium text-[var(--gray-40)]"
          >
            나중에
          </button>

          {/* 제안하기 */}
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-br-xl bg-[var(--gray-80)] font-semibold text-[var(--gray-0)]"
          >
            제안하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSuggestModal;
