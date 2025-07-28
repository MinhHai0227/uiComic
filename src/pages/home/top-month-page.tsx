import Container from "@/components/container";
import ComicItem from "@/components/home/comic-item";
import PaginationComponent from "@/components/pagination-component";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTopViewComic } from "@/redux/slices/action-slice";
import { getAllCountry } from "@/redux/slices/country-slice";
import { Flag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const TopMonthPage = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [country, setCountry] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const countries = useAppSelector((state) => state.country.data);
  const { data, loading } = useAppSelector((state) => state.action);
  const { nextPage, prevPage, currentPage, totalPage } = data ?? {};
  const comics = data?.data;

  useEffect(() => {
    dispatch(getAllCountry());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getTopViewComic({ page, limit: 36, date: "month", country, status })
    );
  }, [dispatch, page, country, status]);
  return (
    <div className="bg-gray-200 dark:bg-background pb-2">
      <Container>
        <div className="flex gap-2 text-sky-400 text-2xl items-center p-3 pt-5">
          <Flag />
          <p>Top Tháng</p>
        </div>
        <div className="p-3 mt-5 bg-white shadow-sm rounded-sm dark:bg-slate-600">
          <ul>
            <li className="flex items-center p-1">
              <span className="text-sm text-gray-400 w-22">Tình trạng</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setStatus("onGoing")}
                  className={`p-1 px-3 border rounded-md cursor-pointer transition-all duration-200 ${
                    status === "onGoing"
                      ? "bg-primary text-white border-primary dark:bg-primary dark:border-primary"
                      : "border-gray-300 hover:bg-gray-100 hover:border-gray-500 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-400"
                  }
                  `}
                >
                  Đang tiến hành
                </button>

                <button
                  onClick={() => setStatus("complete")}
                  className={` p-1 px-3 border rounded-md cursor-pointer transition-all duration-200
                            ${
                              status === "complete"
                                ? "bg-primary text-white border-primary dark:bg-primary dark:border-primary"
                                : "border-gray-300 hover:bg-gray-100 hover:border-gray-500 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-400"
                            }
                         `}
                >
                  Hoàn thành
                </button>
              </div>
            </li>
            <li className="flex items-center p-1">
              <span className="text-sm text-gray-400 w-22">Quốc gia</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {countries &&
                  countries.map((c) => {
                    const isActive = country === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCountry(c.id)}
                        className={` p-1 px-3 border rounded-md cursor-pointer transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary text-white border-primary dark:bg-primary dark:border-primary"
                            : "border-gray-300 hover:bg-gray-100 hover:border-gray-500 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-400"
                        }
                            `}
                      >
                        {c.name}
                      </button>
                    );
                  })}
              </div>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 mt-4">
          {loading ? (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </p>
          ) : comics && comics.length > 0 ? (
            comics.map((comic) => <ComicItem key={comic.id} comic={comic} />)
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
export default TopMonthPage;
