import { siteConfig } from "@/lib/config/site"
import { RiSettings2Fill, RiSurveyFill } from "@remixicon/react"
import type { Navigation } from "./types"

export const navigation: Navigation[] = [
  { name: "Quiz", href: siteConfig.baseLinks.admin.quizzes, icon: {type: "icon", avatar: RiSurveyFill}, active: "static" },
  { name: "Settings", href: siteConfig.baseLinks.admin.settings, icon: {type: "icon", avatar: RiSettings2Fill}, active: "static" },
] as const