// Kiểu cho Comic
export interface Comic {
  id: number;
  title: string;
  title_eng: string;
  slug: string;
  status: string;
  cover_image: string;
}

// Kiểu cho Chapter
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

// Kiểu cho từng item trong mảng data
export interface HistoryItem {
  id: number;
  userId: number;
  comicId: number;
  chapterId: number;
  read_time: string;
  comic: Comic;
  chapter: Chapter;
}

// Kiểu cho toàn bộ response
export interface ReadingHistoryResponse {
  data: HistoryItem[];
  totalItem: number;
  totalPage: number;
  totalItemPerPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}
