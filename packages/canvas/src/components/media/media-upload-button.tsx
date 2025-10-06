"use client";

import { Upload } from "lucide-react";
import React from "react";

import { CanvasDB } from "@/db/canvas-db";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@workspace/ui/components//button";
import CustomModal from "../custom-modal";
import UploadMediaForm from "../forms/upload-media-form";

interface MediaUploadButtonProps {
  db: CanvasDB;
  subAccountId: string;
}

const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({
  db,
  subAccountId,
}) => {
  const { isOpen, setOpen, setClose } = useModal();

  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal
            title="Upload Media"
            subTitle="Upload a file to your media bucket here."
            scrollShadow={false}
          >
            <UploadMediaForm db={db} accountId={subAccountId} />
          </CustomModal>
        )
      }
      className="inline-flex items-center gap-2"
    >
      <Upload className="w-4 h-4" />
      Upload media
    </Button>
  );
};

export default MediaUploadButton;
