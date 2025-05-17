//params
export interface comicParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  active?: string;
}

//comic
export interface Chapter {
  id: number;
  chapter_name: string;
  chapter_title: string;
  slug: string;
  is_locked: boolean;
  price_xu: number;
  auto_unlock_time: string;
  views: number;
  chapter_image_url: string;
  create_at: string;
}

export interface Comic {
  id: number;
  title: string;
  title_eng: string;
  slug: string;
  description: string;
  status: string;
  cover_image: string;
  chapters: Chapter[];
}

export interface ComicResponseType {
  data: Comic[];
  totalItem: number;
  totalPage: number;
  totalItemPerPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}

//create
export interface ComicAction {
  title: string;
  title_eng: string;
  slug: string;
  description: string;
  author: string;
  countryId: number;
  categoryId: number[];
  file: File;
}

//edit
export interface ComicEdit {
  id: number;
  title: string;
  title_eng: string;
  slug: string;
  description: string;
}

//comic by slug
export interface ComicSlugResponeType {
  id: number;
  title: string;
  title_eng: string;
  slug: string;
  description: string;
  author: string;
  status: string;
  cover_image: string;
  views: number;
  categories: CategorySlug[];
  chapters: ChapterSlug[];
}

export interface CategorySlug {
  id: number;
  name: string;
  slug: string;
}

export interface ChapterSlug {
  id: number;
  chapter_name: string;
  chapter_title: string;
  slug: string;
  is_locked: boolean;
  price_xu: number;
  auto_unlock_time: string;
  views: number;
  chapter_image_url: string;
  create_at: string;
}
