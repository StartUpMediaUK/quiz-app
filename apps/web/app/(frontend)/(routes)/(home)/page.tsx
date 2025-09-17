import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Page } from "@/components/ui/layout/page-layout";
import { ArrowRight, BookOpen, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Home } from "@/lib/types/payload";
import FearlessBook from "@/public/images/live-fearless-book.png";
import Image from "next/image";
import Link from "next/link";

const PAYLOAD_API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_PUBLIC_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://admin.fearless.nerissagolden.com");

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
  const home: Home = await getHomePageData();

  if (!home) return <p>Homepage content not found</p>;

  return (
    <Page paddingTop={false}>
      <section id="discover" className="relative bg-gradient-to-br from-background to-muted py-40">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl text-center lg:text-left font-bold text-foreground leading-tight text-balance">
                  {home.heroTitle}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed text-center lg:text-left text-pretty">{home.heroSubtitle}</p>
              </div>

              <div className="flex flex-col items-center justify-center lg:justify-start sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href={home?.primaryCTA?.link ?? ""}>
                    {home?.primaryCTA?.text} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link target="_blank" href={home?.secondaryCTA?.link ?? ""}>
                    {home?.secondaryCTA?.text} <BookOpen className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-xl">
                <Image
                  width={400}
                  height={400}
                  src={home?.heroImage ?? FearlessBook.src}
                  alt="Live Fearless book cover"
                  className="w-full max-w-sm mx-auto rounded-lg"
                />
              </div>
              <Badge className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold">
                {home?.badgeText}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">{home?.featuresTitle}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{home?.featuresSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {home?.features?.length &&
              home.features.map((feature: any) => (
                <Card key={feature?.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="bg-muted rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">{home?.discoverBlock?.discoverTitle}</h3>
                <ul className="space-y-3 text-muted-foreground">
                  {home?.discoverBlock?.items?.length &&
                    home?.discoverBlock?.items?.length > 0 &&
                    home?.discoverBlock.items.map((item: any) => (
                      <li key={item?.id} className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {item.text}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <blockquote className="text-lg italic text-foreground mb-4">"{home?.discoverBlock?.testimonial?.quote}"</blockquote>
                <cite className="text-sm text-muted-foreground">— {home?.discoverBlock?.testimonial?.author}</cite>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="quiz" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">{home?.quiz?.quizTitle}</h2>
              <p className="text-xl text-muted-foreground text-pretty">{home?.quiz?.quizSubtitle}</p>
            </div>

            <Card className="bg-background border-border shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-foreground">{home?.quiz?.quizHeading}</h3>
                    <p className="text-muted-foreground leading-relaxed">{home?.quiz?.quizDescription}</p>

                    <ul className="space-y-3">
                      {home?.quiz?.quizBenefits?.length &&
                        home?.quiz?.quizBenefits?.length > 0 &&
                        home?.quiz?.quizBenefits.map((benefit: any) => (
                          <li key={benefit?.id} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit.text}</span>
                          </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                        <Link href={home?.quiz?.quizCTA?.link ?? ""}>
                          {home?.quiz?.quizCTA?.text} <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">{home?.quiz?.ctaNote}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
                      <div className="text-6xl font-bold text-primary mb-2">{home?.quiz?.quizStats?.duration}</div>
                      <div className="text-lg font-semibold text-foreground mb-1">Minutes</div>
                      <div className="text-sm text-muted-foreground mb-6">to transform your perspective</div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-background rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">{home?.quiz?.quizStats?.questions}</div>
                          <div className="text-xs text-muted-foreground">Questions</div>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">{home?.quiz?.quizStats?.personalized}</div>
                          <div className="text-xs text-muted-foreground">Personalized</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Page>
  );
}
