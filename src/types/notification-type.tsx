export interface NotificationItem {
  id: number;
  message: string;
  seen: boolean;
  type: string;
  create_at: string;
  userId: number;
}

export interface NotificationPaginationResponse {
  data: NotificationItem[];
  totalItem: number;
  totalPage: number;
  totalItemPerPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}

export interface NotificationParams {
  page: number;
  limit: number;
  type: string;
}
