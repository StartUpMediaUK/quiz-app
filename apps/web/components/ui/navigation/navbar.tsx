"use client"

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import useScroll from "@/lib/useScroll";
import { cn } from "@/lib/utils";
import { RiCloseFill, RiMenuFill } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(15);

  const pathname = usePathname();

  if (pathname.includes("/quiz")) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl justify-center rounded-lg border border-transparent px-3 py-3 transition duration-300",
        scrolled || open ? "border-gray-200/50 bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-sm" : "bg-white/0"
      )}>
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Home">
            <span className="text-3xl font-bold font-serif">Nerissa Golden</span>
          </Link>
          <nav className="hidden sm:block md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link className="px-2 py-1 text-gray-900" href="#discover">
                Discover
              </Link>
              <Link className="px-2 py-1 text-gray-900" href="#about">
                About
              </Link>
              <Link className="px-2 py-1 text-gray-900" href="#quiz">
                Quiz
              </Link>
            </div>
          </nav>
          <div className="flex items-center space-x-2">
            <Button className="hidden h-10 font-semibold sm:block bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link target="_blank" href={siteConfig.externalLinks.liveFearlessBook}>
                Buy the book
              </Link>
            </Button>
            <Button variant="outline" className="hidden h-10 font-semibold sm:block" asChild>
              <Link target="_blank" href="https://nerissagolden.com">
                Go to site
              </Link>
            </Button>
          </div>
          <Button
            onClick={() => setOpen(!open)}
            variant="secondary"
            className="p-1.5 sm:hidden"
            aria-label={open ? "CloseNavigation Menu" : "Open Navigation Menu"}>
            {!open ? (
              <RiMenuFill className="size-6 shrink-0 text-gray-900" aria-hidden />
            ) : (
              <RiCloseFill className="size-6 shrink-0 text-gray-900" aria-hidden />
            )}
          </Button>
        </div>
        <nav className={cn("mt-6 flex flex-col gap-6 text-lg ease-in-out will-change-transform sm:hidden", open ? "" : "hidden")}>
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <Link href="#discover">Discover</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="#about">About</Link>
            </li>
          </ul>
          <Button variant="secondary" className="text-lg" asChild>
            <Link href="https://nerissagolden.com">Buy the book!</Link>
          </Button>
          <Button variant="secondary" className="text-lg" asChild>
            <Link href="https://nerissagolden.com">Go to site</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
