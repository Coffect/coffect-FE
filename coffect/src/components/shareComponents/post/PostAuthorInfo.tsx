/*
 * author: 강신욱
 * description: 게시글의 작성자 정보를 표시하는 공용 컴포넌트입니다.
 * 이 컴포넌트는 피드 아이템과 게시글 상세 페이지 양쪽에서 모두 재사용됩니다.
 */
import React from "react";
import type { Post } from "../../../data/communityDummyData";

// PostAuthorInfo 컴포넌트가 받을 props 타입을 정의합니다.
interface PostAuthorInfoProps {
  // user 객체는 게시글 작성자의 정보를 담고 있습니다.
  user: Post["user"];
  // timeAgo는 게시글이 작성된 시간을 "X일 전"과 같은 문자열로 나타냅니다.
  timeAgo: string;
  // children은 이 컴포넌트의 자식 요소들을 렌더링하기 위해 사용됩니다. (예: 팔로우 버튼)
  children?: React.ReactNode;
}

const PostAuthorInfo: React.FC<PostAuthorInfoProps> = ({
  user,
  timeAgo,
  children,
}) => {
  return (
    // 전체 컨테이너: flex를 사용하여 자식 요소들을 정렬합니다.
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        {/* 작성자의 프로필 이미지를 표시합니다. */}
        <img
          src={user.profileImage}
          alt="프로필 사진"
          className="mr-3 h-15 w-auto rounded-full object-cover"
        />
        {/* 작성자의 닉네임, 전공, 학번 및 게시글 작성 시간을 표시합니다. */}
        <div>
          <h3 className="text-sm font-semibold text-black">{user.nickname}</h3>
          <p className="text-sm text-gray-500">
            {user.major} {user.studentId}
          </p>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
      </div>
      {/* children으로 전달된 요소(예: 팔로우 버튼)를 오른쪽에 표시합니다. */}
      <div>{children}</div>
    </div>
  );
};

export default PostAuthorInfo;
