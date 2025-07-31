/** 
@author : 강신욱
@description : Header(고정바) 에서 토글 버튼 클릭 시 나오는 모달 컴포넌트 입니다. 

역할: 순수 UI 표시. 
데이터나 로직 없이 props로 받은 내용을 화면에 그리기만 하는 'Dumb Component' 역할.
*/

import "./FilterModalAnimation.css";
import ChipGroup from "../ChipFilterComponent/ChipGroup";
import { X } from "lucide-react";
import {
  postTypeOptions,
  postTopicOptions,
} from "../ChipFilterComponent/filterData";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  selectedType: string | null;
  selectedTopic: string | null;
  onTypeSelect: (option: string) => void;
  onTopicSelect: (option: string) => void;
}

const FilterModal = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  selectedType,
  selectedTopic,
  onTypeSelect,
  onTopicSelect,
}: FilterModalProps) => {
  if (!isVisible) return null;

  return (
    <div>
      <div
        className="fixed inset-0 z-40 backdrop-brightness-50"
        onClick={onClose}
      ></div>

      <div
        className={`fixed right-0 bottom-0 left-0 z-60 mx-auto h-[58.75%] w-full max-w-[430px] rounded-t-3xl bg-white ${isVisible ? "animate-slide-up" : "hidden"} flex flex-col`}
      >
        {/* 글 카테고리 선택하기 Text */}
        <div className="flex-shrink-0 p-4 pr-6 pb-1 pl-6">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-600">
              <X size={24} />
            </button>
          </div>
          <h2 className="mb-6 text-lg font-bold">글 카테고리 선택하기</h2>
        </div>

        {/* 디바이스가 작으면 Scroll 이 생기도록 함. (선택 부분) */}
        <div className="flex-grow overflow-y-auto px-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex">
                <h3 className="flex items-end text-base font-semibold">
                  글 종류 선택
                  <span className="ml-2 text-[12px] font-normal text-gray-500">
                    최대 1개
                  </span>
                </h3>
              </div>
              <ChipGroup
                options={postTypeOptions}
                selectedOption={selectedType}
                onSelect={onTypeSelect}
              />
            </div>

            <div>
              <div className="mb-2 flex">
                <h3 className="flex items-end text-base font-semibold">
                  글 주제 선택
                  <span className="ml-2 text-[12px] font-normal text-gray-500">
                    최대 1개
                  </span>
                </h3>
              </div>
              <ChipGroup
                options={postTopicOptions}
                selectedOption={selectedTopic}
                onSelect={onTopicSelect}
              />
            </div>
          </div>
        </div>

        {/* 적용하기 / 초기화 버튼 부분 */}
        <div className="w-full flex-shrink-0 p-4">
          <div className="flex justify-center gap-2">
            <button
              className={`flex-1 rounded-md px-12 py-4 ${selectedType || selectedTopic ? "bg-[#3a3a3a] text-white" : "cursor-not-allowed bg-gray-200"}`}
              disabled={!selectedType && !selectedTopic}
              onClick={onApply}
            >
              필터 적용하기
            </button>
            <button
              className="flex-1 rounded-md border border-[var(--gray-30)] px-4 py-2 text-[var(--gray-50)]"
              onClick={onReset}
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
