"use client"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { QuizCellAction } from "./cell-action";

export type QuizColumn = {
  id: string;
  title: string;
  questions?: number;
  published: boolean;
};
export const quizColumns: ColumnDef<QuizColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Title" />
    },
  },
  {
    accessorKey: "questions",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Questions" />
    },
  },
  {
    accessorKey: "published",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Published" />
    },
  },
  {
    id: "table_actions",
    cell: ({ row }) => {
      return (
        <QuizCellAction data={row.original} />
      )
    },
  }
];
