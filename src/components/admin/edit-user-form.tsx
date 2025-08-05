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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userEditSchema } from "@/lib/zod-schemas";
import { editUserApi } from "@/services/user-service";
import { UserEdit } from "@/types/user-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserEditProps = {
  user: UserEdit;
  onEditSuccess: () => void;
};

const EditUserForm = ({ user, onEditSuccess }: UserEditProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      total_coin: user.total_coin,
      role: user.role,
    },
  });

  const onSubmit = async (data: z.infer<typeof userEditSchema>) => {
    const { email, ...result } = data;
    try {
      setIsLoading(true);
      await editUserApi(user.id, result as Omit<UserEdit, "id">);
      onEditSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Tên người dùng
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Nhập tên người dùng"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    disabled
                    className="rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed"
                    placeholder="m@example.com"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_coin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Tổng xu
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Nhập số xu"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Chức vụ
                  {field.value && (
                    <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {field.value}
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
                  >
                    {["user", "editor", "admin"].map((role) => (
                      <FormItem key={role} className="flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem
                            value={role}
                            className="text-primary"
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-gray-600 font-normal">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            className="text-gray-600 border-gray-300 hover:bg-gray-100"
          >
            Xóa form
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sửa tài khoản
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
