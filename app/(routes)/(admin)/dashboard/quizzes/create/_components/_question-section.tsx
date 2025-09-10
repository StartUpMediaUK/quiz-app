import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { OptionSection } from "./_options-section";
import { QuizFormValues } from "./form";

interface QuestionSectionProps  {
  categoryIndex: number
  questionIndex: number
  control: Control<QuizFormValues>
  register: UseFormRegister<QuizFormValues>
  watch: UseFormWatch<QuizFormValues>
  setValue: UseFormSetValue<QuizFormValues>
  onRemove: () => void
}
export function QuestionSection({
  categoryIndex,
  questionIndex,
  control,
  register,
  watch,
  setValue,
  onRemove,
}: QuestionSectionProps) {
    const [isOpen, setIsOpen] = useState(true)
  
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questionCategories.${categoryIndex}.questions.${questionIndex}.options`,
  })

  const questionsBeforeCurrent = watch("questionCategories")
  .slice(0, categoryIndex) 
  .reduce((sum, cat) => sum + (cat.questions?.length ?? 0), 0);
  const watchedCategoryLabel = watch(`questionCategories.${categoryIndex}.label`)

  const handleQuestionTextChange = (value: string) => {
    setValue(`questionCategories.${categoryIndex}.questions.${questionIndex}.text`, value)
    setValue(`questionCategories.${categoryIndex}.questions.${questionIndex}.category`, watchedCategoryLabel || "")
    if (!watch(`questionCategories.${categoryIndex}.questions.${questionIndex}.slug`)) {
      setValue(`questionCategories.${categoryIndex}.questions.${questionIndex}.slug`, `question-${questionsBeforeCurrent + (questionIndex + 1)}`)
    }
  }

  const addOption = () => {
    appendOption({
      slug: "",
      text: "",
      sortOrder: watch(`questionCategories.${categoryIndex}.questions.${questionIndex}.options`).length,
      points: 0,
    })
  }

  return (
    <Card className="ml-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer flex-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-lg">Question {questionsBeforeCurrent + (questionIndex + 1)}</CardTitle>
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
                name={`questionCategories.${categoryIndex}.questions.${questionIndex}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter question text" {...field} onChange={(e) => handleQuestionTextChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`questionCategories.${categoryIndex}.questions.${questionIndex}.slug`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-generated from text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Answer Options</h4>
                <Button type="button" onClick={addOption} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>

              {optionFields.map((option, optionIndex) => (
                <OptionSection
                  key={option.id}
                  categoryIndex={categoryIndex}
                  questionIndex={questionIndex}
                  optionIndex={optionIndex}
                  register={register}
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  onRemove={() => removeOption(optionIndex)}
                />
              ))}

              {optionFields.length === 0 && (
                <div className="border border-dashed border-muted rounded p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No options added</p>
                  <Button type="button" onClick={addOption} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
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