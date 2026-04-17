"use client";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/app/api/actions";
import { usePathname, useRouter } from "next/navigation";
import { LoginSchema } from "@/schema/auth.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useTranslation } from "@/app/i18n/client";

// interface LoginFormCardProps {
//   session: any;
// }
export const LoginForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "Language");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(async () => {
      const error = await authenticate(undefined, formData);
      if (!error) {
        router.push(`/coachbee/${lng}/home`);
      } else {
        toast.error("Invalid credentials");
      }
    });

  };

  return (
    <>
      <div className="w-full flex justify-center mb-10 mt-10">
        <CardWrapper
          headerLabel="Welcome Back"
          backButtonLabel="Don't have an account? Please contact with Admin"
          backButtonHref=""
          showSocial
        >
          {/* Module input field  */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">

                {/* Username input field  */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-hidden"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div >
    </>
  );
};
