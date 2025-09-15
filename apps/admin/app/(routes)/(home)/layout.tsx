"use client"
import React from "react"

import { cn } from "@/lib/utils"

import { Breadcrumbs } from "@/components/ui/navigation/breadcrumb"
import { Sidebar } from "@/components/ui/navigation/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }
  return (
    <div className="mx-auto max-w-screen-2xl bg-background">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={cn(isCollapsed ? "lg:pl-[60px]" : "lg:pl-64", "h-screen")}>
        <div className="px-6 lg:px-0 mt-5">
          <Breadcrumbs />
        </div>
        <main
          className={cn(
            "ease transform-gpu transition-all duration-100 will-change-transform",
            "h-11/12 w-full lg:grid ease transform-gpu transition-all duration-100 will-change-transform bg-background"
          )}>
          <div className="p-4 sm:p-6 lg:rounded-lg lg:border lg:border-gray-200 lg:dark:border-gray-900">
            <ScrollArea className="">{children}</ScrollArea>
          </div>
        </main>
        <div className="">
          <p className="text-center text-sm leading-5 text-gray-500 dark:text-gray-400">© 2025 Quiz App, Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
