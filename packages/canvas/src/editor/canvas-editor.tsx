"use client";

import { type CanvasPage } from "@prisma/client";
import { EyeOff } from "lucide-react";
import React from "react";

import EditorRecursive from "./editor-elements/editor-recursive";

import { CanvasDB } from "@/db/canvas-db";
import { useEditor } from "@/hooks/use-editor";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface CanvasEditorProps {
  db: CanvasDB;
  funnelPageId: string;
  liveMode?: boolean;
  funnelPageDetails: CanvasPage;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  db,
  funnelPageId,
  liveMode,
  funnelPageDetails,
}) => {
  const { editor, dispatch } = useEditor();

  React.useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  React.useEffect(() => {
    if (!funnelPageDetails) return undefined;

    dispatch({
      type: "LOAD_DATA",
      payload: {
        elements: funnelPageDetails.content
          ? JSON.parse(funnelPageDetails.content)
          : "",
        withLive: !!liveMode,
      },
    });
  }, [funnelPageId]);

  const handleClickElement = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handlePreview = () => {
    dispatch({ type: "TOGGLE_LIVE_MODE" });
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
  };

  return (
    <div
      className={cn(
        "h-screen overflow-y-hidden overflow-x-hidden mr-[385px] z-[999999] bg-background scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium",
        {
          "p-0 mr-0": editor.editor.previewMode || editor.editor.liveMode,
          "!w-[850px] mx-auto": editor.editor.device === "Tablet",
          "!w-[420px] mx-auto": editor.editor.device === "Mobile",
          "pb-[100px] use-automation-zoom-in transition-all": !editor.editor.previewMode && !editor.editor.liveMode, // for scroll
        }
      )}
      onClick={handleClickElement}
    >
      {editor.editor.previewMode && editor.editor.liveMode && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 z-[100]"
          onClick={handlePreview}
          title="Back to editor"
        >
          <EyeOff aria-label="Back to editor" className="w-4 h-4" />
        </Button>
      )}

      {Array.isArray(editor.editor.elements) &&
        editor.editor.elements.map((element) => (
          <EditorRecursive key={element.id} element={element} db={db} />
        ))}
    </div>
  );
};

export default CanvasEditor;
