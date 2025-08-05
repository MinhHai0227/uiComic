import { z } from "zod";

//auth
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất  6 kí tự"),
});

const registerSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất  6 kí tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không chính xác",
    path: ["confirmPassword"],
  });

//user
const userCreateSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất  6 kí tự"),
  role: z.string().min(1, "Chức vụ không được để trống"),
});

const userEditSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  total_coin: z.coerce.number().min(0, "Total Coin phải là số dương"),
  role: z.string().min(1, "Chức vụ không được để trống"),
});

//category
const categoryCreateSchema = z.object({
  name: z.string().min(1, "Tên thể loại không được bỏ trống"),
  slug: z
    .string()
    .min(1, "Slug không được bỏ trống")
    .regex(
      /^[\p{L}\p{N}\s]+$/u,
      "Tên thể loại chỉ được chứa chữ, số, khoảng trắng"
    )
    .transform((val) => {
      // 1. Loại bỏ dấu tiếng Việt
      const noVietnamese = val
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");

      // 2. Xử lý slug: bỏ khoảng trắng đầu/cuối, thay khoảng trắng giữa = -, bỏ ký tự đặc biệt
      return noVietnamese
        .trim()
        .replace(/\s+/g, "-") // đổi khoảng trắng giữa thành -
        .replace(/[^a-zA-Z0-9-]/g, "") // xóa ký tự đặc biệt
        .toLowerCase(); // lowercase toàn bộ
    }),
  description: z.string().min(1, "Mô tả không được bỏ trống"),
});

//coin
const coinCreateCoinSchema = z.object({
  price: z.coerce.number().min(10000, "Giá xu phải trên 9.999 VND"),
  coin_amount: z.coerce.number().min(0, "Xu phải là số dương"),
});

//country
const countryCreateSchema = z.object({
  name: z.string().min(1, "Tên quốc gia không được bỏ trống"),
});

//comic
const comicCreateSchema = z.object({
  title: z.string().min(1, "Tên truyện không được bỏ trống"),
  title_eng: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug không được bỏ trống")
    .regex(
      /^[\p{L}\p{N}\s]+$/u,
      "Tên truyện chỉ được chứa chữ, số, khoảng trắng"
    )
    .transform((val) => {
      // 1. Loại bỏ dấu tiếng Việt
      const noVietnamese = val
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");

      // 2. Xử lý slug: bỏ khoảng trắng đầu/cuối, thay khoảng trắng giữa = -, bỏ ký tự đặc biệt
      return noVietnamese
        .trim()
        .replace(/\s+/g, "-") // đổi khoảng trắng giữa thành -
        .replace(/[^a-zA-Z0-9-]/g, "") // xóa ký tự đặc biệt
        .toLowerCase(); // lowercase toàn bộ
    }),
  description: z.string().min(1, "Mô tả truyện không được bỏ trống"),
  author: z.string().min(1, "Tác giả không được bỏ trống"),
  countryId: z.coerce.number().min(1, "Quốc gia không được bỏ trống"),
  categoryId: z
    .array(z.coerce.number())
    .nonempty("Vui lòng chọn ít nhất một thể loại"),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File hình không được trống" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là hình ảnh",
    }),
});

//chapter
const chapterActionSchema = z.object({
  comic_id: z.coerce.number().min(0, "ComicId không được bỏ trống"),
  chapter_name: z.string().min(1, "Tên chương không được bỏ trống"),
  chapter_title: z.string().optional(),
  price_xu: z.coerce.number().min(0, "Giá xu không phải là số âm"),
  auto_unlock_time: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Thời gian mở khóa không hợp lệ",
    })
    .refine((date) => date > new Date(), {
      message: "Thời gian mở khóa không được trong quá khứ",
    }),
});

//chapterImage
const createImageSchema = z.object({
  chapter_id: z.coerce.number().min(0, "Chapter_id không được bỏ trống"),
  image: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size > 0, {
          message: "File hình không được trống",
        })
        .refine((file) => file.type.startsWith("image/"), {
          message: "File phải là hình ảnh",
        })
    )
    .min(1, "Phải có ít nhất 1 ảnh"),
});

//upload avatar
const uploadAvatar = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File hình không được trống" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là hình ảnh",
    }),
});

//momo
const paymentSchema = z.object({
  coin_id: z.coerce.number().min(0, "Vui lòng chọn gói xu"),
});

//comment
const commentSchema = z.object({
  comic_id: z.coerce.number().optional(),
  chapter_id: z.coerce.number().optional(),
  parent_id: z.coerce.number().optional(),
  replyToId: z.coerce.number().optional(),
  content: z.string().min(1, "Nhập nội dung để bình luận"),
});

//change passworh
const ChangePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    new_password: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận lại mật khẩu mới"),
  })
  .refine((data) => data.new_password !== data.old_password, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["new_password"],
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
});

const resetPasswordSchema = z
  .object({
    new_password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận lại mật khẩu mới"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

export {
  loginSchema,
  registerSchema,
  userCreateSchema,
  userEditSchema,
  categoryCreateSchema,
  coinCreateCoinSchema,
  countryCreateSchema,
  comicCreateSchema,
  chapterActionSchema,
  createImageSchema,
  uploadAvatar,
  paymentSchema,
  commentSchema,
  ChangePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
