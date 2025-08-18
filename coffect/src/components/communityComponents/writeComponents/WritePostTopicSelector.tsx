/**
 * @interface WritePostTopicSelectorProps
 * @description
 * WritePostTopicSelector 컴포넌트에 전달되는 props의 타입을 정의합니다.
 * @property postType - 현재 선택된 게시글 종류 ( Ex: 아티클, 팀원 모집 등 )
 * @property handlePostTypeSelect - 게시글 종류 선택을 처리하는 함수
 * @property topic - 현재 선택된 게시글 주제 ( Ex: 프로덕트, 개발, 디자인 등 )
 * @property handleTopicSelect - 게시글 주제 선택을 처리하는 함수
 */
import React from "react";
import ChipGroup from "../ChipFilterComponent/ChipGroup";
import {
  postTypeOptions,
  postSubjectOptions,
} from "../ChipFilterComponent/filterData";
import type { ChipOption } from "../ChipFilterComponent/filterData";

/**
 * @interface WritePostTopicSelectorProps
 * @description
 * WritePostTopicSelector 컴포넌트에 전달되는 props의 타입을 정의합니다.
 * @property type - 현재 선택된 게시글 종류 ( Ex: 아티클, 팀원 모집 등 )
 * @property handleTypeSelect - 게시글 종류 선택을 처리하는 함수
 * @property topic - 현재 선택된 게시글 주제 ( Ex: 프로덕트, 개발, 디자인 등 )
 * @property handleThreadSubjectSelect - 게시글 주제 선택을 처리하는 함수
 */
interface WritePostTopicSelectorProps {
  type: string;
  handleTypeSelect: (option: ChipOption) => void;
  topic: string;
  handleThreadSubjectSelect: (option: ChipOption) => void;
}

const WritePostTopicSelector: React.FC<WritePostTopicSelectorProps> = ({
  type: postType,
  handleTypeSelect: handlePostTypeSelect,
  topic: subject,
  handleThreadSubjectSelect: handleTopicSelect,
}) => {
  return (
    <div>
      <div className="px-4 pt-4">
        <div className="mb-4">
          <h3 className="mb-5 text-lg font-medium text-[var(--gray-90)]">
            글 종류
          </h3>
          <ChipGroup
            options={postTypeOptions}
            selectedOption={postType}
            onSelect={handlePostTypeSelect}
          />
        </div>
        <div className="pt-4">
          <h3 className="mb-5 text-lg font-medium text-[var(--gray-90)]">
            글 주제
          </h3>
          <ChipGroup
            options={postSubjectOptions}
            selectedOption={[Number(subject)]}
            onSelect={handleTopicSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default WritePostTopicSelector;
