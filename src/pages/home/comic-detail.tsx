import Container from "@/components/container";
import Comments from "@/components/home/comment";
import ListChapter from "@/components/home/list-chapter";
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
import { getComicBySlug } from "@/redux/slices/comic-slice";
import {
  checkUserFollowerComicApi,
  followerComicApi,
  unFollowerComicApi,
} from "@/services/comic-follower-service";
import {
  Book,
  ChartArea,
  Eye,
  Heart,
  List,
  Loader2,
  SendHorizontal,
  ThumbsUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ComicDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userFollower, setUserFollower] = useState(false);
  const comic = useAppSelector((state) => state.comic.comicSlug);
  const chapterSlugOne = comic?.chapters?.[comic.chapters.length - 1];
  const isLogin = useAppSelector((state) => state.auth.user !== null);

  useEffect(() => {
    const checkUserFollowerComic = async () => {
      if (isLogin && comic?.id) {
        const res = await checkUserFollowerComicApi(comic.id);
        setUserFollower(res);
        return res;
      }
    };
    checkUserFollowerComic();
  }, [comic?.id]);

  useEffect(() => {
    if (slug) {
      dispatch(getComicBySlug(slug));
    }
  }, [dispatch, slug]);

  const handleOnFollowerComic = async (id: number) => {
    try {
      setIsLoading(true);
      await followerComicApi(id);
      const res = await checkUserFollowerComicApi(id);
      setUserFollower(res);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnFollowerComic = async (id: number) => {
    try {
      setIsLoading(true);
      await unFollowerComicApi(id);
      const res = await checkUserFollowerComicApi(id);
      setUserFollower(res);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-background overflow-hidden">
      <Container>
        <div className="bg-background dark:bg-slate-600 my-5 p-2 rounded-lg shadow">
          <Breadcrumb className="py-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{comic?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="block lg:flex lg:items-center">
            <div className="w-full lg:w-fit flex">
              <img
                className="mx-auto p-3 ml-2 object-cover h-64 w-fit"
                src={comic?.cover_image}
                alt={comic?.title}
              />
            </div>
            <div className="p-3">
              <h1 className="text-2xl font-semibold leading-6 pb-4">
                {comic?.title}
              </h1>
              <ul className=" text-gray-700 dark:text-white space-y-2 mb-4">
                <li className="flex">
                  <span className="w-35 flex items-center gap-0.5">
                    <User className="size-4" />
                    <p>Tác Giả</p>
                  </span>
                  <p>{comic?.author}</p>
                </li>
                <li className="flex">
                  <span className="w-35 flex items-center gap-0.5">
                    <ChartArea className="size-4" />
                    <p>Tình Trạng</p>
                  </span>
                  <p>
                    {comic?.status === "onGoing"
                      ? "Đang tiến hành"
                      : "Hoàn thành"}
                  </p>
                </li>
                <li className="flex">
                  <span className="w-35 flex items-center gap-0.5">
                    <Eye className="size-4" />
                    <p>Lượt xem</p>
                  </span>
                  <p>{comic?.views}</p>
                </li>
              </ul>
              <ul className="flex flex-wrap gap-3 mb-4">
                {comic &&
                  comic.categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/the-loai/${category.slug}`}
                        className="border border-primary px-3 py-1 text-primary rounded-sm hover:text-white hover:bg-amber-500 duration-300 "
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Link
                  to={`/truyen-tranh/${chapterSlugOne?.slug}`}
                  className="inline-flex items-center gap-1 justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors"
                >
                  <Book className="size-4" />
                  <p>Đọc từ đầu</p>
                </Link>
                {isLogin ? (
                  userFollower ? (
                    <Button
                      disabled={isLoading}
                      onClick={() => handleUnFollowerComic(comic?.id ?? 0)}
                      className="text-white bg-red-600 hover:bg-red-500 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <p>Đang tải ...</p>
                        </>
                      ) : (
                        <>
                          <X className="size-4" />
                          <p>Hủy theo dõi</p>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      disabled={isLoading}
                      onClick={() => handleOnFollowerComic(comic?.id ?? 0)}
                      className="text-white bg-red-600 hover:bg-red-500 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <p>Đang tải ...</p>
                        </>
                      ) : (
                        <>
                          <Heart className="size-4" />
                          <p>Theo dõi</p>
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  "chwa dn"
                )}
                <Button className="text-white  bg-purple-600 hover:bg-purple-500 cursor-pointer">
                  <ThumbsUp className="size-4" />
                  <p>Yêu thích</p>
                </Button>
                <Link
                  to=""
                  className="inline-flex items-center gap-1 justify-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-500"
                >
                  <SendHorizontal className="size-4" />
                  <p>Đọc tiếp</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <span className="flex text-primary text-lg items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Giới thiệu</p>
            </span>
            <p>{comic?.description}</p>
          </div>
          <div className="p-3 space-y-2 mb-3">
            <div className="flex text-primary text-lg items-center gap-1">
              <List className="size-6" />
              <p>Danh sách chương</p>
            </div>
            {comic?.chapters && (
              <ListChapter chapters={comic?.chapters} comicId={comic.id} />
            )}
            {comic?.id && (
              <Comments
                key={`comic-${comic.id}`}
                comicId={comic.id}
                chapterId={undefined}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
export default ComicDetail;
