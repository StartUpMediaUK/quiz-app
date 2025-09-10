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
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { OptionSection } from "./_options-section";
import { EditQuizFormValues } from "./forms/edit-form";

interface QuestionSectionProps  {
  categoryIndex: number
  questionIndex: number
  control: Control<EditQuizFormValues>
  register: UseFormRegister<EditQuizFormValues>
  errors: FieldErrors<EditQuizFormValues>
  watch: UseFormWatch<EditQuizFormValues>
  setValue: UseFormSetValue<EditQuizFormValues>
  onRemove: () => void
  dragHandleProps?: any
}
export function QuestionSection({
  categoryIndex,
  questionIndex,
  control,
  register,
  errors,
  watch,
  setValue,
  onRemove,
  dragHandleProps
}: QuestionSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
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
      sortOrder: watch(`questionCategories.${categoryIndex}.questions.${questionIndex}.options`).length,
      objectGuid: "",
      slug: "",
      text: "",
      points: 0,
    })
  }

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = optionFields.findIndex((item) => item.id === active.id)
      const newIndex = optionFields.findIndex((item) => item.id === over?.id)

      moveOption(oldIndex, newIndex)

      const reorderedOptions = arrayMove(optionFields, oldIndex, newIndex)
      reorderedOptions.forEach((_, index) => {
        setValue(`questionCategories.${categoryIndex}.questions.${questionIndex}.options.${index}.sortOrder`, index)
      })
    }
  }

  return (
    <Card className="ml-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer flex-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>
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

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOptionDragEnd}>
                <SortableContext items={optionFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                  {optionFields.map((option, optionIndex) => (
                    <SortableOptionSection
                      key={option.id}
                      id={option.id}
                      categoryIndex={categoryIndex}
                      questionIndex={questionIndex}
                      optionIndex={optionIndex}
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      errors={errors}
                      onRemove={() => removeOption(optionIndex)}
                    />
                  ))}
                </SortableContext>
              </DndContext>

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

function SortableOptionSection(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <OptionSection {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}