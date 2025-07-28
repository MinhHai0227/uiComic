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
import { coinCreateCoinSchema } from "@/lib/zod-schemas";
import { useAppDispatch } from "@/redux/hooks";
import { getAllCoin } from "@/redux/slices/coin-slice";
import { createCoinApi } from "@/services/coin-service";
import { CoinAction } from "@/types/coin-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateCoinForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof coinCreateCoinSchema>>({
    resolver: zodResolver(coinCreateCoinSchema),
    defaultValues: {
      price: 0,
      coin_amount: 0,
    },
  });
  const onSubmit = async (data: z.infer<typeof coinCreateCoinSchema>) => {
    try {
      setIsLoading(true);
      await createCoinApi(data as Omit<CoinAction, "id">);
      dispatch(getAllCoin());
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coin_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số xu nhận được</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
              Thêm
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default CreateCoinForm;
