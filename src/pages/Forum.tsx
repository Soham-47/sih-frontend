import { useState } from "react";
import { QuestionInput } from "@/components/forum/QuestionInput";
import { QuestionCard } from "@/components/forum/QuestionCard";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
}

export interface Question {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  isAudio: boolean;
  timestamp: Date;
  likes: number;
  replies: Reply[];
}

const DUMMY_QUESTIONS: Question[] = [
  {
    id: "1",
    userId: "u1",
    userName: "John Farmer",
    userAvatar: "🌾",
    content:
      "What's the best time to plant corn in zone 7? I'm new to farming and want to make sure I get the timing right.",
    isAudio: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    replies: [
      {
        id: "r1",
        userId: "u2",
        userName: "Sarah Green",
        userAvatar: "🌱",
        content:
          "Late April to early May usually works best. Make sure soil temp is above 50°F!",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
      {
        id: "r2",
        userId: "u3",
        userName: "Mike Thompson",
        userAvatar: "🚜",
        content:
          "I agree with Sarah. Also check your last frost date - you want to plant 2 weeks after that.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "2",
    userId: "u4",
    userName: "Emily Rodriguez",
    userAvatar: "🌻",
    content: "Best organic pest control for tomato hornworms?",
    isAudio: true,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 8,
    replies: [
      {
        id: "r3",
        userId: "u5",
        userName: "David Chen",
        userAvatar: "🥕",
        content:
          "Handpicking works great if you have a small garden. For larger areas, Bacillus thuringiensis (Bt) is organic and very effective.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "3",
    userId: "u6",
    userName: "Robert Miller",
    userAvatar: "🌽",
    content:
      "How do you manage crop rotation with limited space? I only have about 2 acres.",
    isAudio: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 15,
    replies: [],
  },
  {
    id: "4",
    userId: "u7",
    userName: "Linda Perez",
    userAvatar: "🍅",
    content: "Any tips for starting a greenhouse setup on a budget?",
    isAudio: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 6,
    replies: [
      {
        id: "r4",
        userId: "u8",
        userName: "Mark Wilson",
        userAvatar: "🌿",
        content:
          "Try using PVC pipes and plastic sheeting as a starter greenhouse—it’s cheap and effective.",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "5",
    userId: "u9",
    userName: "Sophia Lee",
    userAvatar: "🍇",
    content: "What’s the best companion plant for cucumbers?",
    isAudio: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 10,
    replies: [
      {
        id: "r5",
        userId: "u10",
        userName: "James Brown",
        userAvatar: "🌼",
        content:
          "Radishes work well because they repel cucumber beetles. Also, try dill—it attracts beneficial insects.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "6",
    userId: "u11",
    userName: "Carlos Gomez",
    userAvatar: "🍊",
    content:
      "How do you keep soil healthy after multiple harvests in a season?",
    isAudio: true,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 18,
    replies: [
      {
        id: "r6",
        userId: "u12",
        userName: "Anna White",
        userAvatar: "🌸",
        content:
          "Add compost regularly, rotate crops, and consider cover cropping in the off-season.",
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "7",
    userId: "u13",
    userName: "William Adams",
    userAvatar: "🥔",
    content:
      "Anyone have experience with drip irrigation systems? Worth the cost?",
    isAudio: false,
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    likes: 14,
    replies: [
      {
        id: "r7",
        userId: "u14",
        userName: "Grace Kim",
        userAvatar: "🍒",
        content:
          "Definitely worth it—saves water and ensures plants get consistent moisture.",
        timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000),
      },
      {
        id: "r8",
        userId: "u15",
        userName: "Tom Harris",
        userAvatar: "🥦",
        content:
          "I switched to drip last year and cut my water bill by almost 30%.",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "8",
    userId: "u16",
    userName: "Hannah Moore",
    userAvatar: "🌹",
    content: "What’s the best cover crop for clay soil?",
    isAudio: false,
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
    likes: 9,
    replies: [
      {
        id: "r9",
        userId: "u17",
        userName: "Ethan Scott",
        userAvatar: "🌳",
        content:
          "Try clover or ryegrass—they help loosen the soil and improve fertility over time.",
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
      },
    ],
  },
];


const Forum = () => {
  const {t}=useTranslation()
  const [questions, setQuestions] = useState<Question[]>(DUMMY_QUESTIONS);

  const handleAddQuestion = (content: string, isAudio: boolean) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      userAvatar: "👤",
      content,
      isAudio,
      timestamp: new Date(),
      likes: 0,
      replies: [],
    };
    setQuestions([newQuestion, ...questions]);
  };

  const handleAddReply = (questionId: string, content: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              replies: [
                ...q.replies,
                {
                  id: Date.now().toString(),
                  userId: "current-user",
                  userName: "You",
                  userAvatar: "👤",
                  content,
                  timestamp: new Date(),
                },
              ],
            }
          : q
      )
    );
  };

  const handleLike = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, likes: q.likes + 1 } : q
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            {t("community")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("tagline")}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className=" space-y-6">
          <Link to="/">
            <button className= "flex border-2 border-black px-2 py-2 rounded-md items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("back_to_home")}
            </button>
          </Link>
        </div>
        <QuestionInput onAddQuestion={handleAddQuestion} />

        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAddReply={handleAddReply}
              onLike={handleLike}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Forum;
