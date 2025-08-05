import Container from "@/components/container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getCategoryBySlug,
} from "@/redux/slices/category-slice";
import { getAllCountry } from "@/redux/slices/country-slice";
import dayjs from "dayjs";
import { Flag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import PaginationComponent from "@/components/pagination-component";
import ComicItem from "@/components/home/comic-item";
dayjs.extend(relativeTime);
dayjs.locale("vi");

const GenrePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [country, setCountry] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState(1);
  const navigate = useNavigate();
  const { loading, categorySlug, data } = useAppSelector(
    (state) => state.category
  );

  const countries = useAppSelector((state) => state.country.data);
  const category = categorySlug?.data;
  const { nextPage, prevPage, currentPage, totalPage } = categorySlug ?? {};
  useEffect(() => {
    if (slug) {
      dispatch(
        getCategoryBySlug({
          slug,
          params: { page, limit: 36, country, status, sort },
        })
      );
    }
  }, [dispatch, slug, page, country, status, sort]);

  useEffect(() => {
    dispatch(getAllCountry());
  }, [dispatch]);

  const handleOnGetCategory = (slug: string) => {
    navigate(`/the-loai/${slug}`);
  };

  return (
    <div className="bg-gray-200 dark:bg-background pb-2">
      <Container>
        <div className="pt-5">
          <div className="flex gap-2 text-sky-400 text-2xl items-center p-3 ">
            <Flag />
            <p>Truyện {category && category.name} </p>
          </div>
          <p className="p-4 bg-white shadow-xs text-sm rounded-sm dark:bg-slate-600">
            {category && category.description}
          </p>
        </div>
        <div className="p-3 mt-5 bg-white shadow-sm rounded-sm dark:bg-slate-600">
          <ul>
            <li className="flex items-center p-1">
              <span className="text-sm text-gray-400 w-22">Thể loại</span>
              <Select
                onValueChange={(value) => {
                  const selected = data.find((cat) => String(cat.id) === value);
                  if (selected) {
                    handleOnGetCategory(selected.slug);
                  }
                }}
              >
                <SelectTrigger className="p-1 w-30 border border-gray-300 rounded-md max-h-36 overflow-y-auto">
                  <SelectValue placeholder={category?.name} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data &&
                      data.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </li>
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
            <li className="flex items-center p-1">
              <span className="text-sm text-gray-400 w-22">Sắp xếp</span>
              <Select
                onValueChange={(value) => {
                  setSort(Number(value));
                }}
              >
                <SelectTrigger className="p-1 w-50 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Ngày đăng tăng dần" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Ngày đăng tăng dần</SelectItem>
                    <SelectItem value="2">Ngày đăng giảm dần</SelectItem>
                    <SelectItem value="3">Lượt xem tăng dần</SelectItem>
                    <SelectItem value="4">Lượt xem giảm dần</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </li>
          </ul>
        </div>

        {/* list comic */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 mt-4">
          {loading ? (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </p>
          ) : category?.comics && category.comics.length > 0 ? (
            category.comics.map((comic) => (
              <ComicItem key={comic.id} comic={comic} />
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
export default GenrePage;
