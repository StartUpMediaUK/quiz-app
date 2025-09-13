import { Button } from "@/components/ui/button";
import { Page } from "@/components/ui/layout/page-layout";
import Image from "next/image";
import Link from "next/link";

import Fearless3Stack from "@/public/images/live-fearless-3-stack.png";
import FearlessBook from "@/public/images/live-fearless-book.png";

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_PUBLIC_URL || "https://admin.fearless.nerissagolden.com";

async function getHomePageData() {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/api/home?limit=1`, {
      cache: "no-store", // optional for fresh content
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.docs?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch home page data:", err);
    return null;
  }
}

export default async function HomePage() {
  const home = await getHomePageData();

  if (!home) return <p>Homepage content not found</p>;

  return (
    <Page>
      <div className="z-0 absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/15"></div>

      {/* Hero Section */}
      <section id="discover" className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid gap-16 grid-cols-1 lg:grid-cols-2 items-center">
            <div className="flex justify-center lg:justify-start relative">
              <div className="relative z-10">
                <Image
                  width={400}
                  height={400}
                  src={home.heroImageUrl || FearlessBook.src}
                  alt="Hero Image"
                  className="w-80 h-[480px] object-cover rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/10 rounded-3xl blur-3xl scale-110"></div>
            </div>

            <div className="text-center lg:text-left space-y-8">
              <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                {home.heroTitle} <span className="text-primary">{home.heroSubtitle}</span>
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground max-w-2xl whitespace-pre-line">
                <p>{home.heroText}</p>
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                  <Link href={home.ctaLink}>{home.ctaText}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 bg-gradient-to-r from-muted/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-serif font-bold text-foreground">{home.aboutTitle}</h3>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                <p>{home.aboutText}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                width={400}
                height={400}
                src={home.aboutImageUrl || Fearless3Stack.src}
                alt="About Image"
                className="w-80 h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Take Quiz Section */}
      <section className="py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="text-4xl font-serif font-bold text-foreground">{home.whyTitle}</h3>
            <p className="space-y-6 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{home.whyText}</p>
          </div>
        </div>
      </section>

      {/* Discover Your Path Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-5xl font-serif font-bold text-foreground">{home.discoverTitle}</h3>
            <p className="text-xl leading-relaxed text-muted-foreground">{home.discoverText}</p>
            <div className="pt-6">
              <Button asChild size="lg" className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                <Link href={home.discoverCTALink}>{home.discoverCTA}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
