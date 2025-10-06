"use client";

import React from "react";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@workspace/ui/components/badge";
import EditorRecursive from "./editor-recursive";

import { CanvasDB } from "@/db/canvas-db";
import { type EditorElement } from "@/lib/types/editor";
import { cn } from "@workspace/ui/lib/utils";
import { Trash } from "lucide-react";

interface EditorSectionProps {
  db: CanvasDB;
  element: EditorElement;
}

const EditorSection: React.FC<EditorSectionProps> = ({ element, db}) => {
  const { content, type } = element;
  const { editor: editorState, dispatch } = useEditor();
  const { editor } = editorState;

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <section
      style={element.styles}
      className={cn("relative p-4 transition-all", {
        "h-fit": type === "container",
        "h-full": type === "__body",
        "m-4": type === "container",
        "border-blue-500":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-solid":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-dashed border": !editor.liveMode,
      })}
      id="innerContainer"
      onClick={handleOnClickBody}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
          {editor.selectedElement.name}
        </Badge>
      )}

      {Array.isArray(content) &&
        content.map((childElement) => (
          <EditorRecursive key={childElement.id} element={childElement} db={db} />
        ))}

      {editor.selectedElement.id === element.id &&
        !editor.liveMode &&
        editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer w-4 h-4"
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </section>
  );
};

export default EditorSection;
