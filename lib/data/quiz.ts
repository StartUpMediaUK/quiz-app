import { QuestionCategory, Quiz } from "@/lib/types/quiz";

const categories: QuestionCategory[] = [
  { id: "health-and-habits", label: "Health & Habits" },
  { id: "finances-and-order", label: "Finances & Order" },
  { id: "relationships-and-connection", label: "Relationships & Connection" },
  { id: "visibility-and-confidence", label: "Visibility & Confidence" },
  { id: "legacy-and-entrepreneurship", label: "Legacy & Entrepreneurship" },
]
export type CategoryId = typeof categories[number]["id"]

const quiz: Quiz = {
  id: "fearless-quiz",
  title: "Fearless Reading Quiz",
  description: "Discover your unique reading style and preferences.",
  questions: [
    {
      id: "question-1",
      text: "When life feels overwhelming, how do you usually cope?",
      categoryId: "health-and-habits",
      options: [
        { id: "option-1", text: "I eat, binge-watch, or zone out.", points: 1 },
        { id: "option-2", text: "I push harder, even if it burns me out.", points: 2 },
        { id: "option-3", text: "I pray or journal but struggle to stay consistent.", points: 3 },
        { id: "option-4", text: "I take a pause and reset with healthy routines.", points: 4 },
      ],
    },
    {
      id: "question-2",
      text: "How would you describe your energy right now?",
      categoryId: "health-and-habits",
      options: [
        { id: "option-1", text: "Drained and running on fumes.", points: 1 },
        { id: "option-2", text: "Up and down depending on stress.", points: 2 },
        { id: "option-3", text: "Pretty steady, but could be better.", points: 3 },
        { id: "option-4", text: "Strong, intentional, and focused.", points: 4 },
      ],
    },
    {
      id: "question-3",
      text: "Do you see discipline as:",
      categoryId: "health-and-habits",
      options: [
        { id: "option-1", text: "A struggle I can't get right.", points: 1 },
        { id: "option-2", text: "Something I have in parts of life but not others.", points: 2 },
        { id: "option-3", text: "A muscle I'm learning to strengthen.", points: 3 },
        { id: "option-4", text: "A gift that creates freedom.", points: 4 },
      ],
    },
    {
      id: "question-4",
      text: "How often does anxiety or worry about the future disrupt your day?",
      categoryId: "health-and-habits",
      options: [
        { id: "option-1", text: "Daily.", points: 1 },
        { id: "option-2", text: "A few times a week.", points: 2 },
        { id: "option-3", text: "Occasionally.", points: 3 },
        { id: "option-4", text: "Rarely.", points: 4 },
      ],
    },
    {
      id: "question-5",
      text: "Which best describes your relationship with money?",
      categoryId: "finances-and-order",
      options: [
        { id: "option-1", text: "I avoid looking at it. It stresses me out.", points: 1 },
        { id: "option-2", text: "I budget sometimes, but it's inconsistent.", points: 2 },
        { id: "option-3", text: "I'm learning to be a better steward.", points: 3 },
        { id: "option-4", text: "I'm intentional and confident with it.", points: 4 },
      ],
    },
    {
      id: "question-6",
      text: "Do you run your life/business from a place of:",
      categoryId: "finances-and-order",
      options: [
        { id: "option-1", text: "Constant chaos and last-minute scrambling.", points: 1 },
        { id: "option-2", text: "Some order, but mostly reactive.", points: 2 },
        { id: "option-3", text: "Learning to set systems and boundaries.", points: 3 },
        { id: "option-4", text: "Clear plans and structure that bring peace.", points: 4 },
      ],
    },
    {
      id: "question-7",
      text: "What's your biggest financial fear?",
      categoryId: "finances-and-order",
      options: [
        { id: "option-1", text: "Not being able to provide for myself/family.", points: 1 },
        { id: "option-2", text: "Losing what I've built.", points: 2 },
        { id: "option-3", text: "Missing opportunities because of lack.", points: 3 },
        { id: "option-4", text: "I don't live from fear. I trust provision and plan wisely.", points: 4 },
      ],
    },
    {
      id: "question-8",
      text: "If someone offered to help you set financial or organizational order, what would be your first reaction?",
      categoryId: "finances-and-order",
      options: [
        { id: "option-1", text: "Embarrassment, they'd see my mess.", points: 1 },
        { id: "option-2", text: "Curiosity, but hesitation.", points: 2 },
        { id: "option-3", text: "Openness. I know I need help.", points: 3 },
        { id: "option-4", text: "Excitement. I welcome wisdom.", points: 4 },
      ],
    },
    {
      id: "question-9",
      text: "How would you describe your current connections?",
      categoryId: "relationships-and-connection",
      options: [
        { id: "option-1", text: "Isolated. I don't let people in.", points: 1 },
        { id: "option-2", text: "A few relationships, but mostly surface-level.", points: 2 },
        { id: "option-3", text: "Growing. I'm learning to trust and connect.", points: 3 },
        { id: "option-4", text: "Deep, authentic, and supportive.", points: 4 },
      ],
    },
    {
      id: "question-10",
      text: "When conflict arises in relationships, I tend to:",
      categoryId: "relationships-and-connection",
      options: [
        { id: "option-1", text: "Withdraw completely.", points: 1 },
        { id: "option-2", text: "React harshly or defensively.", points: 2 },
        { id: "option-3", text: "Take time, then work it out.", points: 3 },
        { id: "option-4", text: "Approach it with patience and grace.", points: 4 },
      ],
    },
    {
      id: "question-11",
      text: "Have past wounds (abuse, abandonment, betrayal) affected how you show up in relationships today?",
      categoryId: "relationships-and-connection",
      options: [
        { id: "option-1", text: "Yes, they define me still.", points: 1 },
        { id: "option-2", text: "Yes, but I'm slowly healing.", points: 2 },
        { id: "option-3", text: "Somewhat. I see growth happening.", points: 3 },
        { id: "option-4", text: "They've refined me, but don't hold me back.", points: 4 },
      ],
    },
    {
      id: "question-12",
      text: "What role does love play in your decisions?",
      categoryId: "relationships-and-connection",
      options: [
        { id: "option-1", text: "I choose fear most times.", points: 1 },
        { id: "option-2", text: "I try, but fear often wins.", points: 2 },
        { id: "option-3", text: "I'm learning to choose love first.", points: 3 },
        { id: "option-4", text: "Love is my compass.", points: 4 },
      ],
    },
    {
      id: "question-13",
      text: "When it comes to visibility (sharing your story, stepping out in leadership, or promoting your business):",
      categoryId: "visibility-and-confidence",
      options: [
        { id: "option-1", text: "I hide completely.", points: 1 },
        { id: "option-2", text: "I try, but second-guess myself.", points: 2 },
        { id: "option-3", text: "I show up inconsistently.", points: 3 },
        { id: "option-4", text: "I show up boldly and consistently.", points: 4 },
      ],
    },
    {
      id: "question-14",
      text: "What's your biggest visibility fear?",
      categoryId: "visibility-and-confidence",
      options: [
        { id: "option-1", text: "Being judged or rejected.", points: 1 },
        { id: "option-2", text: "Failing in front of others.", points: 2 },
        { id: "option-3", text: "Not being good enough.", points: 3 },
        { id: "option-4", text: "I don't fear visibility. I see it as purpose.", points: 4 },
      ],
    },
    {
      id: "question-15",
      text: "Do you believe you were created with a unique assignment?",
      categoryId: "visibility-and-confidence",
      options: [
        { id: "option-1", text: "I'm not sure.", points: 1 },
        { id: "option-2", text: "Maybe, but I doubt it applies to me.", points: 2 },
        { id: "option-3", text: "Yes, but I struggle to act on it.", points: 3 },
        { id: "option-4", text: "Yes, and I'm actively pursuing it.", points: 4 },
      ],
    },
    {
      id: "question-16",
      text: "How comfortable are you with negotiating for what you’re worth (salary, business fees, opportunities)?",
      categoryId: "visibility-and-confidence",
      options: [
        { id: "option-1", text: "Very uncomfortable.", points: 1 },
        { id: "option-2", text: "Sometimes, but I shrink back.", points: 2 },
        { id: "option-3", text: "Growing more confident.", points: 3 },
        { id: "option-4", text: "Confident and unapologetic.", points: 4 },
      ],
    },
    {
      id: "question-17",
      text: "When you think about legacy, what comes to mind?",
      categoryId: "legacy-and-entrepreneurship",
      options: [
        { id: "option-1", text: "I don't think that far ahead.", points: 1 },
        { id: "option-2", text: "Maybe leaving something small for family.", points: 2 },
        { id: "option-3", text: "Building something lasting for others too.", points: 3 },
        { id: "option-4", text: "Expanding God's kingdom impact through what I build.", points: 4 },
      ],
    },
    {
      id: "question-18",
      text: "Do you see your work (job or business) as:",
      categoryId: "legacy-and-entrepreneurship",
      options: [
        { id: "option-1", text: "Just survival.", points: 1 },
        { id: "option-2", text: "A way to provide, but stressful.", points: 2 },
        { id: "option-3", text: "A growing opportunity to create more.", points: 3 },
        { id: "option-4", text: "A calling to multiply and steward well.", points: 4 },
      ],
    },
    {
      id: "question-19",
      text: "What's your view on entrepreneurship?",
      categoryId: "legacy-and-entrepreneurship",
      options: [
        { id: "option-1", text: "Too risky for me.", points: 1 },
        { id: "option-2", text: "Interesting, but scary.", points: 2 },
        { id: "option-3", text: "A real option I want to explore.", points: 3 },
        { id: "option-4", text: "A God-given pathway for impact and freedom.", points: 4 },
      ],
    },
    {
      id: "question-20",
      text: "If God asked you to build something bigger than yourself, would you:",
      categoryId: "legacy-and-entrepreneurship",
      options: [
        { id: "option-1", text: "Freeze in fear.", points: 1 },
        { id: "option-2", text: "Hesitate and bargain.", points: 2 },
        { id: "option-3", text: "Step out slowly, with support.", points: 3 },
        { id: "option-4", text: "Obey boldly, trusting Him for the outcome.", points: 4 },
      ],
    },
  ],
}

const resultRanges = [
  { min: 0, max: 7, label: "Explorer", url: "/start" },
  { min: 8, max: 12, label: "Builder", url: "/start" },
  { min: 13, max: 16, label: "Trailblazer", url: "/start" },
]

export { categories, quiz, resultRanges };

