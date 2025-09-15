"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuizWithVersion } from "@/lib/types/quiz";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import slugify from "slugify";
import { CategorySection } from "../_category-section";
import { ResultRangeSection } from "../_result-range-section";

interface EditQuizFormProps {
  data: QuizWithVersion;
}

const FormSchema = z.object({
  id: z.string(),
  objectGuid: z.string(),
  slug: z.string(),
  title: z.string().min(1, "Quiz title is required"),
  description: z.string(),
  resultRanges: z
    .array(
      z
        .object({
          objectGuid: z.string(),
          slug: z.string(),
          url: z.string(),
          label: z.string(),
          min: z.number().min(0, "Min must be a positive number"),
          max: z.number().min(0, "Max must be a positive number"),
        })
        .refine((data) => data.max >= data.min, { message: "Max must be greater than or equal to Min", path: ["max"] })
    )
    .min(1, "At least one result range is required"),
  questionCategories: z
    .array(
      z.object({
        objectGuid: z.string(),
        slug: z.string(),
        label: z.string().min(1, "Category label is required"),
        description: z.string().nullable(),
        sortOrder: z.number(),
        questions: z.array(
          z.object({
            objectGuid: z.string(),
            slug: z.string(),
            text: z.string().min(1, "Question text is required"),
            category: z.string(),
            sortOrder: z.number(),

            options: z.array(
              z.object({
                objectGuid: z.string(),
                sortOrder: z.number(),
                slug: z.string(),
                text: z.string().min(1, "Question text is required"),
                points: z.number().min(0, "Points must be a positive number"),
              })
            ),
          })
        ),
      })
    )
    .min(1, "At least one question is required"),
});

export type EditQuizFormValues = z.infer<typeof FormSchema>;

export function EditQuizForm({ data }: EditQuizFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data.id,
      objectGuid: data.objectGuid,
      slug: data.slug,
      description: data.version.description,
      title: data.version.title,
      resultRanges: data.version.resultRanges,
      questionCategories: data.version.questionCategories,
    },
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
    move: moveCategory,
  } = useFieldArray({
    control,
    name: "questionCategories",
  });
  const {
    fields: resultRangeFields,
    append: appendResultRange,
    remove: removeResultRange,
  } = useFieldArray({
    control,
    name: "resultRanges",
  });

  const handleTitleChange = (value: string) => {
    setValue("title", value);
    const slug = slugify(value, { lower: true, strict: true });
    setValue("slug", slug);
  };

  const utils = api.useUtils();

  const editQuiz = api.quiz.editQuiz.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
    },
  });

  const onSubmit = async (values: EditQuizFormValues) => {
    setLoading(true);

    try {
      const response = await editQuiz.mutateAsync({
        quizId: data.objectGuid,
        ...values,
      });

      if (!response) throw new Error();

      toast("Successfully edited quiz", {
        description: `title: ${values.title}`,
      });
    } catch (error: any) {
      toast.error("Could not edit quiz", {
        description: `title: ${values.title}`,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    appendCategory({
      objectGuid: "",
      slug: "",
      label: "",
      description: "",
      questions: [],
      sortOrder: watch("questionCategories").length,
    });
  };
  const addResultRange = () => {
    appendResultRange({
      objectGuid: "",
      slug: "",
      label: "",
      min: 0,
      max: 1,
      url: "",
    });
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = categoryFields.findIndex((item) => item.id === active.id);
      const newIndex = categoryFields.findIndex((item) => item.id === over?.id);

      moveCategory(oldIndex, newIndex);

      const reorderedCategories = arrayMove(categoryFields, oldIndex, newIndex);
      reorderedCategories.forEach((_, index) => {
        setValue(`questionCategories.${index}.sortOrder`, index);
      });
    }
  };

  return (
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

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
            <SortableContext items={categoryFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
              {categoryFields.map((category, categoryIndex) => (
                <SortableCategorySection
                  key={category.id}
                  id={category.id}
                  categoryIndex={categoryIndex}
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  onRemove={() => removeCategory(categoryIndex)}
                />
              ))}
            </SortableContext>
          </DndContext>

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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Results Range</h2>
            <Button type="button" onClick={addResultRange} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Result Range
            </Button>
          </div>

          {resultRangeFields.map((resultRange, resultRangeIndex) => (
            <ResultRangeSection
              key={resultRange.id}
              resultRangeIndex={resultRangeIndex}
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              onRemove={() => removeResultRange(resultRangeIndex)}
            />
          ))}

          {resultRangeFields.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No result ranges added yet</p>
                <Button type="button" onClick={addResultRange} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Result Range
                </Button>
              </CardContent>
            </Card>
          )}

          {errors.title && <p className="text-sm text-destructive">{errors.resultRanges?.message}</p>}
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Updating Quiz..." : "Update Quiz"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SortableCategorySection(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <CategorySection {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}