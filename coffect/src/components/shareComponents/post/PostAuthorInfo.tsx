/**
 * @author 흥부/강신욱
 * @description 게시글 작성자 정보를 표시하는 컴포넌트입니다.
 * @version 1.1.0 (API 변경에 따른 업데이트)
 * @role : 게시글 작성자의 이름, 프로필 사진, 전공 및 학번(선택적)을 표시합니다.
 */
import React from "react";

// user prop의 타입을 더 유연하게 정의합니다.
interface UserInfo {
  name: string;
  profileImage: string;
  dept: string;
  studentId: number;
}

interface PostAuthorInfoProps {
  user: UserInfo;
  timeAgo: string;
  children?: React.ReactNode;
  onAuthorClick?: () => void;
}

const PostAuthorInfo: React.FC<PostAuthorInfoProps> = ({
  user,
  timeAgo,
  children,
  onAuthorClick = () => {},
}: PostAuthorInfoProps) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-2"
      onClick={onAuthorClick}
    >
      <div className="flex items-center">
        <img
          src={user.profileImage}
          alt="프로필 사진"
          className="mr-2 h-15 w-15 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <div className="mb-1">
            {/* user.nickname 대신 user.name을 사용합니다. */}
            <h3 className="text-[16px] font-semibold text-black">
              {user.name}
            </h3>
          </div>
          <div>
            <div className="mb-1">
              <p className="text-[12px] text-gray-500">
                {user.dept} {String(user.studentId).substring(2, 4)}학번
              </p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500">{timeAgo}</p>
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PostAuthorInfo;
