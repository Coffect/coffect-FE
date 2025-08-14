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
import PostAuthorInfo from "@/components/shareComponents/post/PostAuthorInfo";
import PostBody from "@/components/shareComponents/post/PostBody";
import PostDetailHeader from "@/components/postDetailComponents/PostDetailHeader";
import CommentInput from "@/components/communityComponents/comment/CommentInput";
import { useGetComments } from "@/hooks/community/query/useGetComments";
import PostDetailComments from "@/components/postDetailComponents/PostDetailComments";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";

const PostDetail = () => {
  // 1. 게시글 상세 정보 로딩: usePostDetail 훅을 호출합니다.
  const {
    post,
    postId: postId,
    timeAgo,
    isLoading: isPostLoading,
    error: postError,
  } = usePostDetail();

  console.log("댓글 조회를 위해 전달하는 postId:", postId);

  const {
    comments,
    postId: commentPostId,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useGetComments();
  console.log("댓글 조회를 위해 전달하는 postId:", commentPostId);

  // 데이터 로딩 중일 때 표시할 UI (게시글 또는 댓글 중 하나라도 로딩 중일 때)
  if (isPostLoading || isCommentsLoading) {
    return <LoadingScreen />;
  }

  // 에러 발생 시 표시할 UI (게시글 또는 댓글 에러 중 하나라도 발생했을 때)
  if (postError || commentsError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        게시글을 불러오는 데 실패했습니다:{" "}
        {postError?.message || commentsError?.message}
        {postError?.message}
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
          user={{
            name: post.user.name,
            profileImage: post.user.profileImage,
            dept: post.user.dept,
            studentId: post.user.studentId,
          }}
          timeAgo={timeAgo}
        />
        <PostBody post={post} isDetailView={true} showBookmarkButton={true} />

        {comments && comments.length > 0 ? (
          <PostDetailComments commentList={comments} />
        ) : (
          <div className="py-10 text-center text-[var(--gray-50)]">
            <p>현재 작성된 댓글이 없습니다!</p>
            <p>첫 댓글을 작성해보세요 !</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white p-3 pb-4">
        <CommentInput postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
