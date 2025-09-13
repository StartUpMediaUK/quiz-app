import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { Trash2 } from "lucide-react";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { QuizFormValues } from "./form";

interface OptionSectionProps  {
  categoryIndex: number
  questionIndex: number
  optionIndex: number
  control: Control<QuizFormValues>
  register: UseFormRegister<QuizFormValues>
  watch: UseFormWatch<QuizFormValues>
  setValue: UseFormSetValue<QuizFormValues>
  onRemove: () => void
}

export function OptionSection({
  categoryIndex,
  questionIndex,
  optionIndex,
  control,
  setValue,
  watch,
  onRemove,
}: OptionSectionProps) {
  const handleOptionTextChange = (value: string) => {
    setValue(`questionCategories.${categoryIndex}.questions.${questionIndex}.options.${optionIndex}.text`, value)
    if (!watch(`questionCategories.${categoryIndex}.questions.${questionIndex}.options.${optionIndex}.slug`)) {
      setValue(
        `questionCategories.${categoryIndex}.questions.${questionIndex}.options.${optionIndex}.slug`,
        `option-${optionIndex + 1}`
      )
    }
  }

  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`questionCategories.${categoryIndex}.questions.${questionIndex}.options.${optionIndex}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Option Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter option text" {...field} onChange={(e) => handleOptionTextChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`questionCategories.${categoryIndex}.questions.${questionIndex}.options.${optionIndex}.points`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points</FormLabel>
              <FormControl>
                <NumberInput type="number" min={0} placeholder="1" {...field} value={field.value} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`questionCategories.${categoryIndex}.questions.${questionIndex}.options.${optionIndex}.slug`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Option Slug</FormLabel>
              <FormControl>
                <Input placeholder="Auto-generated" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="button" onClick={onRemove} variant="ghost" size="sm" className="mt-6">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}