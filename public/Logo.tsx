import Image from "next/image";

import logo from "@/public/images/ng-logo (4).png";

export const Logo = () => <Image src={logo.src} alt="NG Logo" width={100} height={100} />;
