import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chapterActionSchema } from "@/lib/zod-schemas";
import { editChapterApi } from "@/services/chapter-service";
import { ChapterAction } from "@/types/chapter-type";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type EditChapterProps = {
  chapter: ChapterAction;
  onEditSuccess: () => void;
};

const EditChapterForm = ({ chapter, onEditSuccess }: EditChapterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof chapterActionSchema>>({
    resolver: zodResolver(chapterActionSchema),
    defaultValues: {
      comic_id: chapter.comic_id,
      chapter_name: chapter.chapter_name,
      chapter_title: chapter.chapter_title,
      price_xu: chapter.price_xu,
      auto_unlock_time: chapter.auto_unlock_time,
    },
  });

  const onSubmit = async (data: z.infer<typeof chapterActionSchema>) => {
    const { comic_id, ...result } = data;
    try {
      setIsLoading(true);
      await editChapterApi(
        chapter.id,
        result as Omit<ChapterAction, "id" | "comic_id">
      );
      onEditSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="comic_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input hidden {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chapter_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Tên chương
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Nhập tên chương (ví dụ: 1)"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chapter_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Mô tả chương
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Nhập mô tả chương (Có thể bỏ trống)"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_xu"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Giá mở chương (xu)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Nhập số xu"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auto_unlock_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Thời gian tự động mở khóa
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={
                      field.value
                        ? dayjs(field.value)
                            .utcOffset(7)
                            .format("YYYY-MM-DDTHH:mm")
                        : ""
                    }
                    onChange={(e) => {
                      const localDate = dayjs(e.target.value).toDate();
                      field.onChange(localDate);
                    }}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            className="text-gray-600 border-gray-300 hover:bg-gray-100"
          >
            Xóa form
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sửa chương
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditChapterForm;
