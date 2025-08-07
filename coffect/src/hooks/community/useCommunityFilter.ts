/** 
@author : 강신욱
@description : 커뮤니티 필터 상태를 관리하는 훅입니다.
              
역할: FilterModal의 UI 상태 관리.
모달이 열려있는 동안 사용자가 선택하는 임시 필터 값을 관리합니다.
*/
import { useState } from "react";

interface Filters {
  type: string | null;
  topic: string | null;
}

interface UseCommunityFilterProps {
  initialFilters: Filters;
}

export const useCommunityFilter = ({
  initialFilters,
}: UseCommunityFilterProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(
    initialFilters.type,
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    initialFilters.topic,
  );

  const handleTypeSelect = (type: string | null) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  const handleTopicSelect = (topic: string | null) => {
    setSelectedTopic((prev) => (prev === topic ? null : topic));
  };

  const handleReset = () => {
    setSelectedType(null);
    setSelectedTopic(null);
  };

  return {
    selectedType,
    selectedTopic,
    handleTypeSelect,
    handleTopicSelect,
    handleReset,
    filters: { type: selectedType, topic: selectedTopic },
  };
};
