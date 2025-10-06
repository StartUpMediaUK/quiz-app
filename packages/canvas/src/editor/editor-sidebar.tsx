"use client";

import { Database, PlusCircle, Settings, SquareStack } from "lucide-react";
import React from "react";

import { useEditor } from "@/hooks/use-editor";
import { Sheet, SheetContent } from "@workspace/ui/components/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import ComponentsTab from "./editor-tabs/components-tab/components-tab";
import LayersTab from "./editor-tabs/layers-tab";
import MediaTab from "./editor-tabs/media-tab";
import SettingsTab from "./editor-tabs/SettingsTab";

import { CanvasDB } from "@/db/canvas-db";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";

interface EditorSidebarProps {
  db: CanvasDB
  subAccountId: string;
}

type TabsName = "Settings" | "Components" | "Layers" | "Media";

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  db,
  subAccountId,
}) => {
  const { editor } = useEditor();

  const handleSaveTabStorage = (tab: TabsName) => {
    localStorage.setItem("funnel-tab-name", tab);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Sheet open modal={false}>
        <Tabs
          className="w-full"
          defaultValue={localStorage.getItem("funnel-tab-name") || "Settings"}
          onValueChange={(value) => handleSaveTabStorage(value as TabsName)}
        >
          <SheetContent
            showClose={false}
            side="right"
            className={cn(
              "mt-[101px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden",
              {
                hidden: editor.editor.previewMode,
              }
            )}
          >
            <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Settings"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Settings />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={16}>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Components"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <PlusCircle />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={16}>
                  <p>Components</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Layers"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <SquareStack />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={16}>
                  <p>Layers</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Media"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Database />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={16}>
                  <p>Media</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </SheetContent>

          <SheetContent
            showClose={false}
            side="right"
            className={cn(
              "mt-[101px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden",
              {
                hidden: editor.editor.previewMode,
              }
            )}
          >
            <div className="grid gap-4 h-full pb-28">
              <ScrollArea>
                <TabsContent value="Settings">
                  <SettingsTab />
                </TabsContent>
                <TabsContent value="Media">
                  <MediaTab db={db} accountId={subAccountId} />
                </TabsContent>
                <TabsContent value="Components">
                  <ComponentsTab />
                </TabsContent>
                <TabsContent value="Layers">
                  <LayersTab />
                </TabsContent>
              </ScrollArea>
            </div>
          </SheetContent>
        </Tabs>
      </Sheet>
    </TooltipProvider>
  );
};

export default EditorSidebar;
