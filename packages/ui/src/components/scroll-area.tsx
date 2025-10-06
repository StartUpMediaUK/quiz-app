"use client"

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

function ScrollArea({
  className,
  children,
  scrollShadow = true,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  scrollShadow?: boolean;
}) {
  const [isTopShadowVisible, setIsTopShadowVisible] =
    React.useState<boolean>(false);
  const [isBottomShadowVisible, setIsBottomShadowVisible] =
    React.useState<boolean>(true);

  const handleScroll = (event: React.UIEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setIsTopShadowVisible(scrollTop > 0);
    setIsBottomShadowVisible(scrollTop + clientHeight < scrollHeight);
  };
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
        onScroll={handleScroll}
      >
        {children}
        {scrollShadow && (
          <>
            <div
              className={cn(
                "opacity-0 absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent w-full transition-opacity rounded-[inherit]",
                {
                  "opacity-100": isTopShadowVisible,
                }
              )}
            />
            <div
              className={cn(
                "opacity-0 absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent w-full transition-opacity rounded-[inherit]",
                {
                  "opacity-100": isBottomShadowVisible,
                }
              )}
            />
          </>
        )}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar };

