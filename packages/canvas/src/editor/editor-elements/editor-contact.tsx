import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { upsertContact } from "@/db/queries/contacts";
import { saveActivityLogsNotification } from "@/db/queries/notifications";

import EditorContactForm from "@/components/forms/editor-contact-form";
import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@workspace/ui/components/badge";

import type { ContactDetailsSchema } from "@/components/forms/editor-contact-form";
import { CanvasDB } from "@/db/canvas-db";
import type { EditorElement } from "@/lib/types/editor";
import { GenerateUUID } from "@/lib/uuid";
import { cn } from "@workspace/ui/lib/utils";

interface EditorContactForm {
  db: CanvasDB;
  element: EditorElement;
}

const EditorContact: React.FC<EditorContactForm> = ({ element, db }) => {
  const router = useRouter();
  const {
    dispatch,
    editor: editorState,
    subAccountId,
    funnelId,
    pageDetails,
  } = useEditor();
  const { editor } = editorState;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();

    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const onFormSubmit = async (values: ContactDetailsSchema) => {
    if (editor.liveMode || editor.previewMode) {
      try {
        const response = await upsertContact({db,
          contact: {...values, objectGuid: GenerateUUID()},
        });

        await saveActivityLogsNotification({db,
          description: `A New contact signed up | ${response?.name}`,
        });
        
        toast.success("Success", {
          description: "Successfully saved your info",
        });

      } catch (error) {
        toast.error("Failed", {
          description: "Could not save your information",
        });
      }
    }
  };

  return (
    <div
      onClick={handleOnClickBody}
      className={cn(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "border-blue-500": editor.selectedElement.id === element.id,

          "border-solid": editor.selectedElement.id === element.id,
          "!border-dashed !border": !editor.liveMode,
        }
      )}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
          {editor.selectedElement.name}
        </Badge>
      )}

      {!Array.isArray(element.content) && (
        <EditorContactForm
          title={element.content.formTitle as string}
          subTitle={element.content.formDescription as string}
          buttonText={element.content.formButton as string}
          styles={element.styles}
          apiCall={onFormSubmit}
        />
      )}
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={handleDeleteElement}
          />
        </div>
      )}
    </div>
  );
};

export default EditorContact;
