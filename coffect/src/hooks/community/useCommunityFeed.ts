/**
 * @author: 흥부/강신욱
 * @description: 커뮤니티 피드 데이터를 가져오고 관리하는 Custom Hook입니다.
 *              데이터 fetching, 로딩 상태, 에러 상태를 모두 캡슐화하여
 *              컴포넌트에서는 이 Hook을 호출하기만 하면 되도록 관심사를 분리합니다.
 */

import { useState, useEffect } from "react";
import type { Post, Filters } from "../../types/community";
import { generateDummyPosts } from "../../data/communityDummyData";

/**
 * @interface UseCommunityFeedResult
 * @description useCommunityFeed 훅이 반환하는 값의 구조를 정의합니다.
 * @property {Post[]} posts - 불러온 게시글 목록
 * @property {boolean} isLoading - 데이터 로딩 중 여부
 * @property {Error | null} error - 에러 객체 (에러 발생 시)
 */
interface UseCommunityFeedResult {
  posts: Post[]; // 불러온 게시글 목록
  isLoading: boolean; // 데이터 로딩 중 여부
  error: Error | null; // 에러 객체 (에러 발생 시)
}

/**
 * @function useCommunityFeed
 * @param {Filters} filters - 게시글을 필터링할 조건 객체
 * @returns {UseCommunityFeedResult} - 게시글 목록, 로딩 상태, 에러 상태를 포함하는 객체
 * @description
 * 이 훅은 커뮤니티 피드 데이터를 가져오는 비동기 로직을 처리합니다.
 * 현재는 더미 데이터를 사용하지만, 추후 실제 API로 교체할 때 이 파일만 수정하면 됩니다.
 */
const useCommunityFeed = (filters: Filters): UseCommunityFeedResult => {
  // 게시글 데이터를 저장하는 상태
  const [posts, setPosts] = useState<Post[]>([]);
  // 로딩 상태를 저장하는 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 에러 정보를 저장하는 상태
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 컴포넌트가 마운트되면 데이터 fetching을 시작합니다.
    const fetchPosts = () => {
      try {
        // 로딩 시작
        setIsLoading(true);
        setError(null);

        // --- 추후 실제 API 호출로 대체될 부분 ---
        // 현재는 필터에 맞는 더미 데이터를 동기적으로 생성합니다.
        const dummyPosts = generateDummyPosts(filters);
        // -------------------------------------

        // 성공적으로 데이터를 가져오면 상태를 업데이트합니다.
        setPosts(dummyPosts);
      } catch (e) {
        // 에러 발생 시 에러 상태를 업데이트합니다.
        setError(e as Error);
      } finally {
        // 로딩 종료
        setIsLoading(false);
      }
    };

    fetchPosts();

    // `filters` 객체가 변경될 때마다 데이터를 다시 불러옵니다.
    // JSON.stringify를 사용하여 객체의 내용이 실제로 변경되었는지 확인합니다.
  }, [JSON.stringify(filters)]);

  // 컴포넌트에서 사용할 상태들을 반환합니다.
  return { posts, isLoading, error };
};

export default useCommunityFeed;
