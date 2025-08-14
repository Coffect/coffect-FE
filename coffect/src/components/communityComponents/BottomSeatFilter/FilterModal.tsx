import { useState, useEffect } from "react";
import "./FilterModalAnimation.css";
import ChipGroup from "../ChipFilterComponent/ChipGroup";
import { X } from "lucide-react";
import {
  postTypeOptions,
  postSubjectOptions,
} from "../ChipFilterComponent/filterData";
// import type { ChipOption } from "../ChipFilterComponent/filterData";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: { type: string | null; subject: number[] | null }) => void;
  onReset: () => void;
  selectedType: string | null;
  selectedSubject: number[] | null;
}

const FilterModal = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  selectedType,
  selectedSubject,
}: FilterModalProps) => {
  const [tempSelectedType, setTempSelectedType] = useState(selectedType);
  const [tempSelectedSubject, setTempSelectedSubject] =
    useState(selectedSubject);

  useEffect(() => {
    if (isVisible) {
      setTempSelectedType(selectedType);
      setTempSelectedSubject(selectedSubject);
    }
  }, [isVisible, selectedType, selectedSubject]);

  const handleApplyClick = () => {
    onApply({
      type: tempSelectedType,
      subject: tempSelectedSubject,
    });
  };

  const isApplyDisabled = !tempSelectedType || !tempSelectedSubject;

  if (!isVisible) return null;

  return (
    <div>
      <div
        className="fixed inset-0 z-40 backdrop-brightness-50"
        onClick={onClose}
      ></div>
      <div
        className={`fixed right-0 bottom-0 left-0 z-60 mx-auto h-[58.75%] w-full max-w-[430px] rounded-t-3xl bg-white ${
          isVisible ? "animate-slide-up" : "hidden"
        } flex flex-col`}
      >
        <div className="flex-shrink-0 p-4 pr-6 pb-1 pl-6">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-600">
              <X size={24} />
            </button>
          </div>
          <h2 className="mb-6 text-lg font-bold">글 카테고리 선택하기</h2>
        </div>
        <div className="flex-grow overflow-y-auto px-6">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="flex items-end text-base font-semibold">
                글 종류 선택
                <span className="ml-2 text-[12px] font-normal text-gray-500">
                  최대 1개
                </span>
              </h3>

              <ChipGroup
                options={postTypeOptions}
                selectedOption={tempSelectedType}
                onSelect={(option) => setTempSelectedType(option.value)}
              />
            </div>
            <div>
              <h3 className="flex items-end text-base font-semibold">
                글 주제 선택
                <span className="ml-2 text-[12px] font-normal text-gray-500">
                  최대 1개
                </span>
              </h3>
              <ChipGroup
                options={postSubjectOptions}
                selectedOption={tempSelectedSubject}
                onSelect={(option) => setTempSelectedSubject([option.id])}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex-shrink-0 p-4">
          <div className="flex justify-center gap-2">
            <button
              className={`flex-1 rounded-md px-12 py-4 ${
                !isApplyDisabled
                  ? "bg-[#3a3a3a] text-white"
                  : "cursor-not-allowed bg-gray-200"
              }`}
              disabled={isApplyDisabled}
              onClick={handleApplyClick}
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
