import ChapterDetail from "@/pages/home/chapter-detail";
import ComicDetail from "@/pages/home/comic-detail";
import { useParams } from "react-router-dom";

const ComicChapter = () => {
  const { slug } = useParams<{ slug: string }>();
  if (slug) {
    if (slug.includes("-chap-")) {
      return <ChapterDetail />;
    }
    return <ComicDetail />;
  }
};
export default ComicChapter;
