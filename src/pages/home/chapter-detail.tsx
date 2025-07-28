import Container from "@/components/container";
import ChapterImages from "@/components/home/chapter-image";
import Comments from "@/components/home/comment";
import LoginRequiredChapter from "@/components/home/login-required-chapter";
import UnlockRequiredChapter from "@/components/home/unlock-required-chapter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  checkUserUnlockChapter,
  getChapterBySlug,
} from "@/redux/slices/chapter-slice";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const chapter = useAppSelector((state) => state.chapter.data);
  const isLogin = useAppSelector((state) => state.auth.user !== null);
  const userUnlock = useAppSelector((state) => state.chapter.userUnlock);
  const user = useAppSelector((state) => state.user.userProfile);

  useEffect(() => {
    if (isLogin && chapter?.id) {
      dispatch(checkUserUnlockChapter(chapter.id));
    }
  }, [dispatch, chapter?.id, isLogin]);

  useEffect(() => {
    if (slug) {
      dispatch(getChapterBySlug(slug));
    }
  }, [dispatch, slug, chapter?.price_xu]);
  return (
    <div className="bg-[#333333] overflow-hidden">
      <Container>
        <div className="px-5 py-2 bg-background dark:bg-slate-600 my-5  rounded-lg shadow">
          <Breadcrumb className="py-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/truyen-tranh/${chapter?.comic.slug}`}>
                    {chapter?.comic.title}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chương {chapter?.chapter_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-xl font-semibold  ">
            {chapter?.comic.title} - Chapter {chapter?.chapter_name}
            <span className="ml-2 text-sm font-normal">
              (Cập nhật lúc:{" "}
              {dayjs(chapter?.create_at).format("HH:mm D/M/YYYY")})
            </span>
          </h1>
          <div className="text-center px-3 py-4">
            <span className="text-gray-600 dark:text-accent-foreground">
              Nếu không xem được truyện vui lòng "BÁO LỖI" bên dưới
            </span>
            <Button className="flex items-center m-2 cursor-pointer mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Báo Lỗi Chương</span>
            </Button>
            <div className="bg-sky-100 p-2 mt-3 text-sky-400 text-sm italic">
              <span>Sử dụng mũi tên trái hoặc phải để di chuyển chapter</span>
            </div>
            <div className="flex items-center justify-center text-white gap-2 pt-3">
              <Link
                to=""
                className="flex items-center gap-1 bg-sky-400 px-2 py-1.5 rounded-sm hover:bg-sky-500 hover:text-primary w-35 justify-center duration-200"
              >
                <ArrowLeft className="size-4" />
                <span>Chương trước</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-1 bg-sky-400 px-2 py-1.5 rounded-sm hover:bg-sky-500 hover:text-primary w-35 justify-center duration-200"
              >
                <span>Chương sau</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
      {/* content */}
      {chapter?.is_locked ? (
        isLogin ? (
          userUnlock ? (
            <ChapterImages
              images={chapter.chapterImages}
              comicTitle={chapter.comic.title}
              chapterName={chapter.chapter_name}
            />
          ) : (
            <UnlockRequiredChapter
              autoUnlock={chapter.auto_unlock_time}
              priceCoin={chapter.price_xu}
              priceUser={user?.total_coin ?? 0}
              chapterId={chapter.id}
            />
          )
        ) : (
          <LoginRequiredChapter autoUnlock={chapter?.auto_unlock_time ?? ""} />
        )
      ) : (
        <ChapterImages
          images={chapter?.chapterImages ?? []}
          comicTitle={chapter?.comic.title ?? ""}
          chapterName={chapter?.chapter_name ?? ""}
        />
      )}

      {/* comment */}
      <div className="bg-white">
        <Container>
          {chapter?.id && (
            <Comments
              key={`chapter-${chapter.id}`}
              comicId={undefined}
              chapterId={chapter.id}
            />
          )}
        </Container>
      </div>
    </div>
  );
};
export default ChapterDetail;
