export interface RevenueResponse {
  doanh_thu_theo_ngay: number;
  doanh_thu_theo_thang: number;
}

//user payment
export interface UserPayment {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  total_paid: number;
}



//danh sach danh thu các tháng
export interface MonthlyRevenue {
  month: number;
  year: number;
  total: number;
}


