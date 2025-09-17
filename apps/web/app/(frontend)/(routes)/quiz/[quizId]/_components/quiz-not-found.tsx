"use client"

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import Link from "next/link";

import { Logo } from "@/public/Logo";
import { useRouter } from "next/navigation";

export default function QuizNotFound() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link href={siteConfig.baseLinks.home}>
        <Logo />
      </Link>
      <p className="mt-6 text-4xl font-semibold text-amber-600 sm:text-5xl">Error 404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Quiz not found</h1>
      <p className="mt-2 text-sm text-gray-600">Sorry, we couldn’t find the quiz you’re looking for.</p>
      <Button className="group mt-8" variant="default" onClick={() => router.push("/")}>
        Go back
      </Button>
    </div>
  );
}
