"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { siteConfig } from "@/lib/config/site";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const { useSession } = createAuthClient() 

export type DropdownUserProfileProps = {
  children: React.ReactNode
  align?: "center" | "start" | "end"
}

export function DropdownUserProfile({ children, align = "start" }: DropdownUserProfileProps) {
  const { data: session } = useSession()
  const user = session?.user

  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="!min-w-[calc(var(--radix-dropdown-menu-trigger-width))]">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value)
                }}
              >
                <DropdownMenuRadioItem
                  aria-label="Switch to Light Mode"
                  value="light"
                >
                  <Sun className="size-4 shrink-0" aria-hidden="true" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  aria-label="Switch to Dark Mode"
                  value="dark"
                >
                  <Moon className="size-4 shrink-0" aria-hidden="true" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  aria-label="Switch to System Mode"
                  value="system"
                >
                  <Monitor className="size-4 shrink-0" aria-hidden="true" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Changelog
            <ArrowUpRight
              className="mb-1 ml-1 size-3 shrink-0 text-gray-500 dark:text-gray-500"
              aria-hidden="true"
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Documentation
            <ArrowUpRight
              className="mb-1 ml-1 size-3 shrink-0 text-gray-500"
              aria-hidden="true"
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Join Slack community
            <ArrowUpRight
              className="mb-1 ml-1 size-3 shrink-0 text-gray-500"
              aria-hidden="true"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          
        {user ? (
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive bg-destructive-foreground">
            Sign out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer text-primary bg-primary-foreground" asChild>
            <Link href={siteConfig.baseLinks.admin.auth.signIn}>
              Sign In
            </Link>
          </DropdownMenuItem>
        )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
