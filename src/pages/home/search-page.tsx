import Container from "@/components/container";
import ComicItem from "@/components/home/comic-item";
import PaginationComponent from "@/components/pagination-component";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { searchComic } from "@/redux/slices/search-slice";
import { Flag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const { data, loading, currentPage, nextPage, prevPage, totalPage } =
    useAppSelector((state) => state.search);

  useEffect(() => {
    dispatch(searchComic({ keyword: keyword, page, limit: 36 }));
  }, [dispatch]);
  return (
    <div className="bg-gray-200 dark:bg-background pb-2">
      <Container>
        <div className="flex gap-2 text-sky-400 text-2xl items-center p-3 pt-5">
          <Flag />
          <p>Tìm kiếm</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 mt-4">
          {loading ? (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </p>
          ) : data && data.length > 0 ? (
            data.map((comic) => (
              <div className="relative">
                <ComicItem key={comic.id} comic={comic} />
              </div>
            ))
          ) : (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              không có truyện tranh
            </p>
          )}
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
export default SearchPage;
