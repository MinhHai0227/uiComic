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
  role: z.string().min(1, "Role không được để trống"),
});

const userEditSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  total_coin: z.coerce.number().min(0, "Total Coin phải là số dương"),
  role: z.string().min(1, "Role không được để trống"),
});

//category
const categoryCreateSchema = z.object({
  name: z.string().min(1, "Name không được bỏ trống"),
  slug: z.string().min(1, "Name không được bỏ trống"),
  description: z.string().min(1, "Name không được bỏ trống"),
});

//coin
const coinCreateCoinSchema = z.object({
  price: z.coerce.number().min(10000, "Price phải trên 9.999 VND"),
  coin_amount: z.coerce.number().min(0, "Coin phải là số dương"),
});

//country
const countryCreateSchema = z.object({
  name: z.string().min(1, "Name không được bỏ trống"),
});

//comic
const comicCreateSchema = z.object({
  title: z.string().min(1, "Title không được bỏ trống"),
  title_eng: z.string().optional(),
  slug: z.string().min(1, "Slug không được bỏ trống"),
  description: z.string().min(1, "Description không được bỏ trống"),
  author: z.string().min(1, "Author không được bỏ trống"),
  countryId: z.coerce.number().min(1, "Country không được bỏ trống"),
  categoryId: z
    .array(z.coerce.number())
    .nonempty("Vui lòng chọn ít nhất một thể loại"),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File không được trống" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là hình ảnh",
    }),
});

//chapter
const chapterActionSchema = z.object({
  comic_id: z.coerce.number().min(0, "ComicId không được bỏ trống"),
  chapter_name: z.string().min(1, "Chapter name không được bỏ trống"),
  chapter_title: z.string().optional(),
  price_xu: z.coerce.number().min(0, "Price xu không được bỏ trống"),
  auto_unlock_time: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Thời gian mở khóa không hợp lệ",
    })
    .refine((date) => date > new Date(), {
      message: "Thời gian mở khóa không được trong quá khứ",
    }),
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
};
