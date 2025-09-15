export const siteConfig = {
  name: "Quiz App",
  url: "https://quiz.app",
  description: "A interactive quiz application.",
  baseLinks: {
    home: "/",
    submissions: "/submissions",
    quizzes: "/quizzes",
    settings: "/settings",
    auth: {
      signIn: "/sign-in",
    },
  },
  externalLinks: {
    mainSite: process.env.NEXT_PUBLIC_APP_PUBLIC_URL ?? "",
  },
};
