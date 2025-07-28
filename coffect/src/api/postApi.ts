/**
 * @file postApi.ts
 * @author 흥부/강신욱
 * @description 게시글 작성과 관련된 모든 API 통신 로직을 담당합니다.
 *              백엔드 API 엔드포인트가 변경되거나, 요청/응답 데이터 형식이 변경될 때 이 파일을 수정합니다.
 */

import type { PostData } from "../types/writePostTypes";

/**
 * @function createPost
 * @description
 * 이 함수는 게시글 작성 API를 호출하여 새로운 게시글을 생성합니다.
 * 실제 API 호출 로직을 구현하며, 성공 시 게시글 ID와 성공 메시지를 반환합니다.
 * 실패 시 에러 메시지를 반환합니다.
 * 실제 API 호출 로직 (fetch, axios 등)이 여기에 구현됩니다.
 *
 * @param postData - 생성할 게시글의 데이터 (제목, 내용, 종류, 주제 등)
 * @returns API 호출 성공 시 응답 데이터, 실패 시 에러를 반환합니다.
 */
export const createPost = async (
  postData: PostData,
): Promise<{ success: boolean; message: string; postId: number }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (postData.title && postData.content) {
        console.log("API: 게시글 생성 요청", postData);
        // 실제 API 호출 성공 시의 응답을 시뮬레이션합니다.
        resolve({
          success: true,
          message: "게시글이 성공적으로 작성되었습니다.",
          postId: Date.now(),
        });
      } else {
        // 실제 API 호출 실패 시의 에러를 시뮬레이션합니다.
        reject(new Error("제목과 내용을 입력해주세요."));
      }
    }, 1000); // 1초 지연 시뮬레이션
  });
};
