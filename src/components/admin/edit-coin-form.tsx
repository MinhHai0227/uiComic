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
import { editCoinApi } from "@/services/coin-service";
import { CoinAction } from "@/types/coin-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditCoinProps = {
  coin: CoinAction;
  onEditSuccess: () => void;
};

const EditCoinForm = ({ coin, onEditSuccess }: EditCoinProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof coinCreateCoinSchema>>({
    resolver: zodResolver(coinCreateCoinSchema),
    defaultValues: {
      price: coin.price,
      coin_amount: coin.coin_amount,
    },
  });
  const onSubmit = async (data: z.infer<typeof coinCreateCoinSchema>) => {
    try {
      setIsLoading(true);
      await editCoinApi(coin.id, data as Omit<CoinAction, "id">);
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
              Sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default EditCoinForm;
