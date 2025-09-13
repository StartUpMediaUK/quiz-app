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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import slugify from "slugify";
import { QuestionSection } from "./_question-section";
import { EditQuizFormValues } from "./forms/edit-form";

interface CategorySectionProps  {
  id: string;
  categoryIndex: number
  control: Control<EditQuizFormValues>
  register: UseFormRegister<EditQuizFormValues>
  watch: UseFormWatch<EditQuizFormValues>
  errors: FieldErrors<EditQuizFormValues>
  setValue: UseFormSetValue<EditQuizFormValues>
  onRemove: () => void
  dragHandleProps?: any;
}

export function CategorySection({
  categoryIndex,
  control,
  register,
  watch,
  errors,
  setValue,
  onRemove,
  dragHandleProps
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(false)
    const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
    move: moveQuestion,
  } = useFieldArray({
    control,
    name: `questionCategories.${categoryIndex}.questions`,
  })

  const watchedCategoryLabel = watch(`questionCategories.${categoryIndex}.label`)

  const handleCategoryLabelChange = (value: string) => {
    setValue(`questionCategories.${categoryIndex}.label`, value)
      setValue(`questionCategories.${categoryIndex}.slug`, slugify(value, { lower: true, strict: true }))
  }

  const addQuestion = () => {
    appendQuestion({
      objectGuid: "",
      sortOrder: watch(`questionCategories.${categoryIndex}.questions`).length,
      slug: "",
      text: "",
      category: watchedCategoryLabel || "",
      options: [],
    })
  }

  const handleQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = questionFields.findIndex((item) => item.id === active.id)
      const newIndex = questionFields.findIndex((item) => item.id === over?.id)

      moveQuestion(oldIndex, newIndex)

      const reorderedQuestions = arrayMove(questionFields, oldIndex, newIndex)
      reorderedQuestions.forEach((_, index) => {
        setValue(`questionCategories.${categoryIndex}.questions.${index}.sortOrder`, index)
      })
    }
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer flex-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Category {categoryIndex + 1}</CardTitle>
            </div>
          </CollapsibleTrigger>
          <Button type="button" onClick={onRemove} variant="ghost" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CollapsibleContent>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`questionCategories.${categoryIndex}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated from title" {...field} onChange={(e) => handleCategoryLabelChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`questionCategories.${categoryIndex}.slug`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated from label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={control}
            name={`questionCategories.${categoryIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter category description" rows={2} {...field}  value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleQuestionDragEnd}>
              <SortableContext items={questionFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                {questionFields.map((question, questionIndex) => (
                  <SortableQuestionSection
                    key={question.id}
                    id={question.id}
                    categoryIndex={categoryIndex}
                    questionIndex={questionIndex}
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                    onRemove={() => removeQuestion(questionIndex)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {questionFields.length === 0 && (
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-2">No questions in this category</p>
                <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            )}
          </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function SortableQuestionSection(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionSection {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}