import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import slugify from "slugify";
import { QuestionSection } from "./_question-section";
import { QuizFormValues } from "./form";

interface CategorySectionProps  {
  categoryIndex: number
  control: Control<QuizFormValues>
  register: UseFormRegister<QuizFormValues>
  watch: UseFormWatch<QuizFormValues>
  setValue: UseFormSetValue<QuizFormValues>
  onRemove: () => void
}

export function CategorySection({
  categoryIndex,
  control,
  register,
  watch,
  setValue,
  onRemove,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
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
      slug: "",
      text: "",
      sortOrder: watch(`questionCategories.${categoryIndex}.questions`).length,
      category: watchedCategoryLabel || "",
      options: [],
    })
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer flex-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <GripVertical className="w-4 h-4 text-muted-foreground" />
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

            {questionFields.map((question, questionIndex) => (
              <QuestionSection
                key={question.id}
                categoryIndex={categoryIndex}
                questionIndex={questionIndex}
                control={control}
                register={register}
                watch={watch}
                setValue={setValue}
                onRemove={() => removeQuestion(questionIndex)}
              />
            ))}

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