import { ChapterImage } from "@/types/chapter-type";

type Chapterimageprops = {
  images: ChapterImage[];
  comicTitle: string;
  chapterName: string;
};

const ChapterImages = ({
  images,
  comicTitle,
  chapterName,
}: Chapterimageprops) => {
  return (
    <div className="my-10 max-w-3xl mx-auto sm:px-3">
      {images.map((image) => (
        <div key={image.id} className="overflow-hidden shadow-sm">
          <img
            className="w-full h-auto object-contain"
            src={image.image_url}
            alt={`${comicTitle} Chap ${chapterName}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default ChapterImages;
