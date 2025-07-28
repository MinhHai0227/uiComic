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
import { createImageSchema } from "@/lib/zod-schemas";
import { uploadImagesApi } from "@/services/chapter-action-service";
import { AddAllImages } from "@/types/chapter-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateImageProps = {
  chapterId: number;
  onCreateSuccess: () => void;
};

const CreateImageForm = ({ chapterId, onCreateSuccess }: CreateImageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof createImageSchema>>({
    resolver: zodResolver(createImageSchema),
    defaultValues: {
      chapter_id: chapterId,
      image: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof createImageSchema>) => {
    try {
      setIsLoading(true);
      await uploadImagesApi(data as AddAllImages);
      onCreateSuccess();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/formData"
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="chapter_id"
              render={({ field }) => (
                <FormControl>
                  <Input hidden {...field} />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn ảnh</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          field.onChange(Array.from(files));
                        } else {
                          field.onChange([]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button
              className="cursor-pointer"
              disabled={isLoading}
              type="submit"
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Thêm
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default CreateImageForm;
