import axios from "@/lib/axios";
import { Coin, CoinAction } from "@/types/coin-type";

const getAllCoinApi = async (): Promise<Coin[]> => {
  return await axios.get("coin");
};

const deleteCoinApi = async (id: number) => {
  return await axios.delete(`coin/${id}`);
};

const createCoinApi = async (data: Omit<CoinAction, "id">) => {
  return await axios.post("coin", data);
};

const editCoinApi = async (id: number, data: Omit<CoinAction, "id">) => {
  return await axios.patch(`coin/${id}`, data);
};

export { getAllCoinApi, deleteCoinApi, createCoinApi, editCoinApi };
