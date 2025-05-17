import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/zod-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loginApi } from "@/services/auth-service";
import { loginType } from "@/types/auth-type";
import { setUser } from "@/redux/slices/auth-slice";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";

const Login = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const res = await loginApi(data as loginType);
      if (res && res.data) {
        dispatch(
          setUser({
            id: res.data.id,
            email: res.data.email,
            role: res.data.role,
          })
        );
        form.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng Nhập</CardTitle>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Mật khẩu</FormLabel>
                      <Link
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        to="/"
                      >
                        Quên mật khẩu ?
                      </Link>
                    </div>
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
                Login
              </Button>
              <Link to="/" className={buttonVariants({ variant: "outline" })}>
                Login with Google
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              Chưa có tài khoản ?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Đăng kí
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default Login;
