import { Button } from "@/components/ui/button"
import { Page } from "@/components/ui/layout/page-layout"
import Image from "next/image"
import Link from "next/link"

import Fearless3Stack from "@/public/images/live-fearless-3-stack.png"
import FearlessBook from "@/public/images/live-fearless-book.png"

const HomePage = () => {
  return (
    <Page>
      <div className="z-0 absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/15"></div>
      <section id="discover" className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid gap-16 grid-cols-1 lg:grid-cols-2 items-center">
            <div className="flex justify-center lg:justify-start relative">
              <div className="relative z-10">
                <Image
                  width={400}
                  height={400}
                  src={FearlessBook.src}
                  alt="The Reader's Journey Book Cover"
                  className="w-80 h-[480px] object-cover rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/10 rounded-3xl blur-3xl scale-110"></div>
            </div>

            <div className="text-center lg:text-left space-y-8">
              <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                Discover Your <span className="text-primary">Reading Path</span>
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
                <p>
                  Every reader is unique, with their own preferences, learning styles, and paths to understanding. This groundbreaking approach to
                  personal development recognizes that one size does not fit all when it comes to growth and self-discovery.
                </p>

                <p>
                  Through carefully crafted insights and personalized guidance, you&apos;ll uncover not just what to read, but how to read in a way
                  that transforms your understanding of yourself and the world around you.
                </p>

                <p>Join thousands of readers who have already discovered their unique path to personal growth and intellectual fulfillment.</p>
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                  <Link href="/quiz/start">Enhance Your Reading Experience</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative py-20 bg-gradient-to-r from-muted/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-serif font-bold text-foreground">About the Book</h3>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  &quot;The Reader&apos;s Journey&quot; isn&apos;t just another self-help book—it&apos;s a comprehensive guide that meets you where
                  you are in your personal development journey. Drawing from decades of research in psychology, learning theory, and reader
                  engagement, this book offers a fresh perspective on growth.
                </p>
                <p>
                  Each chapter builds upon the last, creating a cohesive narrative that helps you understand not just what makes you tick, but how to
                  harness that knowledge for meaningful change. The accompanying quiz serves as your personal compass, pointing you toward the
                  insights most relevant to your unique situation.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                width={Fearless3Stack.width}
                height={Fearless3Stack.height}
                src={Fearless3Stack.src}
                alt="Open book in warm lighting"
                className="w-80 h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="text-4xl font-serif font-bold text-foreground">Why Take the Quiz?</h3>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Reading is deeply personal. Your background, experiences, and natural inclinations all influence how you process information and apply
                new concepts to your life. Our personalized quiz doesn&apos;t just categorize you—it creates a detailed profile that helps you
                understand your unique learning style.
              </p>
              <p>
                By understanding whether you&apos;re a visual learner who benefits from diagrams and examples, a reflective reader who needs time to
                process concepts, or an action-oriented person who learns by doing, you can approach &quot;The Reader&apos;s Journey&quot; in a way
                that maximizes its impact on your life.
              </p>
              <p>
                The result? A more effective, engaging, and personally meaningful reading experience that translates into real-world growth and
                positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-5xl font-serif font-bold text-foreground">Discover Your Path</h3>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Your journey to deeper self-understanding and personal growth begins with a single step. Take our comprehensive quiz and unlock insights
              tailored specifically to your unique reading style.
            </p>
            <div className="pt-6">
              <Button asChild size="lg" className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                <Link href="/quiz/start">Take the Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

export default HomePage