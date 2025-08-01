/** 
 * @author 흥부/강신욱
 * @description: 게시글 상세 페이지입니다.
                데이터 로직은 usePostDetail 훅에 위임하고,
                UI는 공용 컴포넌트와 상세 페이지 전용 컴포넌트들을 조합하여 구성합니다.
 */
import { usePostDetail } from "@/hooks/usePostDetail";
import PostAuthorInfo from "@/components/shareComponents/post/PostAuthorInfo";
import PostBody from "@/components/shareComponents/post/PostBody";
import PostDetailHeader from "@/components/postDetailComponents/PostDetailHeader";
import PostDetailComments from "@/components/postDetailComponents/PostDetailComments";
import CommentInput from "@/components/communityComponents/comment/CommentInput";

const PostDetail = () => {
  // usePostDetail 훅을 호출하여 페이지에 필요한 모든 데이터를 가져옵니다.
  // isLoading과 error 의 UI 처리는 이 컴포넌트 내에서 직접 관리합니다.
  const { post, postId, commentList, timeAgo, isLoading, error } =
    usePostDetail();

  // 데이터 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        게시글을 불러오는 중입니다...
      </div>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        게시글을 불러오는 데 실패했습니다: {error.message}
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
            likeCount: post.likes,
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

        <PostDetailComments commentList={commentList} />
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white p-3 pb-4">
        <CommentInput postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
