import Balance from "react-wrap-balancer";

import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/utils";

function PageLayout({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-screen w-full lg:grid ease transform-gpu transition-all duration-100 will-change-transform bg-background", className)}
      {...props}>
      {children}
    </div>
  );
}
function Page({
  className,
  children,
  admin = false,
  paddingTop = true,
  gradientBackground,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { admin?: boolean; paddingTop?: boolean; gradientBackground?: boolean }) {
  return admin ? (
    <main className={cn("space-y-6", className)} {...props}>
      {children}
    </main>
  ) : (
    <main
      className={cn(
        "relative mx-auto flex flex-col space-y-6",
        paddingTop && "pt-24",
        gradientBackground && "min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50",
        className
      )}
      {...props}>
      {children}
    </main>
  );
}

function PageHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("mx-auto flex flex-col gap-1", className)} {...props}>
      {children}
      <Divider />
    </section>
  );
}

function PageHeaderHeading({ className, secondary, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { secondary?: boolean }) {
  return secondary ? (
    <h3 className={cn("text-left text-2xl font-bold leading-tight tracking-tighter lg:leading-[1.1]", className)} {...props} />
  ) : (
    <h1 className={cn("text-left text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1]", className)} {...props} />
  );
}

function PageHeaderDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <Balance className={cn("text-sm text-primary/80 leading-tight tracking-tighter", className)} {...props} />;
}

function PageActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex w-full items-center justify-center space-x-2 py-4 md:pb-10", className)} {...props} />;
}

export { Page, PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading, PageLayout };
