"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signIn } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RiContrast2Line } from "@remixicon/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Define the schema using Zod
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").transform((val) => val.trim()),
  rememberMe: z.boolean(),
});

type SignInFormData = z.infer<typeof signInSchema>;


export default function SignIn() {
  const [emailSignIn, setEmailSignIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: SignInFormData) => {
    try {
      setLoading(true)
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
        rememberMe: data.rememberMe,
      });
      if (!result.data) {
        toast.error("Sign-in failed", {
          description: result.error.message,
          action: {
            label: "Refresh",
            onClick: () => router.refresh(),
          },
        })
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-28 lg:px-6">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-sm">
        <div
          className="pointer-events-none absolute -top-[25%] left-1/2 -translate-x-1/2 select-none opacity-60 dark:opacity-90"
          aria-hidden="true"
          style={{
            maskImage: "radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)",
          }}
        >
          <div className="flex flex-col gap-1">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={`outer-${index}`}>
                <div className="flex gap-2">
                  {Array.from({ length: 10 }, (_, index2) => (
                    <div key={`inner-${index}-${index2}`}>
                      <div className="size-7 rounded-md shadow shadow-indigo-500/40 ring-1 ring-black/5 dark:shadow-indigo-400/20 dark:ring-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-fit rounded-xl bg-gray-50 p-4 shadow-md shadow-black/10 ring-1 ring-black/10 dark:bg-gray-900 dark:ring-gray-800">
          <div className="absolute left-[9%] top-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
          <div className="absolute right-[9%] top-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
          <div className="absolute bottom-[9%] left-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
          <div className="absolute bottom-[9%] right-[9%] size-1 rounded-full bg-gray-100 shadow-inner dark:bg-gray-800" />
          <div className="w-fit rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 p-3 shadow-sm shadow-blue-500/50 ring-1 ring-inset ring-white/25">
            <RiContrast2Line className="size-8 text-white" aria-hidden="true" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-semibold text-gray-900 dark:text-gray-50">
          Sign in to Overview
        </h2>
        {emailSignIn ? (
          <div>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  disabled={loading}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="m@example.com" disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  disabled={loading}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input id="password" placeholder="Password" type="password" autoCapitalize="none" autoComplete="password" autoCorrect="off" disabled={loading} {...field} />
                      </FormControl>
                      <Link href="#" className="ml-auto inline-block text-sm font-normal text-muted-foreground underline">
                        Forgot your password?
                      </Link>
                      <FormMessage />
                    </FormItem>
                  )}
                />  
                <FormField
                  control={form.control}
                  disabled={loading}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="rememberMe">Remember me</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <>
            {/* <div className="mt-10">
              <SocialSignButtons />
            </div> */}
            <Button type="button" variant="secondary" onClick={() => setEmailSignIn(true)} className="mt-4 w-full">
              Continue with Email
            </Button>
          </>
        )}
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="#" className="underline underline-offset-2">
            terms of service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
