/* author : 강신욱
description : Header(고정바) 에서 토글 버튼 클릭 시 나오는 모달 컴포넌트 입니다. 
*/

import { useState } from "react";
import "./FilterModalAnimation.css";
import ChipGroup from "../common/ChipGroup";
import { X } from "lucide-react";

/*
type: 글의 종류 (아티클, 팀원 모집 등)
topic: 글의 주제 (프로덕트, 개발 등)
 */
interface Filters {
  type: string | null;
  topic: string | null;
}

/*
isVisible: 모달의 표시 여부 (ex: true= 모달 표시 / false= 모달 숨김)
onClose: 모달 닫기 함수 (ex: 모달 외부 클릭 시 모달 닫기)
onApply: 필터 적용 함수 (ex: 선택한 필터 값으로 게시물 필터링)
initialFilters: 초기 필터 값 (ex: { type: null, topic: null })
 */
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
}

const FilterModal = ({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(
    initialFilters.type,
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    initialFilters.topic,
  );

  const handleApplyFilter = () => {
    onApply({ type: selectedType, topic: selectedTopic });
  };

  const handleReset = () => {
    setSelectedType(null);
    setSelectedTopic(null);
  };

  if (!isVisible) return null;

  return (
    <div>
      <div
        className="fixed inset-0 z-40 backdrop-brightness-50"
        onClick={onClose}
      ></div>

      <div
        className={`fixed right-0 bottom-0 left-0 z-50 mx-auto h-[58.75%] w-full max-w-[430px] rounded-t-lg bg-white ${isVisible ? "animate-slide-up" : "hidden"} `}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="p-6">
            <div className="flex justify-end">
              <button onClick={onClose} className="text-gray-600">
                <X size={24} />
              </button>
            </div>
            <h2 className="mb-6 text-lg font-bold">글 카테고리 선택하기</h2>

            <div className="flex flex-col gap-4">
              <ChipGroup
                title="글 종류 선택"
                options={[
                  "아티클 ✍🏻",
                  "팀원 모집 👬",
                  "질문 👤",
                  "도움 필요 🤩",
                  "후기글 ☕",
                  "팁 공유 📌",
                ]}
                selectedOption={selectedType || ""}
                onSelect={(type) =>
                  setSelectedType(type === selectedType ? null : type)
                }
              />

              <ChipGroup
                title="글 주제 선택"
                options={[
                  "프로덕트",
                  "개발",
                  "디자인",
                  "기획",
                  "인사이트",
                  "취업",
                  "창업",
                  "학교",
                  "기타",
                ]}
                selectedOption={selectedTopic || ""}
                onSelect={(topic) =>
                  setSelectedTopic(topic === selectedTopic ? null : topic)
                }
              />
            </div>
          </div>

          <div className="flex h-[16%] w-full justify-center gap-3 p-4">
            <button
              className={`flex-1 rounded-md px-4 py-2 ${selectedType || selectedTopic ? "bg-[#3a3a3a] text-white" : "cursor-not-allowed bg-gray-200"}`}
              disabled={!selectedType && !selectedTopic}
              onClick={handleApplyFilter}
            >
              필터 적용하기
            </button>
            <button
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-500"
              onClick={handleReset}
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FilterModal;
