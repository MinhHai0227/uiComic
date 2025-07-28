//params
export interface userParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

//user respone
export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
  total_coin: number;
}

export interface userResponseType {
  data: User[];
  totalItem: number;
  totalPage: number;
  totalItemPerPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}

//create
export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: string;
}

//edit
export interface UserEdit {
  id: number;
  username: string;
  email: string;
  total_coin: number;
  role: string;
}


