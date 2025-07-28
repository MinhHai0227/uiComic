//category respone
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

//category slug response
export interface Chapters {
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

export interface Comics {
  id: number;
  title: string;
  title_eng: string;
  slug: string;
  status: string;
  cover_image: string;
  chapters: Chapters[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  comics: Comics[];
}

export interface CategorySlugResponseType {
  data: Category;
  totalItem: number;
  totalPage: number;
  totalItemPerPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}

//params
export interface categoryParams {
  page?: number;
  limit?: number;
  status?: string;
  country?: number;
  sort?: number;
}
