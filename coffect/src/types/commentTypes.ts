/**
 * @author: 강신욱
 * @description: 댓글 관련 타입을 정의하는 파일
 */

export interface Comment {
  id: number;
  user: {
    profileImage: string;
    nickname: string;
    major: string;
    studentId: string;
  };
  content: string;
  postedDate: Date;
}
