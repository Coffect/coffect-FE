/**
 * @author 강신욱
 * @description 커뮤니티 페이지의 데이터 관리 로직을 담당하는 custom hook입니다.
 *
 * @role : 데이터 관리의 중심. 
            게시글 데이터(posts)
            로딩 상태(loading)
            현재 적용된 필터(activeFilters)를 모두 관리합니다.
 
 * 이 훅의 주요 책임:
 * 1. 게시글 데이터(`posts`) 상태 관리
 * 2. 현재 적용된 필터(`activeFilters`) 상태 관리
 * 3. API를 통해 필터링된 게시글 목록을 가져오는 로직 처리 (현재는 더미 데이터 사용)
 * 4. 데이터 로딩 상태(`loading`) 관리
 *
 * 페이지 컴포넌트로부터 데이터 로직을 분리함으로써,
 * 컴포넌트는 UI 렌더링에만 집중할 수 있게 되어 코드의 유지보수성과 테스트 용이성이 향상.
 */

import { useState, useEffect, useCallback } from "react";
import { type Post, generateDummyPosts } from "../../data/communityDummyData";

// 필터의 형태를 정의하는 인터페이스입니다.
interface Filters {
  type: string | null;
  topic: string | null;
}

export const useCommunityData = () => {
  // 화면에 보여질 게시글 목록을 저장하는 상태입니다.
  const [posts, setPosts] = useState<Post[]>([]);

  // 현재 활성화된 필터 조건을 저장하는 상태입니다.
  // 이 상태가 변경되면 useEffect 훅이 실행되어 새로운 데이터를 가져옵니다.
  const [activeFilters, setActiveFilters] = useState<Filters>({
    type: null,
    topic: null,
  });

  // 데이터 로딩 상태를 나타내는 상태입니다.
  // API 요청 시작 시 true, 완료 시 false로 설정됩니다.
  const [loading, setLoading] = useState(false);

  /**
   * 필터 조건을 인자로 받아, 해당 조건으로 게시글 데이터를 가져오는 함수입니다.
   * 현재는 더미 데이터를 생성하지만, 추후 실제 API 호출 로직으로 대체될 부분입니다.
   * useCallback을 사용하여 이 함수가 불필요하게 재생성되는 것을 방지합니다.
   */
  const fetchPosts = useCallback(async (filters: Filters) => {
    console.log("🚀 API 요청 시작. 현재 필터:", filters);
    setLoading(true);
    try {
      // --- 추후 실제 API 호출로 대체될 부분 ---
      // const response = await fetch(`/api/community/posts?type=${filters.type}&topic=${filters.topic}`);
      // const data = await response.json();
      // setPosts(data.posts);

      // 현재는 더미 데이터를 생성하여 비동기적으로 가져오는 것을 시뮬레이션합니다.
      const dummyPosts = generateDummyPosts(filters);
      // 0.3초의 딜레이를 주어 실제 네트워크 환경과 유사하게 만듭니다.
      await new Promise((resolve) => setTimeout(resolve, 300));
      setPosts(dummyPosts);
      // ------------------------------------

      console.log("✅ 데이터 로딩 완료.");
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류가 발생했습니다.", error);
      // TODO: 사용자에게 보여줄 에러 상태 처리
    } finally {
      setLoading(false);
    }
  }, []);

  // activeFilters 상태가 변경될 때마다 새로운 데이터를 가져옵니다.
  useEffect(() => {
    fetchPosts(activeFilters);
  }, [activeFilters, fetchPosts]);

  /**
   * 새로운 필터 조건을 적용하는 함수입니다.
   * 이 함수가 호출되면 `activeFilters` 상태가 업데이트되고,
   * 결과적으로 `useEffect` 훅이 트리거되어 새로운 데이터를 가져오게 됩니다.
   */
  const applyFilters = (newFilters: Filters) => {
    setActiveFilters(newFilters);
  };

  // 훅은 외부에서 사용할 상태와 함수들을 객체 형태로 반환합니다.
  return {
    posts,
    loading,
    activeFilters,
    applyFilters,
  };
};
