/*
author : 강신욱
description : 게시글 상세 페이지 컴포넌트입니다.
              게시글의 제목, 작성자 정보, 내용, 이미지, 주제 및 종류 정보를 표시하며,
              댓글 입력 및 목록을 포함합니다.
*/

import { useParams, useNavigate } from "react-router-dom";
import { generateDummyPosts } from "../data/communityDummyData";
import FeedInteraction from "../components/communityComponents/feed/FeedInteraction";
import CommentList from "../components/communityComponents/comment/CommentList";
import { useComments } from "../hooks/useComments";
import { ChevronLeft } from "lucide-react";
import CommentInput from "../components/communityComponents/comment/CommentInput";

// 날짜를 'X일 전' 형식으로 변환하는 함수
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const allPosts = generateDummyPosts({ type: null, topic: null });
  const post = allPosts.find((p) => p.id === postId);

  const { comments: commentList } = useComments();

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 뒤로 가기 버튼 및 헤더 */}
      <header className="flex items-center border-b border-gray-200 p-4">
        <button onClick={handleGoBack} className="mr-4">
          <ChevronLeft className="h-6 w-6" />
        </button>
      </header>
      {/* Main content area - now a flex column */}
      <main className="flex-1 overflow-y-auto pb-[76px]">
        {/* Main post details section */}
        <div className="post-details-section flex flex-col gap-2 p-4">
          <div className="flex items-center">
            <img
              src={post.user.profileImage}
              alt="프로필 사진"
              className="mr-4 h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold text-black">
                {post.user.nickname}
              </h3>
              <p className="text-sm text-gray-500">
                {post.user.major} {post.user.studentId}
              </p>
              <p className="text-sm text-gray-500">
                {getTimeAgo(post.postedDate)}
              </p>
            </div>
          </div>
          <p className="mx-2 leading-normal whitespace-pre-wrap">
            {post.content}
          </p>
          {/* 주제 및 종류 정보 */}
          <div className="mx-auto flex w-[91.79%] gap-2 rounded-lg">
            <span className="inline-flex h-[33px] w-[20%] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-700">
              {post.type}
            </span>
            <span className="inline-flex h-[33px] w-[20%] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-700">
              {post.topic}
            </span>
          </div>
          {post.image && (
            <img
              src={post.image}
              alt="게시글 이미지"
              className="mx-auto h-[240px] w-[92.31%] rounded-lg object-cover"
            />
          )}
          <FeedInteraction likes={post.likes} comments={post.comments} />
        </div>
        {/* h-[0.7%] : 그러나 이 부분 현재 핸드폰으로 안 보이는 문제가 있음. */}
        <div className="h-px bg-gray-500"> </div>

        {/* Comments section - now scrollable */}
        <div className="comments-section p-4">
          <CommentList commentList={commentList} />
        </div>
      </main>

      {/* 댓글 입력창 */}
      <div className="fixed bottom-0 left-1/2 h-[8.99%] w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white p-2">
        <CommentInput postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
