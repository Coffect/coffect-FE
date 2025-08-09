/**
 * @author 흥부/강신욱
 * @description
 * 컴포넌트는 게시글 작성 페이지에서 글 종류와 주제를 선택할 수 있는 UI를 제공합니다.
 * 이 컴포넌트는 글 종류와 주제를 선택할 수 있는 칩 그룹을 렌더링하며, 선택된 값은 상위 컴포넌트로 전달됩니다.
 */
import React from "react";
import ChipGroup from "../ChipFilterComponent/ChipGroup";
import {
  postTypeOptions,
  postTopicOptions,
} from "../ChipFilterComponent/filterData";

/**
 * @interface WritePostTopicSelectorProps
 * @description
 * WritePostTopicSelector 컴포넌트에 전달되는 props의 타입을 정의합니다.
 * @property postType - 현재 선택된 게시글 종류 ( Ex: 아티클, 팀원 모집 등 )
 * @property handlePostTypeSelect - 게시글 종류 선택을 처리하는 함수
 * @property topic - 현재 선택된 게시글 주제 ( Ex: 프로덕트, 개발, 디자인 등 )
 * @property handleTopicSelect - 게시글 주제 선택을 처리하는 함수
 */
interface WritePostTopicSelectorProps {
  postType: string;
  handlePostTypeSelect: (postType: string) => void;
  topic: string;
  handleTopicSelect: (topic: string) => void;
}

const WritePostTopicSelector: React.FC<WritePostTopicSelectorProps> = ({
  postType,
  handlePostTypeSelect,
  topic,
  handleTopicSelect,
}) => {
  return (
    <div>
      <div className="px-4 pt-4">
        <div className="mb-4">
          <h3 className="mb-5 text-base font-semibold">글 종류</h3>
          <ChipGroup
            options={postTypeOptions}
            selectedOption={postType}
            onSelect={handlePostTypeSelect}
          />
        </div>
        <div className="pt-4">
          <h3 className="mb-5 text-base font-semibold">글 주제</h3>
          <ChipGroup
            options={postTopicOptions}
            selectedOption={topic}
            onSelect={handleTopicSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default WritePostTopicSelector;
