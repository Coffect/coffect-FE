/** 
 * @author 흥부/강신욱
 * @description: 게시글 상세 페이지입니다.
                데이터 로직은 각 커스텀 훅에 위임하고,
                UI는 공용 컴포넌트와 상세 페이지 전용 컴포넌트들을 조합하여 구성합니다.
 * @version: 1.3.0
 * @date: 2025-08-03
 * @remarks
 * - 1.1.0: `usePostDetail` 훅과 `useComments` 훅을 분리하여 각각 호출하도록 수정.
 * - 1.2.0: `usePostDetail` 훅에 `select` 옵션이 적용됨에 따라, 
 *          훅의 반환 값(post, timeAgo)을 사용하는 부분을 최종 확인하고 주석을 보강.
 * - 1.3.0: 댓글 조회를 위해 기존 `useComments` 훅을 `useGetComments` react-query 훅으로 교체.
 */

import { usePostDetail } from "@/hooks/community/query/usePostDetail";
import { useGetComments } from "@/hooks/community/query/useGetComments"; // 경로 수정
import PostAuthorInfo from "@/components/shareComponents/post/PostAuthorInfo";
import PostBody from "@/components/shareComponents/post/PostBody";
import PostDetailHeader from "@/components/postDetailComponents/PostDetailHeader";
import PostDetailComments from "@/components/postDetailComponents/PostDetailComments";
import CommentInput from "@/components/communityComponents/comment/CommentInput";

const PostDetail = () => {
  // 1. 게시글 상세 정보 로딩: usePostDetail 훅을 호출합니다.
  const {
    post,
    postId,
    timeAgo,
    isLoading: isPostLoading,
    error: postError,
  } = usePostDetail();

  // 2. 댓글 목록 로딩: useGetComments 훅을 호출합니다.
  //    게시글 데이터와 댓글 데이터는 독립적으로 로딩 및 에러 처리가 됩니다.
  const {
    data: commentList = [], // 데이터가 없을 경우 기본값으로 빈 배열 사용
    isLoading: areCommentsLoading,
    error: commentsError,
  } = useGetComments(postId || ""); // postId가 없을 경우 빈 문자열을 전달하여 쿼리가 실행되지 않도록 함

  // 데이터 로딩 중일 때 표시할 UI (게시글 또는 댓글 중 하나라도 로딩 중일 때)
  if (isPostLoading || areCommentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        게시글을 불러오는 중입니다...
      </div>
    );
  }

  // 에러 발생 시 표시할 UI (게시글 또는 댓글 에러 중 하나라도 발생했을 때)
  if (postError || commentsError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        게시글을 불러오는 데 실패했습니다:{" "}
        {postError?.message || commentsError?.message}
      </div>
    );
  }

  // 게시글 데이터가 없을 경우 (로딩과 에러가 모두 끝났는데 데이터가 없는 경우)
  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        현재 해당 게시글을 찾을 수 없습니다. 다시 시도해주세요 !
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <PostDetailHeader />

      <main className="flex-1 overflow-y-auto pb-19">
        <PostAuthorInfo
          user={{ name: post.user.name, profileImage: post.user.profileImage }}
          timeAgo={timeAgo}
        />
        <PostBody
          post={{
            threadId: post.threadId,
            userId: post.user.userId,
            threadTitle: post.threadTitle,
            threadBody: post.threadBody,
            createdAt: post.createdAt,
            threadShare: post.threadShare,
            name: post.user.name,
            profileImage: post.user.profileImage,
            likeCount: post.like,
          }}
          isDetailView={true}
        />

        <PostDetailComments commentList={commentList} />
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white p-3 pb-4">
        <CommentInput postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
