import axios from "@/lib/axios";
import {
  NotificationPaginationResponse,
  NotificationParams,
} from "@/types/notification-type";

const getNotificationByUserApi = async (
  params: NotificationParams
): Promise<NotificationPaginationResponse> => {
  return await axios.get("notification", {
    params,
  });
};

const deleteNotificationApi = async (id: number) => {
  return await axios.delete(`notification/${id}`);
};

export { getNotificationByUserApi, deleteNotificationApi };
