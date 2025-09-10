import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import type { SocialProvider } from "@/lib/types/social-provider";
import { cn } from "@/lib/utils";
import { RiGoogleFill } from "@remixicon/react";

export function SocialSignButtons() {
    const socialProviders: { provider: SocialProvider; icon: React.ReactNode }[] = [
      { provider: "google", icon: <RiGoogleFill className="size-5" aria-hidden={true} /> },
      // { provider: "microsoft", icon: <MicrosoftIcon /> },
      // { provider: "twitter", icon: <TwitterIcon /> },
      // { provider: "apple", icon: <AppleIcon /> },
      // { provider: "facebook", icon: <FacebookIcon /> },
    ];
  
    return (
      <div className={cn("flex w-full flex-wrap items-center justify-between gap-2")}>
        {socialProviders.map(({ provider, icon }) => (
          <Button
            key={provider}
            className="mt-4 w-full inline-flex items-center gap-2"
            onClick={async () => {
              await signIn.social({ provider, callbackURL: "/" });
            }}
            aria-label={`Sign in with ${provider}`}
          >
            {icon}
            Continue with Google
          </Button>
        ))}
      </div>
    );
  }