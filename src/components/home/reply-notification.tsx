import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  connectWebSocket,
  disconnectWebSocket,
  emitEvent,
  listenForEvent,
  offListenForEvent,
} from "@/lib/socket";
import { Reprytype } from "@/types/reply-type";

import { Bell, Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ReplyNotificationProps {
  userId: number;
}

const ReplyNotification = ({ userId }: ReplyNotificationProps) => {
  const [notifications, setNotifications] = useState<Reprytype[]>([]);
  const [totalUnseen, setTotalUnseen] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const getAllNotification = useCallback(() => {
    setLoading(true);
    setError(null);
    emitEvent("getNotifications", { userId: userId });
  }, [userId]);

  useEffect(() => {
    connectWebSocket(userId);
    const handleNotifications = (response: {
      data: Reprytype[];
      totalUnSeen: number;
    }) => {
      if (
        !response ||
        !Array.isArray(response.data) ||
        typeof response.totalUnSeen === "undefined"
      ) {
        setError("Dữ liệu thông báo không hợp lệ từ máy chủ.");
        setNotifications([]);
        setTotalUnseen(0);
        setLoading(false);
        return;
      }
      setNotifications(response.data);
      setTotalUnseen(response.totalUnSeen);
      setLoading(false);
    };

    const handleReplyNotification = (response: {
      data: Reprytype;
      totalUnSeen: number;
    }) => {
      if (
        !response ||
        !response.data ||
        typeof response.totalUnSeen === "undefined"
      ) {
        console.log("Lỗi thêm thông báo");
        return;
      }
      getAllNotification();
    };

    const handleError = (err: { message: string }) => {
      console.error("WebSocket error:", err.message);
      setError(err.message);
      setLoading(false);
    };

    listenForEvent("notifications", handleNotifications);
    listenForEvent("newReplyNotification", handleReplyNotification);
    listenForEvent("error", handleError);

    getAllNotification();

    return () => {
      offListenForEvent("notifications", handleNotifications);
      offListenForEvent("newReplyNotification", handleReplyNotification);
      offListenForEvent("error", handleError);
      disconnectWebSocket();
    };
  }, [getAllNotification, userId]);

  const handleUnseenNotifi = (id: number) => {
    emitEvent("markNotificationAsSeen", { id, userId });
  };

  const handleOnDeletenotifi = (id: number) => {
    emitEvent("deleteNotification", { id, userId });
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer relative">
        <div className="relative group">
          <Bell className="size-6 text-primary transition-transform duration-200 group-hover:scale-110" />
          {totalUnseen > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 size-4 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
              {totalUnseen}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-2">
        <DropdownMenuLabel className="text-base font-bold">
          Thông báo
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto space-y-2 px-2 py-2">
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-4 flex items-center justify-center gap-2">
              <Loader className="size-5 animate-spin" /> Đang tải thông báo...
            </div>
          ) : error ? (
            <div className="text-center text-sm text-red-500 py-4">{error}</div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => (
              <Link
                to={`/truyen-tranh/${item.slug}?commentId=${item.commentId}`}
                onClick={() => {
                  handleUnseenNotifi(item.id);
                  setOpen(false);
                }}
                key={item.id}
                className={`flex items-start p-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-100 hover:shadow-sm cursor-pointer border-l-4 ${
                  item.seen ? "bg-gray-50" : "bg-blue-50"
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800 line-clamp-2">
                    {item.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(item.create_at).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {!item.seen && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                      Mới
                    </span>
                  )}
                  <button
                    onClick={() => {
                      handleOnDeletenotifi(item.id);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-150"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              Không có thông báo
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ReplyNotification;
