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
      countryId: 0,
      categoryId: [],
      file: undefined,
    },
  });

  const nameValue = form.watch("title");
  useEffect(() => {
    const slug = nameValue;
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/formData"
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên truyện</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title_eng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khác</FormLabel>
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
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tác giả</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" flex flex-col gap-6">
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc gia</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange}>
                        <div className="grid grid-cols-2 gap-2">
                          {countries &&
                            countries.map((country) => (
                              <FormItem
                                key={country.id}
                                className="flex items-center"
                              >
                                <FormControl>
                                  <RadioGroupItem value={String(country.id)} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {country.name}
                                </FormLabel>
                              </FormItem>
                            ))}
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại của truyện</FormLabel>
                    <FormDescription>
                      Chọn các thể loại của truyện tranh.
                    </FormDescription>
                    <div className="flex flex-wrap gap-5 mt-2">
                      {categories &&
                        categories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start"
                                  key={category.id}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        category.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              category.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {category.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh đại diện</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
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
                    </FormControl>
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-50 mx-auto rounded border"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              disabled={isLoading}
              className="cursor-pointer"
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

export default CreateComicForm;
