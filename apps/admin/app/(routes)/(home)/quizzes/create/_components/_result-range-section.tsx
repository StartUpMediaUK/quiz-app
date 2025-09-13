import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import slugify from "slugify";
import { QuizFormValues } from "./form";

interface ResultRangeSectionProps  {
  resultRangeIndex: number
  control: Control<QuizFormValues>
  register: UseFormRegister<QuizFormValues>
  watch: UseFormWatch<QuizFormValues>
  setValue: UseFormSetValue<QuizFormValues>
  onRemove: () => void
}

export function ResultRangeSection({
  resultRangeIndex,
  control,
  register,
  watch,
  setValue,
  onRemove,
}: ResultRangeSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  const watchedResultRangeLabel = watch(`resultRanges.${resultRangeIndex}.label`)

  const handleResultRangeLabelChange = (value: string) => {
    setValue(`resultRanges.${resultRangeIndex}.label`, value)
      setValue(`resultRanges.${resultRangeIndex}.slug`, slugify(value, { lower: true, strict: true }))
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer flex-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-lg">Result Range {resultRangeIndex + 1}</CardTitle>
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
              name={`resultRanges.${resultRangeIndex}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result Range Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated from title" {...field} onChange={(e) => handleResultRangeLabelChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`resultRanges.${resultRangeIndex}.slug`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result Range Slug</FormLabel>
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
            name={`resultRanges.${resultRangeIndex}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Result Range Url</FormLabel>
                <FormControl>
                  <Input placeholder="Enter result range url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`resultRanges.${resultRangeIndex}.min`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Range Min</FormLabel>
                  <FormControl>
                    <NumberInput type="number" min={0} placeholder="0" {...field} value={field.value} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`resultRanges.${resultRangeIndex}.max`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Range Max</FormLabel>
                  <FormControl>
                    <NumberInput type="number" min={1} placeholder="1" {...field} value={field.value} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}