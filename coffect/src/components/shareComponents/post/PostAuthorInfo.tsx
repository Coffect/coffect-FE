/**
 * @author: 흥부/강신욱
 * @description: 게시글의 작성자 정보를 표시하는 공용 컴포넌트입니다.
 *              이 컴포넌트는 피드 아이템과 게시글 상세 페이지 양쪽에서 모두 재사용됩니다.
 */
import React from "react";
import type { Post } from "../../../data/communityDummyData";

/** PostAuthorInfo 컴포넌트가 받을 props 타입을 정의합니다.
 * @interface PostAuthorInfoProps
 * @property {Post["user"]} user - 게시글 작성자의 정보를 담고 있는 user 객체입니다.
 * @property {string} timeAgo - 게시글이 작성된 시간을 "X일 전"과 같은 문자열로 나타냅니다.
 * @property {React.ReactNode} [children] - 이 컴포넌트의 자식 요소들을 렌더링하기 위해 사용됩니다. (예: 팔로우 버튼)
 */
interface PostAuthorInfoProps {
  user: Post["user"];
  timeAgo: string;
  children?: React.ReactNode;
}

const PostAuthorInfo: React.FC<PostAuthorInfoProps> = ({
  user,
  timeAgo,
  children,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        {/* 작성자의 프로필 이미지를 표시합니다. */}
        <img
          src={user.profileImage}
          alt="프로필 사진"
          className="mr-3 h-15 w-auto rounded-full object-cover"
        />
        {/* 작성자의 닉네임, 전공, 학번 및 게시글 작성 시간을 표시합니다. */}
        <div className="flex flex-col">
          <div className="mb-1.5">
            <h3 className="text-[16px] font-semibold text-black">
              {user.nickname}
            </h3>
          </div>
          <div>
            <div className="mb-1.5">
              <p className="text-[12px] text-gray-500">
                {user.major} {user.studentId}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500">{timeAgo}</p>
            </div>
          </div>
        </div>
      </div>
      {/* children으로 전달된 요소(예: 팔로우 버튼)를 오른쪽에 표시합니다. */}
      <div>{children}</div>
    </div>
  );
};

export default PostAuthorInfo;
