//create and edit chapter
export interface ChapterAction {
  id: number;
  comic_id: number;
  chapter_name: string;
  chapter_title: string;
  price_xu: number;
  auto_unlock_time: Date;
}

//Chapter by slug
export interface ChapterSlugResponseType {
  id: number;
  chapter_name: string;
  chapter_title: string;
  slug: string;
  is_locked: boolean;
  price_xu: number;
  auto_unlock_time: string;
  create_at: string;
  views: number;
  chapter_image_url: string;
  chapterImages: ChapterImage[];
  comic: ComicRes;
}

export interface ComicRes {
  id: number;
  title: string;
  slug: string;
}

export interface ChapterImage {
  id: number;
  image_url: string;
  chapterId: number;
}

//chapterImage
export interface AddAllImages {
  chapter_id: number;
  image: File[];
}
