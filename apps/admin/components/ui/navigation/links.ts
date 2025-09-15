import { siteConfig } from "@/lib/config/site";
import { RiSettings2Fill, RiSurveyFill, RiTableView } from "@remixicon/react";
import type { Navigation } from "./types";

export const navigation: Navigation[] = [
  { name: "Quiz", href: siteConfig.baseLinks.quizzes, icon: { type: "icon", avatar: RiSurveyFill }, active: "static" },
  { name: "Submissions", href: siteConfig.baseLinks.submissions, icon: { type: "icon", avatar: RiTableView }, active: "static" },
  { name: "Settings", href: siteConfig.baseLinks.settings, icon: { type: "icon", avatar: RiSettings2Fill }, active: "static" },
] as const;