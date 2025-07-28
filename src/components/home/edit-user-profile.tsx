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
import { userEditSchema } from "@/lib/zod-schemas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserProfile } from "@/redux/slices/user-slice";
import { editUserApi } from "@/services/user-service";
import { UserEdit } from "@/types/user-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditUserProfile = () => {
  const user = useAppSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
      total_coin: 0,
    },
  });

  useEffect(() => {
    if (
      user &&
      typeof user.username === "string" &&
      typeof user.email === "string" &&
      typeof user.role === "string" &&
      typeof user.total_coin === "number"
    ) {
      form.reset({
        username: user.username,
        email: user.email,
        role: user.role,
        total_coin: user.total_coin,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof userEditSchema>) => {
    const { email, ...result } = data;
    try {
      setIsLoading(true);
      if (user?.id) {
        await editUserApi(user.id, result as Omit<UserEdit, "id">);
      }
      dispatch(getUserProfile());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_coin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center mt-6 cursor-pointer">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserProfile;
