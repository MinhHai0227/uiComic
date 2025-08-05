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
import { userCreateSchema } from "@/lib/zod-schemas";
import { createUserApi } from "@/services/user-service";
import { UserCreate } from "@/types/user-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateUserForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userCreateSchema>) => {
    try {
      setIsLoading(true);
      await createUserApi(data as UserCreate);
      onSuccess();
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
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="m@example.com"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Nhập mật khẩu"
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
            Thêm tài khoản
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateUserForm;
