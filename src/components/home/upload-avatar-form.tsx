import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { uploadAvatar } from "@/lib/zod-schemas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserProfile } from "@/redux/slices/user-slice";
import { uploadAvatarApi } from "@/services/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UploadAvatarForm = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user.userProfile);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof uploadAvatar>>({
    resolver: zodResolver(uploadAvatar),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof uploadAvatar>) => {
    try {
      setIsLoading(true);
      await uploadAvatarApi(data.file);
      dispatch(getUserProfile());
      form.reset({ file: undefined });
    } finally {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/formData">
        <div className="px-2">
          <Avatar className="size-20 mx-auto my-4">
            <AvatarImage src={preview ?? user?.avatar ?? ""} alt="avatar" />
            <AvatarFallback className="text-6xl">
              {user?.username.charAt(0).toUpperCase() ??
                user?.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn ảnh</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        if (preview) {
                          URL.revokeObjectURL(preview);
                        }
                        field.onChange(selectedFile);
                        setPreview(URL.createObjectURL(selectedFile));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-17 flex justify-center">
          <Button
            disabled={isLoading || preview === null}
            className="cursor-pointer"
            type="submit"
          >
            {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default UploadAvatarForm;
