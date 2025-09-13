"use client"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer-2";
import { type ReactNode } from "react";

interface DataTableDrawerProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  body: string | ReactNode;
  footer?: string | ReactNode;
  useDrawer: UseDrawer;
}

import type { UseDrawer } from "@/lib/types/drawer";

export function DataTableDrawer({ title, description, footer, body, useDrawer }: DataTableDrawerProps) {

  return (
    <Drawer open={useDrawer.isOpen} onOpenChange={(open) => useDrawer.changeState(open)}>
      <DrawerContent className="overflow-hidden dark:bg-gray-925">
        <DrawerHeader className="-px-6 w-full">
          <DrawerTitle className="flex w-full items-center justify-between">{title}
          </DrawerTitle>
          {description && <DrawerDescription> {description} </DrawerDescription>}
        </DrawerHeader>
        <DrawerBody className="overflow-y-scroll">
          {body}
        </DrawerBody>
        <DrawerFooter className="-mx-6 -mb-2 gap-2 bg-white px-6 dark:bg-gray-925">
          {footer}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
