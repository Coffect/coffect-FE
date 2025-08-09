/**
 * @author 흥부/강신욱
 * @description 특정 게시글의 댓글 목록을 조회하는 react-query 커스텀 훅
 * @version: 1.0.0
 * @date: 2025-08-03
 * @remarks
 * - 1.0.0: 댓글 목록 조회를 위한 useGetComments 훅 구현
 */

import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/api/community/commentApi";
import type { Comment } from "@/types/community/commentTypes";

/**
 * @description 특정 게시글의 댓글 목록을 가져오는 useQuery 커스텀 훅입니다.
 * @param {string} postId - 댓글을 조회할 게시글의 ID.
 * @returns {object} useQuery가 반환하는 상태 객체. 주요 속성:
 * - data (Comment[] | undefined): 성공적으로 불러온 댓글 데이터.
 * - isLoading (boolean): 데이터 로딩 중인지 여부.
 * - isError (boolean): 데이터 로딩 중 에러 발생 여부.
 * - error (Error | null): 발생한 에러 객체.
 */
export const useGetComments = (postId: string) => {
  return useQuery<Comment[], Error>({
    // queryKey: 쿼리를 식별하는 고유한 키입니다.
    // - react-query는 이 키를 기반으로 데이터를 캐싱하고 관리합니다.
    // - 배열 형태로 작성하며, 첫 번째 요소는 쿼리의 "타입"이나 "이름" (여기서는 'comments')을,
    //   두 번째 이후 요소는 쿼리를 고유하게 만드는 변수 (여기서는 postId)를 넣습니다.
    // - 이렇게 하면 'A' 게시글의 댓글과 'B' 게시글의 댓글이 별도의 캐시로 관리됩니다.
    queryKey: ["comments", postId],

    // - queryFn은 Promise를 반환하는 함수여야 합니다.
    // - getComments API가 객체 형태의 인자를 받도록 수정되었으므로,
    //   여기서도 { threadId: postId } 형태로 감싸서 전달합니다.
    queryFn: () => getComments({ threadId: postId }),

    // enabled: 쿼리가 자동으로 실행될지 여부를 결정하는 옵션입니다.
    // - 이 값이 true일 때만 쿼리가 실행됩니다.
    // - postId가 유효한 값일 때(null이나 undefined가 아닐 때)만 API 요청을 보내도록 하여
    //   불필요한 네트워크 요청을 방지할 수 있습니다.
    enabled: !!postId,

    // staleTime: 데이터가 "신선한(fresh)" 상태에서 "오래된(stale)" 상태로 전환되는 데 걸리는 시간 (밀리초 단위).
    // - 기본값은 0입니다.
    // - 데이터가 fresh 상태일 때는 컴포넌트가 마운트되거나 윈도우가 다시 포커스되어도 데이터를 다시 가져오지 않습니다.
    // - 예: staleTime: 5 * 60 * 1000 (5분)으로 설정하면, 5분 내에는 캐시된 데이터를 사용하고 네트워크 요청을 보내지 않습니다.
    //   (댓글은 실시간성이 중요하므로 여기서는 기본값 0을 사용합니다.)

    // cacheTime: 데이터가 비활성 상태일 때 캐시에서 유지되는 시간 (밀리초 단위).
    // - 기본값은 5분입니다.
    // - 특정 쿼리를 사용하는 모든 컴포넌트가 언마운트되면 해당 쿼리는 비활성 상태가 되고,
    //   cacheTime이 지나면 가비지 컬렉터에 의해 캐시에서 제거됩니다.
  });
};
