import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { comicCreateSchema } from "@/lib/zod-schemas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllCategory } from "@/redux/slices/category-slice";
import { getAllCountry } from "@/redux/slices/country-slice";
import { createComicApi } from "@/services/comic-service";
import { ComicAction } from "@/types/comic-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateComicForm = ({
  onCreateSuccess,
}: {
  onCreateSuccess: () => void;
}) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.country.data);
  const categories = useAppSelector((state) => state.category.data);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof comicCreateSchema>>({
    resolver: zodResolver(comicCreateSchema),
    defaultValues: {
      title: "",
      title_eng: "",
      slug: "",
      description: "",
      author: "",
      countryId: undefined,
      categoryId: [],
      file: undefined,
    },
  });

  const nameValue = form.watch("title");
  useEffect(() => {
    const slug = nameValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    form.setValue("slug", slug);
  }, [nameValue, form]);

  const onSubmit = async (data: z.infer<typeof comicCreateSchema>) => {
    try {
      setIsLoading(true);
      await createComicApi(data as ComicAction);
      onCreateSuccess();
    } finally {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getAllCountry());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột 1: Thông tin cơ bản */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Tên truyện
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                      placeholder="Nhập tên truyện"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      hidden
                      value={nameValue
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_eng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Tên khác
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                      placeholder="Nhập tên khác (có thể bỏ trống)"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary min-h-[100px]"
                      placeholder="Nhập mô tả truyện"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Tác giả
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                      placeholder="Nhập tên tác giả"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Cột 2: Quốc gia và thể loại */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Quốc gia
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2"
                    >
                      {countries?.map((country) => (
                        <FormItem
                          key={country.id}
                          className="flex items-center gap-2"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={String(country.id)}
                              className="text-primary"
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-gray-600 font-normal">
                            {country.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Thể loại
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500">
                    Chọn các thể loại phù hợp với truyện.
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 mt-2">
                    {categories?.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked
                                      ? [...field.value, category.id]
                                      : field.value?.filter(
                                          (value) => value !== category.id
                                        )
                                  );
                                }}
                                className="text-primary"
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-gray-600 font-normal">
                              {category.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Cột 3: Ảnh đại diện */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Ảnh đại diện
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            if (preview) {
                              URL.revokeObjectURL(preview);
                            }
                            field.onChange(selectedFile);
                            setPreview(URL.createObjectURL(selectedFile));
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-w-[200px] mx-auto rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
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
            Thêm truyện
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateComicForm;
