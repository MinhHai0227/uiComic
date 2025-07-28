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
import { Textarea } from "@/components/ui/textarea";
import { categoryCreateSchema } from "@/lib/zod-schemas";
import { editCategoryApi } from "@/services/category-service";
import { Category } from "@/types/category-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditCategoryProps = {
  category: Category;
  onEditSuccess: () => void;
};

const EditCategoryForm = ({ category, onEditSuccess }: EditCategoryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof categoryCreateSchema>>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description,
    },
  });

  const nameValue = form.watch("name");

  useEffect(() => {
    const slug = nameValue;
    form.setValue("slug", slug);
  }, [nameValue, form]);

  const onSubmit = async (data: z.infer<typeof categoryCreateSchema>) => {
    try {
      setIsLoading(true);
      await editCategoryApi(category.id, data as Omit<Category, "id">);
      onEditSuccess();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thể loại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input hidden {...field} value={nameValue} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-6 cursor-pointer">
            <Button
              className="cursor-pointer"
              disabled={isLoading}
              type="submit"
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
export default EditCategoryForm;
