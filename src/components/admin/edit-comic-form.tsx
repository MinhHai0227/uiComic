import { comicCreateSchema } from "@/lib/zod-schemas";
import { ComicAction, ComicEdit } from "@/types/comic-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { getAllCountry } from "@/redux/slices/country-slice";
import { getAllCategory } from "@/redux/slices/category-slice";
import { editComicApi } from "@/services/comic-service";

type EditComicProps = {
  comic: ComicEdit;
  onEditSuccess: () => void;
};

const EditComicForm = ({ comic, onEditSuccess }: EditComicProps) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.country.data);
  const categories = useAppSelector((state) => state.category.data);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof comicCreateSchema>>({
    resolver: zodResolver(comicCreateSchema),
    defaultValues: {
      title: comic.title,
      title_eng: comic.title_eng,
      slug: comic.slug,
      description: comic.description,
      author: "",
      categoryId: [],
      countryId: 0,
      file: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof comicCreateSchema>) => {
    try {
      setIsLoading(true);
      await editComicApi(comic.id, data as ComicAction);
      onEditSuccess();
    } finally {
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
                    <FormLabel>Title</FormLabel>
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
                    <FormLabel>English Title</FormLabel>
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
                      <Input disabled {...field} />
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
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
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
                    <FormLabel>Country</FormLabel>
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
                    <FormLabel>Category</FormLabel>
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
                    <FormLabel>Cover Image</FormLabel>
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
              Sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default EditComicForm;
