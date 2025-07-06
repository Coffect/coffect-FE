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
    // 전체 화면 반투명 레이어
    <div className="fixed inset-0 z-50 flex items-center justify-center border border-gray-800 bg-black/60">
      {/* 모달 본문 영역 */}
      <div className="w-[90%] rounded-[1vw] bg-white p-[5vw] pt-[10vw]">
        {/* 제목 */}
        <div className="mb-[1.5vh] flex items-end justify-start gap-[0.5vw]">
          ☕
          <h3 className="text-[4vw] font-extrabold text-gray-800">
            커피챗 제안하기
          </h3>
        </div>

        {/* 안내 문구 */}
        <p className="mb-[2vh] text-[3vw] font-semibold text-gray-800">
          메시지를 함께 적어서 보낼 경우, 성사율이 높아져요!
        </p>

        {/* 메시지 입력 영역 */}
        <textarea
          className="h-[20vh] w-full resize-none rounded-sm border border-gray-800 bg-gray-200 p-[4vw] text-[3vw] leading-tight"
          placeholder="하고 싶은 이야기나, 공통 관심사 등을 여쭤보세요!"
          value={text}
          onChange={handleChange}
        />

        {/* 버튼 그룹: 제안하기 / 창 닫기 */}
        <div className="mt-[2vh] flex justify-center gap-[4vw]">
          {/* 제안 버튼 */}
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-sm bg-black py-[2vh] text-[3.5vw] font-semibold text-white"
          >
            커피챗 제안하기
          </button>

          {/* 창 닫기 버튼 */}
          <button
            onClick={onCancel}
            className="flex-1 rounded-sm border border-gray-400 py-[2vh] text-[3.5vw] text-gray-700"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSuggestModal;
