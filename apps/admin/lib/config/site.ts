export const siteConfig = {
  name: "Quiz App Dashboard",
  url: "https://admin.fearless.nerissagolden.com/",
  description: "A dashboard for NG quiz application.",
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
