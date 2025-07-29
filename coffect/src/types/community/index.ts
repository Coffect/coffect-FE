/**
 * @author: 흥부/강신욱
 * @description: 커뮤니티 기능과 관련된 모든 TypeScript 타입을 중앙에서 관리하고 정의하는 파일입니다.
 *              타입을 한 곳에서 관리함으로써 일관성을 유지하고 재사용성을 높입니다.
 */

/**
 * @interface PostUser
 * @description 게시글 작성자의 정보 구조를 정의합니다.
 */
export interface PostUser {
  profileImage: string; // 작성자의 프로필 이미지 URL
  nickname: string; // 작성자의 닉네임
  major: string; // 작성자의 전공
  studentId: string; // 작성자의 학번
}

/**
 * @interface Post
 * @description 커뮤니티 피드에 표시되는 단일 게시글의 데이터 구조를 정의합니다.
 *              API 응답과 일치시켜 사용하는 것이 이상적입니다.
 */
export interface Post {
  id: number; // 게시글의 고유 식별자
  user: PostUser; // 작성자 정보 객체
  image?: string; // 게시글에 첨부된 이미지 URL (선택 사항)
  title: string; // 게시글 제목
  content: string; // 게시글 본문
  likes: number; // 좋아요 수
  comments: number; // 댓글 수
  type: string; // 게시글 종류 (예: "아티클 ✍🏻", "팀원 모집 👬")
  topic: string; // 게시글 주제 (예: "인사이트", "개발")
  postedDate: Date; // 게시글 작성일
  daysAgo: number; // 작성일로부터 지난 날짜 수
}

/**
 * @interface Filters
 * @description 게시글 목록을 필터링하기 위한 조건을 정의합니다.
 */
export interface Filters {
  type: string | null; // 게시글 종류 필터
  topic: string | null; // 게시글 주제 필터
}
