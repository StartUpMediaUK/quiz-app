'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CategorySection } from "./_category-section";

const quizSchema = z.object({
  slug: z.string(),
  title: z.string().min(1, "Quiz title is required"),
  description: z.string().optional(),

  questionCategories: z.array(z.object({
    slug: z.string(),
    label: z.string().min(1, "Category label is required"),
    description: z.string().optional(),
    sortOrder: z.number(),
    questions: z.array(z.object({
      slug: z.string(),
      text: z.string().min(1, "Question text is required"),
      category: z.string(),
      sortOrder: z.number(),
      
      options: z.array(z.object({
        slug: z.string(),
        sortOrder: z.number(),
        text: z.string().min(1, "Question text is required"),
        points: z.number().min(0, "Points must be a positive number"),
      }))
    }))
  })).min(1, "At least one question is required")
});

export type QuizFormValues = z.infer<typeof quizSchema>;

export const QuizForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      questionCategories: [],
    },
  });

  const { control, handleSubmit, register, watch, setValue, formState: { errors },} = form

  const { fields: categoryFields, append: appendCategory, remove: removeCategory, } = useFieldArray({
    control,
    name: "questionCategories",
  })

  const handleTitleChange = (value: string) => {
    setValue("title", value)
    const slug = slugify(value, { lower: true, strict: true })
    setValue("slug", slug)
  }

  const utils = api.useUtils();

  const createQuiz = api.quiz.createQuiz.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
    },
  });

  const onSubmit = async (values: QuizFormValues) => {
    setLoading(true);

    try {
      const response = await createQuiz.mutateAsync({
        title: values.title,
        slug: values.slug,
        description: values.description || "",
        published: false,
        questionCategories: values.questionCategories,
      });
      if (!response) throw new Error();

      toast("Quiz created successfully", {
        description: `Quiz: ${values.title}`,
      });

      router.push(`/dashboard/quizzes/${response.objectGuid}`);
    } catch (error: any) {
      toast.error("Could not create quiz", {
        description: `Quiz: ${values.title}`,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const addCategory = () => {
    appendCategory({
      slug: "",
      label: "",
      description: "",
      questions: [],
      sortOrder: watch("questionCategories").length
    })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input className="" placeholder="Enter quiz title" {...field} onChange={(e) => handleTitleChange(e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Auto-generated from title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter quiz description" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Categories</h2>
              <Button type="button" onClick={addCategory} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {categoryFields.map((category, categoryIndex) => (
              <CategorySection
                key={category.id}
                categoryIndex={categoryIndex}
                control={control}
                register={register}
                watch={watch}
                setValue={setValue}
                onRemove={() => removeCategory(categoryIndex)}
              />
            ))}

            {categoryFields.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No categories added yet</p>
                  <Button type="button" onClick={addCategory} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Category
                  </Button>
                </CardContent>
              </Card>
            )}

            {errors.title && <p className="text-sm text-destructive">{errors.questionCategories?.message}</p>}
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Creating Quiz..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}