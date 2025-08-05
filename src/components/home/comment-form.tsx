import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { commentSchema } from "@/lib/zod-schemas";
import { createComment } from "@/services/comment-service";
import { addComment } from "@/types/comment-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CommentFormProps {
  comicId?: number | undefined;
  chapterId?: number | undefined;
  parentId?: number | undefined;
  replyToId?: number | undefined;
  onSubmitSuccess: () => void;
}

const CommentForm = ({
  comicId,
  chapterId,
  parentId,
  replyToId,
  onSubmitSuccess,
}: CommentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      chapter_id: chapterId,
      comic_id: comicId,
      parent_id: parentId,
      replyToId: replyToId,
      content: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    try {
      setIsLoading(true);
      console.log(data);
      await createComment(data as addComment);
      form.reset();
      onSubmitSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Nhập bình luận của bạn..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="ml-auto block">
            Gửi
          </Button>
        </form>
      </Form>
    </>
  );
};
export default CommentForm;
