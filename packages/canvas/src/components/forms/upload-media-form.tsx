"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createMedia } from "@/db/queries/media";
import { saveActivityLogsNotification } from "@/db/queries/notifications";

import { CanvasDB } from "@/db/canvas-db";
import { useModal } from "@/hooks/use-modal";
import { GenerateUUID } from "@/lib/uuid";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { z } from "zod";
import FileUpload from "../file-upload";


interface UploadMediaFormProps {
  db: CanvasDB;
  accountId: string;
}

export const UploadMediaValidator = z.object({
  link: z.string().min(1, { message: "Media file is required" }),
  name: z.string().min(1, { message: "Media name is required" }),
});

export type UploadMediaSchema = z.infer<typeof UploadMediaValidator>;


const UploadMediaForm: React.FC<UploadMediaFormProps> = ({ db, accountId }) => {
  const router = useRouter();
  const { setClose } = useModal();

  const form = useForm<UploadMediaSchema>({
    resolver: zodResolver(UploadMediaValidator),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<UploadMediaSchema> = async (values) => {
    try {
      const response = await createMedia({db, accountId, mediaFiles: {...values, objectGuid: GenerateUUID(), accountId}});

      await saveActivityLogsNotification({
        db,
        description: `Uploaded a media file | ${response.name}`,
      });

      setClose();
      toast.success("Success", {
        description: "Uploaded media file",
      });
      
      router.refresh();
    } catch (error) {
      toast.error("Failed", {
        description: "Could not uploaded media",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your file name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Media file</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      uploadFile={async (file: File) => {
                        // Call the app-specific upload logic here
                        // For example, UploadThing or S3
                        return "resulting-file-url";
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              isLoading={isSubmitting}
              disabled={isSubmitting}
              type="submit"
              className="mt-4"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadMediaForm;
