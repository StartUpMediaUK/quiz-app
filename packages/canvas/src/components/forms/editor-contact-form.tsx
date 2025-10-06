import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

interface EditorContactFormProps {
  title: string;
  subTitle: string;
  buttonText: string;
  styles: React.CSSProperties;
  apiCall: (values: ContactDetailsSchema) => any;
}

export const ContactDetailsValidator = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
});

export type ContactDetailsSchema = z.infer<typeof ContactDetailsValidator>;


const EditorContactForm: React.FC<EditorContactFormProps> = ({
  apiCall,
  subTitle,
  buttonText,
  styles,
  title,
}) => {
  const form = useForm<ContactDetailsSchema>({
    mode: "onChange",
    resolver: zodResolver(ContactDetailsValidator),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <Card style={styles}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {subTitle && <CardDescription>{subTitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(apiCall)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-4"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              {buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditorContactForm;
