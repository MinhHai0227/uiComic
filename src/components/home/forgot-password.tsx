import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/zod-schemas";
import { forgotPasswordApi } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsLoading(true);
      const res = await forgotPasswordApi(data.email);
      if (res && res.success) {
        toast.success(res.success);
        form.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default ForgotPassword;
