import { countryCreateSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CountryAction } from "@/types/country-type";
import { editCountryApi } from "@/services/country-service";

type EditCountryProps = {
  country: CountryAction;
  onEditSuccess: () => void;
};

const EditCountryForm = ({ country, onEditSuccess }: EditCountryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof countryCreateSchema>>({
    resolver: zodResolver(countryCreateSchema),
    defaultValues: {
      name: country.name,
    },
  });

  const onsubmit = async (data: z.infer<typeof countryCreateSchema>) => {
    try {
      setIsLoading(true);
      await editCountryApi(country.id, data as Omit<CountryAction, "id">);
      onEditSuccess();
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
              Sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditCountryForm;
