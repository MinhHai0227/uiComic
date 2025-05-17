import { userEditSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserEdit } from "@/types/user-type";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { editUserApi } from "@/services/user-service";

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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Total Coin</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1 mt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <FormLabel>User</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="editor" />
                        </FormControl>
                        <FormLabel>Editor</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" />
                        </FormControl>
                        <FormLabel>Admin</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-6 cursor-pointer">
            <Button
              className="cursor-pointer"
              disabled={isLoading}
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
export default EditUserForm;
