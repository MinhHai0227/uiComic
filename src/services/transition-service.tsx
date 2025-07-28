import axios from "@/lib/axios";
import {
  MonthlyRevenue,
  RevenueResponse,
  UserPayment,
} from "@/types/transition-type";

const getDoanhThuNowApi = async (): Promise<RevenueResponse> => {
  return await axios.get("transaction/stat/payment");
};

const topUserPaymentApi = async (): Promise<UserPayment[]> => {
  return await axios.get("transaction/stat/top-user");
};

const getListDoanhThuApi = async (limit: number): Promise<MonthlyRevenue[]> => {
  return await axios.get("transaction/stat/revenue/recent", {
    params: {
      limit,
    },
  });
};
export { getDoanhThuNowApi, topUserPaymentApi, getListDoanhThuApi };
