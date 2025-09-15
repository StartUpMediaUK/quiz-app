"use client"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { siteConfig } from "@/lib/config/site";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SubmissionCellAction } from "./cell-action";
export type SubmissionColumn = {
  id: string;
  quizId: string;
  quizVersion: number;
  quizVersionId: string;
  date: string;
  result: string;
  score: number;
};
export const columns: ColumnDef<SubmissionColumn>[] = [
  {
    id: "id",
  },
  {
    accessorKey: "quizVersion",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Quiz Version" />
    },
    cell: ({ row }) => <Link className="hover:underline group flex items-center space-x-1 text-sm" href={siteConfig.baseLinks.quizzes+`/${row.original.quizId}`+`?version=${row.original.quizVersionId}`}>
      <span className="group-hover:block hidden">Go to </span>
      v{row.original.quizVersion}
      <span className="group-hover:block hidden"><ArrowRight className="size-4" /></span>
    </Link>
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Score" />
    },
  },
  {
    accessorKey: "result",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Result" />
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Submission Date" />
    },
  },
  {
    id: "table_actions",
    cell: ({ row }) => {
      return (
        <SubmissionCellAction data={row.original} />
      )
    },
  }
];
