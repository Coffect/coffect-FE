/* author : 강신욱
description : 커뮤니티 헤더의 필터 및 정렬 버튼 상태를 관리하는 커스텀 훅입니다.
*/

import { useState, useCallback } from 'react';

export const useCommunityHeaderFilters = () => {
  // 현재 활성화된 필터/정렬 버튼의 상태 (null, 'filter', 'latest', 'popular')
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // 필터 버튼 클릭 핸들러
  const handleFilterClick = useCallback(() => {
    setActiveFilter(prev => (prev === 'filter' ? null : 'filter'));
    // TODO: 필터 모달 관련 API 호출 로직 추가 예정
  }, []);

  // 최신순 버튼 클릭 핸들러
  const handleLatestClick = useCallback(() => {
    setActiveFilter(prev => (prev === 'latest' ? null : 'latest')); // 토글 로직 추가
    // TODO: 최신순 API 호출 로직 추가 예정
  }, []);

  // 인기순 버튼 클릭 핸들러
  const handlePopularClick = useCallback(() => {
    setActiveFilter(prev => (prev === 'popular' ? null : 'popular')); // 토글 로직 추가
    // TODO: 인기순 API 호출 로직 추가 예정
  }, []);

  return {
    activeFilter,
    handleFilterClick,
    handleLatestClick,
    handlePopularClick,
  };
};