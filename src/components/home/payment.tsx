import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { paymentSchema } from "@/lib/zod-schemas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllCoin } from "@/redux/slices/coin-slice";
import { paymentApi } from "@/services/coin-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const Payment = () => {
  const user = useAppSelector((state) => state.user.userProfile);
  const { data, loading } = useAppSelector((state) => state.coin);
  const [selectedCoinId, setSelectedcoinid] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCoin());
  }, [dispatch]);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      coin_id: selectedCoinId ?? 0,
    },
  });

  const onSunmit = async (data: z.infer<typeof paymentSchema>) => {
    try {
      setIsLoading(true);
      if (selectedCoinId !== null) {
        const res = await paymentApi(data.coin_id);
        console.log(res);
        if (res && res.payUrl) {
          window.location.href = res.payUrl;
          console.log(res.payUrl);
        } else {
          toast.error("Không nhận được link thanh toán từ hệ thống!");
        }
      }
    } finally {
      setIsLoading(false);
      setSelectedcoinid(null);
    }
  };

  useEffect(() => {
    if (selectedCoinId !== null) {
      form.setValue("coin_id", selectedCoinId);
    }
  }, [selectedCoinId, form]);

  return (
    <div>
      <p className="bg-primary text-center font-semibold py-2">
        Xu của bạn: {user?.total_coin}
      </p>
      <div className="flex flex-col m-2">
        <div className=" sm:p-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {loading
            ? "Dang load ..."
            : data.map((coin) => {
                const isSelected = coin.id === selectedCoinId;
                return (
                  <div
                    key={coin.id}
                    onClick={() => setSelectedcoinid(coin.id)}
                    className={`max-w-sm w-full mx-auto rounded-2xl px-6 py-6 cursor-pointer transition-all duration-300 ease-in-out border
        ${
          isSelected
            ? "border-primary  shadow-lg scale-[1.02]"
            : "bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 hover:shadow-lg hover:-translate-y-1 border-border"
        }`}
                  >
                    <div
                      className={`text-center text-2xl font-bold tracking-tight
          ${
            isSelected
              ? "text-primary dark:text-primary-foreground"
              : "text-gray-900 dark:text-white"
          }`}
                    >
                      {coin.price.toLocaleString("vi-VN")} VND
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 text-sm mt-2 font-medium
          ${
            isSelected
              ? "text-primary dark:text-primary-foreground"
              : "text-gray-600 dark:text-gray-300"
          }`}
                    >
                      <p>{coin.price}</p>
                      <Coins
                        className={`size-5 ${
                          isSelected ? "text-primary" : "text-primary"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSunmit)}>
              <FormField
                control={form.control}
                name="coin_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input hidden {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-center mt-6 cursor-pointer">
                <Button
                  type="submit"
                  disabled={isLoading || selectedCoinId === null}
                >
                  {isLoading && (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  )}
                  Thanh Toán
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Payment;
