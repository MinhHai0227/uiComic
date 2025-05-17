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
import { countryCreateSchema } from "@/lib/zod-schemas";
import { useAppDispatch } from "@/redux/hooks";
import { getAllCountry } from "@/redux/slices/country-slice";
import { createCountryApi } from "@/services/country-service";
import { CountryAction } from "@/types/country-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateCountryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof countryCreateSchema>>({
    resolver: zodResolver(countryCreateSchema),
    defaultValues: {
      name: "",
    },
  });
  const onsubmit = async (data: z.infer<typeof countryCreateSchema>) => {
    try {
      setIsLoading(true);
      await createCountryApi(data as Omit<CountryAction, "id">);
      dispatch(getAllCountry());
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
export default CreateCountryForm;
