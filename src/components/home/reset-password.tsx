import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/lib/zod-schemas";
import { resetPasswordApi } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsLoading(true);
      if (token) {
        const res = await resetPasswordApi(token, data.new_password);
        if (res && res.success) {
          toast.success(res.success);
          navigate("/login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="max-w-96 flex mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                Đổi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default ResetPassword;
