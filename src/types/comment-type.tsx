//data trar veef
export interface UserInfo {
  id: number;
  username: string;
  avatar: string | null;
}

export interface Reply {
  id: number;
  userId: number;
  comicId: number | null;
  chapterId: number | null;
  content: string;
  parentId: number | null;
  replyToId: number | null;
  create_at: string;
  user: UserInfo;
  replyTo: {
    user: UserInfo;
  };
}

export interface Comment {
  id: number;
  userId: number;
  comicId: number;
  chapterId: number | null;
  content: string;
  parentId: number | null;
  replyToId: number | null;
  create_at: string;
  user: UserInfo;
  replies: Reply[];
}

export interface CommentResponse {
  data: Comment[];
  totalComment: number;
  totalItem: number;
  totalPage: number;
  totalItemPerPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}

//create comment
export interface addComment {
  comic_id: number | undefined;
  chapter_id: number | undefined;
  parent_id: number | undefined;
  replyToId: number | undefined;
  content: string;
}
