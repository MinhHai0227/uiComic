import { chapterActionSchema } from "@/lib/zod-schemas";
import { ChapterAction } from "@/types/chapter-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import moment from "moment";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { editChapterApi } from "@/services/chapter-service";

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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" flex flex-col gap-6">
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
                  <FormLabel>Chap</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chapter_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price_xu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ptice Xu</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="auto_unlock_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auto Unlock</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={
                        field.value
                          ? moment(field.value)
                              .utcOffset(7)
                              .format("YYYY-MM-DDTHH:mm")
                          : ""
                      }
                      onChange={(e) => {
                        const localDate = moment(e.target.value).toDate();
                        field.onChange(localDate);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex mt-6 justify-end">
            <Button
              disabled={isLoading}
              type="submit"
              className="cursor-pointer"
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default EditChapterForm;
