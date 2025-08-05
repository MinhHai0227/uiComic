import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAllCommentByComicId,
  getAllCommentByChapterId,
} from "@/redux/slices/comment-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircleMoreIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CommentForm from "@/components/home/comment-form";
import { deleteCommentApi } from "@/services/comment-service";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/pagination-component";

interface CommentsProps {
  comicId: number | undefined;
  chapterId?: number | undefined;
}

const Comments = ({ comicId, chapterId }: CommentsProps) => {
  const dispatch = useAppDispatch();
  const {
    data,
    totalComment,
    loading,
    currentPage,
    nextPage,
    prevPage,
    totalPage,
  } = useAppSelector((state) => state.comment);
  const [page, setPage] = useState(1);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openReplies, setOpenReplies] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const isLogin = useAppSelector((state) => state.auth.user !== null);
  useEffect(() => {
    const commentId = searchParams.get("commentId");
    if (!commentId || loading || data.length === 0) return;

    const id = Number(commentId);

    // Kiểm tra xem commentId là reply của ai → mở replies nếu cần
    const parentComment = data.find((comment) =>
      comment.replies.some((reply) => reply.id === id)
    );

    if (parentComment && !openReplies.includes(parentComment.id)) {
      setOpenReplies((prev) => [...prev, parentComment.id]);
    }

    const timeout = setTimeout(() => {
      const el = document.getElementById(`comment-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add(
          "ring-2",
          "ring-blue-500",
          "transition",
          "duration-300"
        );
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-blue-500");
        }, 3000);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchParams, data, loading, openReplies]);

  useEffect(() => {
    if (!comicId && !chapterId) return;

    const fetchComments = () => {
      if (chapterId) {
        dispatch(
          getAllCommentByChapterId({
            id: chapterId,
            params: { page, limit: 20 },
          })
        );
      } else if (comicId) {
        dispatch(
          getAllCommentByComicId({ id: comicId, params: { page, limit: 20 } })
        );
      }
    };

    fetchComments();
  }, [comicId, chapterId, dispatch, page]);

  const postCommentSuccess = () => {
    if (chapterId) {
      dispatch(
        getAllCommentByChapterId({
          id: chapterId,
          params: { page, limit: 20 },
        })
      );
    } else if (comicId) {
      dispatch(
        getAllCommentByComicId({ id: comicId, params: { page, limit: 20 } })
      );
    }
    setReplyingTo(null);
  };

  const handleReply = (commentId: number) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const handleDelete = async (commentId: number) => {
    try {
      setIsLoading(true);
      await deleteCommentApi(commentId);
      if (chapterId) {
        dispatch(
          getAllCommentByChapterId({
            id: chapterId,
            params: { page, limit: 20 },
          })
        );
      } else if (comicId) {
        dispatch(
          getAllCommentByComicId({ id: comicId, params: { page, limit: 20 } })
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReplies = (commentId: number) => {
    setOpenReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  return (
    <div className="py-6 px-4 sm:px-6 bg-gradient-to-b from-background to-gray-50 rounded-2xl shadow-lg">
      {/* Tiêu đề bình luận */}
      <div className="flex items-center gap-3 mb-4">
        <MessageCircleMoreIcon className="size-7 text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Bình luận
          <span className="ml-2 text-base bg-primary/10 text-primary px-2 py-1 rounded-full">
            {totalComment}
          </span>
        </h2>
      </div>

      {/* Thông báo khuyến khích */}
      <p className="text-sm text-muted-foreground mb-6">
        Vào{" "}
        <a href="#" className="font-medium text-primary hover:underline">
          Fanpage
        </a>{" "}
        like và theo dõi để ủng hộ TruyenDocViet nhé.
      </p>

      {/* Form bình luận */}
      {isLogin && (
        <CommentForm
          comicId={comicId}
          chapterId={chapterId}
          onSubmitSuccess={postCommentSuccess}
        />
      )}

      {/* Trạng thái tải hoặc không có bình luận */}
      {loading ? (
        <p className="text-sm text-muted-foreground italic text-center">
          Đang tải bình luận...
        </p>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((comment) => (
            <div
              id={`comment-${comment.id}`}
              key={comment.id}
              className="bg-card p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.user.avatar ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {comment.user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">
                      {comment.user.username}
                    </p>
                    <div className="text-sm flex gap-4 text-muted-foreground">
                      {comment.userId === currentUser?.id && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={isLoading}
                          className="hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      )}
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        {replyingTo === comment.id ? "Hủy" : "Trả lời"}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {comment.content}
                  </p>

                  {/* Form trả lời */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 animate-in fade-in duration-300">
                      {isLogin && (
                        <CommentForm
                          comicId={comicId}
                          chapterId={chapterId}
                          parentId={comment.id}
                          replyToId={comment.id}
                          onSubmitSuccess={postCommentSuccess}
                        />
                      )}
                    </div>
                  )}

                  {/* Danh sách bình luận con */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {!openReplies.includes(comment.id) ? (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Hiện tất cả {comment.replies.length} trả lời
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Ẩn trả lời
                          </button>

                          {comment.replies.map((reply) => (
                            <div
                              id={`comment-${reply.id}`}
                              key={reply.id}
                              className="flex items-start gap-3"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={reply.user.avatar ?? ""} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {reply.user.username[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-foreground">
                                    {reply.user.username}
                                  </p>

                                  <div className="text-xs flex gap-3 text-muted-foreground">
                                    {reply.user.id === currentUser?.id && (
                                      <button
                                        onClick={() => handleDelete(reply.id)}
                                        disabled={isLoading}
                                        className="hover:text-red-500 transition-colors disabled:opacity-50"
                                      >
                                        Xóa
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleReply(reply.id)}
                                      className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                                    >
                                      {replyingTo === reply.id
                                        ? "Hủy"
                                        : "Trả lời"}
                                    </button>
                                  </div>
                                </div>

                                <p className="text-sm text-foreground mt-1 leading-relaxed">
                                  <span className="font-semibold text-blue-500 mr-1">
                                    @
                                    {reply.replyTo?.user?.username ??
                                      comment.user.username}
                                  </span>
                                  {reply.content}
                                </p>

                                {replyingTo === reply.id && (
                                  <div className="mt-3 animate-in fade-in duration-300">
                                    {isLogin && (
                                      <CommentForm
                                        comicId={comicId}
                                        chapterId={chapterId}
                                        parentId={comment.id}
                                        replyToId={reply.id}
                                        onSubmitSuccess={postCommentSuccess}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="my-2">
        <PaginationComponent
          onPageChange={setPage}
          currentPage={currentPage ?? 1}
          nextPage={nextPage ?? 1}
          prevPage={prevPage ?? 1}
          totalPage={totalPage ?? 1}
        />
      </div>
    </div>
  );
};

export default Comments;
