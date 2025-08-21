export const QUERY_KEYS = {
  COMMUNITY: {
    POSTS: ["community", "posts"],
    // POST_DETAIL: (postId: string) => ["community", "post", postId],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    POST_DETAIL: (threadId: any) => ["community", "postDetail", threadId],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    POSTS_FILTERED: (params: any) => ["community", "posts", "filtered", params],
  },
  USER: {
    // PROFILE: ["user", "profile"],
    PROFILE: () => ["user", "profile"],

    IS_FOLLOWING: (userId: number) => ["user", "isFollowing", userId], //  특정 사용자의 팔로우 상태를 확인하는 쿼리 키
    FOLLOWERS: (userId: number) => ["user", "followers", userId],
    FOLLOWING: (userId: number) => ["user", "following", userId],
    FOLLOW_COUNT: (userId: number) => ["user", "followCount", userId],
    BOOKMARKS: ["user", "bookmarks"], // 사용자의 북마크 목록을 가져오는 쿼리 키
    PROFILE_THREADS: (userId: number) => ["user", "profileThreads", userId], // 특정 사용자가 작성한 게시글 목록을 가져오는 쿼리 키
  },

  COMMENT: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    COMMENTS: (threadId: any) => ["comments", threadId],
  },
};
