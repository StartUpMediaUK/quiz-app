'use client';

import React from "react";

import { getMedia } from "@/db/queries/media";

import { Media } from "@/components/media/canvas-media";
import { CanvasDB } from "@/db/canvas-db";
import { useModal } from "@/hooks/use-modal";
import { Media as MediaType } from "@prisma/client";

interface MediaTabProps {
  db: CanvasDB;
  accountId: string;
}

const MediaTab: React.FC<MediaTabProps> = ({ accountId, db }) => {
  const [data, setData] = React.useState<MediaType[]>([]);
  const { data: modalData } = useModal(); // only for updating media data

  React.useEffect(() => {
    const fetchMedia = async () => {
      const response = await getMedia({ accountId, db});

      setData(response);
    };

    fetchMedia();
  }, [accountId, modalData]);

  return (
    <div className="min-h-[900px] overflow-auto p-4">
      <Media
        db={db}
        data={data}
        subAccountId={accountId}
        headerClassName="flex flex-col gap-2 text-xl"
      />
    </div>
  );
};

export default MediaTab;
