/*
author : 강신욱
description : 댓글 관련 타입을 정의하는 파일입니다.
*/

export interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
}
