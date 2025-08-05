import Container from "@/components/container";
import ComicItem from "@/components/home/comic-item";
import PaginationComponent from "@/components/pagination-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTopViewComic } from "@/redux/slices/action-slice";
import { getAllComic } from "@/redux/slices/comic-slice";
import { Loader2, Star, Upload } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [topView, setTopView] = useState("day");
  const comics = useAppSelector((state) => state.comic.data);
  const loadingComic = useAppSelector((state) => state.comic.loading);
  const topViews = useAppSelector((state) => state.action.data?.data);
  const loadingTopView = useAppSelector((state) => state.action.loading);
  const [page, setPage] = useState(1);
  const { nextPage, prevPage, totalPage, currentPage } = useAppSelector(
    (state) => state.comic
  );
  // const user = useAppSelector((state) => state.auth.user?.id);
  useEffect(() => {
    dispatch(getAllComic({ page, limit: 36 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTopViewComic({ page: 1, limit: 5, date: topView }));
  }, [dispatch, topView]);

  const handleTabChange = useCallback((value: string) => {
    setTopView(value);
  }, []);

  return (
    <div className="bg-gray-200 dark:bg-background pb-2">
      <Container>
        {/* {user && <NotificationPage userId={user} />} */}

        <div className="flex flex-col-reverse sm:flex-row">
          <div className="w-full">
            <span className="flex text-sky-400 text-lg items-center gap-2 py-3">
              <Upload className="size-6" />
              <p>Mới Cập Nhật </p>
            </span>

            {loadingComic ? (
              <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {comics && comics.length > 0 ? (
                  comics.map((comic) => (
                    <ComicItem key={comic.id} comic={comic} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    Không có truyện tranh
                  </p>
                )}
              </div>
            )}
          </div>

          {/* bảng xếp hạng */}
          <div className="w-full mt-4 sm:m-0 sm:w-[420px] sm:block shadow border sm:ml-3">
            <span className="flex text-sky-400 text-lg items-center gap-2 py-3 ml-0.5">
              <Star className="size-6" />
              <p>Bảng Xếp Hạng</p>
            </span>

            <Tabs defaultValue="day">
              <TabsList className="w-full">
                {["day", "week", "month"].map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    onClick={() => handleTabChange(type)}
                  >
                    {type === "day"
                      ? "Top Ngày"
                      : type === "week"
                      ? "Top Tuần"
                      : "Top Tháng"}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={topView}>
                {loadingTopView ? (
                  <p className="text-center py-4 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                  </p>
                ) : (
                  topViews?.map((comic, index) => (
                    <Link
                      key={index}
                      to={`/truyen-tranh/${comic.slug}`}
                      className="flex items-center px-2.5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <span
                        className={`mr-2.5 font-bold w-7 text-shadow text-2xl ${
                          index === 0
                            ? "text-pink-500"
                            : index === 1
                            ? "text-orange-400"
                            : index === 2
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <div className="size-16 overflow-hidden mr-2.5 rounded-xl">
                        <img
                          className="object-cover w-full h-full"
                          src={comic.cover_image}
                          alt={comic.title}
                        />
                      </div>
                      <div className="relative min-h-[60px] flex-1">
                        <p className="font-medium text-sm line-clamp-2">
                          {comic.title}
                        </p>
                        <p className="absolute right-0 bottom-0 text-sm line-clamp-1">
                          {comic.chapters.map((chapter) => (
                            <span
                              className="hover:text-primary mr-1"
                              key={chapter.id}
                            >
                              Chương {chapter.chapter_name}
                            </span>
                          ))}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="my-2">
          <PaginationComponent
            onPageChange={setPage}
            currentPage={currentPage ?? 1}
            nextPage={nextPage ?? 1}
            prevPage={prevPage ?? 1}
            totalPage={totalPage ?? 1}
          />
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
