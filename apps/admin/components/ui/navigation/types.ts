import { type RemixiconComponentType } from "@remixicon/react"
import { type LucideProps } from "lucide-react"
import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react"

type LucideIconType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
type NavigationActive = "static" | "dynamic"

type ImageType = ReactNode;
type IconType = LucideIconType | RemixiconComponentType;
type AvatarType =
  | { type: "image"; avatar: ImageType }
  | { type: "src"; url: string }
  | { type: "icon"; avatar: IconType };


type Navigation = {name: string; href: string; active: NavigationActive; disabled?: boolean; icon: AvatarType}

export type { AvatarType, IconType, ImageType, LucideIconType, Navigation, NavigationActive }

