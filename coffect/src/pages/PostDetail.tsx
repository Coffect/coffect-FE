/*
 * author: 강신욱
 * description: 게시글 상세 페이지의 메인 컨테이너 컴포넌트입니다.
                데이터 로직은 usePostDetail 훅에 위임하고,
                UI는 공용 컴포넌트와 상세 페이지 전용 컴포넌트들을 조합하여 구성합니다.
 */
import { usePostDetail } from "../hooks/usePostDetail";
import PostAuthorInfo from "../components/shareComponents/post/PostAuthorInfo";
import PostBody from "../components/shareComponents/post/PostBody";
import PostDetailHeader from "../components/postDetailComponents/PostDetailHeader";
import PostDetailComments from "../components/postDetailComponents/PostDetailComments";
import CommentInput from "../components/communityComponents/comment/CommentInput";

const PostDetail = () => {
  // usePostDetail 훅을 호출하여 페이지에 필요한 모든 데이터를 가져옵니다.
  const { post, postId, commentList, timeAgo } = usePostDetail();

  // 데이터 로딩 중이거나 포스트를 찾을 수 없을 경우 표시할 메시지입니다.
  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        게시글을 찾을 수 없거나 불러오는 중입니다...
      </div>
    );
  }

  return (
    // h-screen을 사용해 전체 화면 높이를 차지하도록 설정합니다.
    <div className="flex h-screen flex-col bg-white">
      {/* 페이지 상단의 헤더 (뒤로가기 버튼 등) */}
      <PostDetailHeader />

      {/* 메인 컨텐츠 영역: flex-1과 overflow-y-auto를 통해 헤더와 댓글 입력창을 제외한 나머지 공간을 차지하고, 내용이 길어지면 스크롤됩니다. */}
      <main className="flex-1 overflow-y-auto pb-[76px]">
        {/* 
          작성자 정보를 표시하는 공용 컴포넌트입니다.
          PostAuthorInfo는 children을 받지 않으므로, 피드 아이템과 달리 팔로우 버튼이 없습니다.
        */}
        <PostAuthorInfo user={post.user} timeAgo={timeAgo} />

        {/* 
          게시글 본문을 표시하는 공용 컴포넌트입니다.
          isDetailView prop을 true로 전달하여 글 내용 전체가 보이도록 합니다.
          onContentClick 핸들러는 전달하지 않아, 본문을 클릭해도 별도 동작이 없습니다.
        */}
        <PostBody post={post} isDetailView={true} />

        {/* 댓글 목록을 표시하는 상세 페이지 전용 컴포넌트입니다. */}
        <PostDetailComments commentList={commentList} />
      </main>

      {/* 
        화면 하단에 고정되는 댓글 입력창입니다.
        max-w-[430px]는 RootLayout과 동일한 너비 제한을 적용하기 위함입니다.
      */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white p-3 pb-4">
        <CommentInput postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;
