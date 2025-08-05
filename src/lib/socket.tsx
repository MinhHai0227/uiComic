import { io, Socket } from "socket.io-client";

const WS_SERVER_URL = "http://localhost:3000"; // Hoặc ws:// nếu server dùng WebSocket thuần

let socket: Socket | null = null;

/**
 * Kết nối tới WebSocket server với userId.
 * @param userId ID người dùng, sẽ được gửi trong query để server có thể join phòng.
 * @returns Đối tượng Socket đã kết nối.
 */
export const connectWebSocket = (userId: number | string): Socket => {
  if (socket && socket.connected) {
    console.log("🔁 Socket already connected.");
    return socket;
  }

  socket = io(WS_SERVER_URL, {
    query: { userId: String(userId) }, // ép kiểu userId thành string
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log(`✅ Connected to WebSocket server with ID: ${socket?.id}`);
  });

  socket.on("disconnect", (reason: string) => {
    console.log(`❌ Disconnected from WebSocket server: ${reason}`);
  });

  socket.on("connect_error", (error: Error) => {
    console.error("⚠️ WebSocket connection error:", error);
  });

  return socket;
};

/**
 * Ngắt kết nối WebSocket.
 */
export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 WebSocket disconnected.");
  }
};

/**
 * Đăng ký lắng nghe sự kiện từ server.
 * @param event Tên sự kiện.
 * @param callback Hàm xử lý khi nhận được sự kiện.
 */
export const listenForEvent = (
  event: string,
  callback: (...args: any[]) => void
): void => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.warn("⚠️ Socket not connected. Cannot listen for event:", event);
  }
};

/**
 * Hủy đăng ký lắng nghe một sự kiện.
 * @param event Tên sự kiện.
 * @param callback Hàm callback (tùy chọn, nếu không truyền sẽ bỏ toàn bộ listener cho event đó).
 */
export const offListenForEvent = (
  event: string,
  callback?: (...args: any[]) => void
): void => {
  if (socket) {
    socket.off(event, callback);
  }
};

/**
 * Gửi một sự kiện đến server.
 * @param event Tên sự kiện.
 * @param data Dữ liệu kèm theo sự kiện.
 */
export const emitEvent = (event: string, data: any): void => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.warn("⚠️ Socket not connected. Cannot emit event:", event);
  }
};

/**
 * Truy cập socket hiện tại.
 * @returns Socket hoặc null.
 */
export const getSocket = (): Socket | null => socket;
