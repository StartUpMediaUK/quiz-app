import { File, X } from "lucide-react";
import Image from "next/image";
import React from "react";


import { Button } from "@workspace/ui/components/button";

interface FileUploadProps {
  uploadFile: (file: File) => Promise<string>;
  onChange: (url?: string) => void;
  value: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  uploadFile,
  onChange,
  value,
}) => {
  const fileFormat = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center gap-2">
        {fileFormat !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              className="object-contain"
              fill
              alt="Uploaded image"
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <File aria-hidden />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreffer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange("")} variant="ghost" type="button" className="flex items-center gap-2">
          <X aria-hidden className="h-4 w-4" />
          Remove Image
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30 rounded-md border border-dashed p-4 flex flex-col items-center justify-center">
      <label className="cursor-pointer w-full h-32 flex flex-col items-center justify-center border border-dashed rounded-md hover:bg-muted/20 transition-all">
        <span className="text-sm text-muted-foreground">Click or drag a file to upload</span>
        <input
          type="file"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              const url = await uploadFile(file);
              onChange(url);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </label>
    </div>
  );
};

export default FileUpload;
