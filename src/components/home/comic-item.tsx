import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Comics } from "@/types/category-type";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

type ListComicItemProps = {
  comic: Comics;
};

const ComicItem = ({ comic }: ListComicItemProps) => {
  return (
    <div className="w-full bg-background shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center relative overflow-hidden rounded-sm">
      <div className="relative w-full">
        <Link to={`/truyen-tranh/${comic.slug}`} className="block">
          <img
            className="w-full h-54 object-cover"
            src={comic.cover_image}
            alt={comic.title}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
      <div className="py-2 px-1 w-full">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link
                to={`/truyen-tranh/${comic.slug}`}
                className="font-semibold hover:text-primary transition-colors duration-200 line-clamp-1"
              >
                {comic.title}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>{comic.title} </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {comic.chapters?.slice(0, 1).map((chapter) => (
          <div key={chapter.id} className="mt-1 text-center">
            <Link
              to={`/truyen-tranh/${chapter.slug}`}
              className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
            >
              <span>Chapter </span>
              {chapter.chapter_name}
            </Link>
            <div className="absolute left-2 top-2 flex gap-1.5 z-8">
              <span className="bg-sky-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                {dayjs(chapter.create_at, "YYYYMMDD").fromNow()}
              </span>
              {chapter.views > 1000 && (
                <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                  Hot
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ComicItem;
