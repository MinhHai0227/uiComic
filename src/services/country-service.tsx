import axios from "@/lib/axios";
import { Country, CountryAction } from "@/types/country-type";

const getAllCountryApi = async (): Promise<Country[]> => {
  return await axios.get("country");
};

const deleteCountryApi = async (id: number) => {
  return await axios.delete(`country/${id}`);
};

const createCountryApi = async (data: Omit<CountryAction, "id">) => {
  return await axios.post("country", data);
};

const editCountryApi = async (id: number, data: Omit<CountryAction, "id">) => {
  return await axios.patch(`country/${id}`, data);
};

export { getAllCountryApi, deleteCountryApi, createCountryApi, editCountryApi };
