/** 
 * @author 흥부/강신욱
 * @description: 게시글 상세 페이지입니다.
                데이터 로직은 각 커스텀 훅에 위임하고,
                UI는 공용 컴포넌트와 상세 페이지 전용 컴포넌트들을 조합하여 구성합니다.
 * @version: 1.1.0
 * @date: 2025-08-02
 * @remarks
 * - 1.1.0: `usePostDetail` 훅과 `useComments` 훅을 분리하여 각각 호출하도록 수정.
 *          데이터 로딩 및 에러 처리를 각 훅의 상태에 맞게 분리하여 관리.
 */

import { usePostDetail } from "@/hooks/community/query/usePostDetail";
import { useComments } from "@/hooks/useComments"; // 댓글 데이터를 가져오는 훅을 직접 import
import PostAuthorInfo from "@/components/shareComponents/post/PostAuthorInfo";
import PostBody from "@/components/shareComponents/post/PostBody";
import PostDetailHeader from "@/components/postDetailComponents/PostDetailHeader";
import PostDetailComments from "@/components/postDetailComponents/PostDetailComments";
import CommentInput from "@/components/communityComponents/comment/CommentInput";

const PostDetail = () => {
  // 1. 게시글 상세 정보 로딩: usePostDetail 훅을 호출합니다.
  // 이제 이 훅은 댓글 정보를 포함하지 않습니다.
  const {
    post,
    postId,
    timeAgo,
    isLoading: isPostLoading, // 로딩 상태 변수 이름을 명확하게 변경 (게시글 로딩)
    error: postError, // 에러 상태 변수 이름을 명확하게 변경 (게시글 에러)
  } = usePostDetail();

  // 2. 댓글 목록 로딩: useComments 훅을 직접 호출합니다.
  // postId가 유효할 때만 훅이 동작하도록 postId를 전달합니다.
  const {
    comments: commentList,
    isLoading: areCommentsLoading, // 로딩 상태 변수 이름을 명확하게 변경 (댓글 로딩)
    error: commentsError, // 에러 상태 변수 이름을 명확하게 변경 (댓글 에러)
  } = useComments(postId);

  // 데이터 로딩 중일 때 표시할 UI (게시글 또는 댓글 중 하나라도 로딩 중일 때)
  if (isPostLoading || areCommentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        게시글을 불러오는 중입니다...
      </div>
    );
  }

  // 에러 발생 시 표시할 UI (게시글 또는 댓글 에러가 발생했을 때)
  if (postError || commentsError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        게시글을 불러오는 데 실패했습니다:{" "}
        {postError?.message || commentsError?.message}
      </div>
    );
  }

  // 게시글 데이터가 없을 경우 (로딩도 아니고 에러도 아닌데 데이터가 없는 경우)
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
            // PostSummary에 없는 필드들은 임시로 기본값 처리
            // topic: "",
            // type: "",
            // commentCount: 0,
            // threadimage: null,
            // major: "",
            // studentId: "",
          }}
          isDetailView={true}
        />

        {/* 댓글 목록 컴포넌트에 commentList를 전달합니다. */}
        <PostDetailComments commentList={commentList} />
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white p-3 pb-4">
        {/* 댓글 입력 컴포넌트에는 postId만 전달하면 됩니다. */}
        <CommentInput postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
