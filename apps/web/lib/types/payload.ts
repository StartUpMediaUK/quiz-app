interface Home {
  id: string;
  createdAt: string;
  updatedAt: string;

  heroTitle: string;
  heroSubtitle?: string;
  primaryCTA?: {
    text?: string;
    link?: string;
  };
  secondaryCTA?: {
    text?: string;
    link?: string;
  };
  heroImage?: string;
  badgeText?: string;

  featuresTitle?: string;
  featuresSubtitle?: string;
  features?: {
    id?: string;
    title?: string;
    description?: string;
  }[];

  discoverBlock?: {
    discoverTitle?: string;
    items?: {
      id?: string;
      text?: string;
    }[];
    testimonial?: {
      quote?: string;
      author?: string;
    };
  };

  quiz?: {
    quizTitle: string;
    quizSubtitle?: string;
    quizHeading?: string;
    quizDescription?: string;
    quizBenefits?: {
      id?: string;
      text?: string;
    }[];
    quizCTA?: {
      text?: string;
      link?: string;
    };
    ctaNote?: string;
    quizStats?: {
      duration?: string;
      questions?: string;
      personalized?: string;
    };
  };
}

export type { Home };
