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
import { useAppDispatch } from "@/redux/hooks";
import { getAllCategory } from "@/redux/slices/category-slice";
import { createCategoryApi } from "@/services/category-service";
import { Category } from "@/types/category-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateCategoryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof categoryCreateSchema>>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof categoryCreateSchema>) => {
    try {
      setIsLoading(true);
      await createCategoryApi(data as Omit<Category, "id">);
      dispatch(getAllCategory());
      form.reset();
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
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
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
              Thêm
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default CreateCategoryForm;
