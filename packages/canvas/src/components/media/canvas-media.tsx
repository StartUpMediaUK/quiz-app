import { FolderOpen } from "lucide-react";
import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import MediaCard from "./media-card";
import MediaUploadButton from "./media-upload-button";

import { CanvasDB } from "@/db/canvas-db";
import { Media as MediaType } from "@prisma/client";
import { cn } from "@workspace/ui/lib/utils";

interface MediaProps {
  db: CanvasDB;
  subAccountId: string;
  data: MediaType[];
  headerClassName?: string;
}

export const Media: React.FC<MediaProps> = ({ db, subAccountId, data, headerClassName }) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className={cn("flex justify-between items-center", headerClassName)}>
        <h1 className="text-3xl font-bold">Media Bucket</h1>
        <MediaUploadButton db={db} subAccountId={subAccountId} />
      </div>
      <Command className="px-6 py-4">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="pb-40 max-h-full">
          {!!data?.length && (
            <CommandEmpty>No media files found.</CommandEmpty>
          )}
          <CommandGroup>
            <div className="flex flex-wrap gap-4 pt-4 bg-transparent">
              {data?.map((file) => (
                <CommandItem
                  key={file.id}
                  className="p-0 max-w-[300px] w-full bg-transparent rounded-lg font-medium text-white"
                >
                  <MediaCard db={db} file={file} />
                </CommandItem>
              ))}
              {!data?.length && (
                <div className="flex items-center justify-center w-full flex-col gap-2 pb-10">
                  <FolderOpen className="text-muted-foreground w-32 h-32" />
                  <p className="text-muted-foreground text-xs font-medium text-center">
                    Your media bucket is empty. No files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};