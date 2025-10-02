import { useState } from "react";
import { ThumbsUp, MessageCircle, Volume2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ReplyCard } from "./ReplyCard";
import type { Question } from "@/pages/Forum";
import { useTranslation } from "react-i18next";

interface QuestionCardProps {
  question: Question;
  onAddReply: (questionId: string, content: string) => void;
  onLike: (questionId: string) => void;
}

export const QuestionCard = ({
  question,
  onAddReply,
  onLike,
}: QuestionCardProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { t } = useTranslation();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onAddReply(question.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      onLike(question.id);
      setIsLiked(true);
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-semibold">
              {question.userAvatar}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                {question.userName}
              </h3>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(question.timestamp)}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-3">
              {question.isAudio ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-800">
                    {question.content}
                  </span>
                </div>
              ) : (
                <p className="text-gray-800 leading-relaxed">
                  {question.content}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "text-green-600" : "text-gray-600"}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {question.likes}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-gray-600"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {question.replies.length}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        {question.replies.length > 0 && (
          <div className="mt-6 ml-16 space-y-4 border-l-2 border-green-200 pl-6">
            {question.replies.map((reply) => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
        )}

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-6 ml-16 space-y-3">
            <Textarea
              placeholder={t("reply_placeholder")}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[80px] resize-none focus:ring-green-500 focus:border-green-500"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleReplySubmit}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {t("post_reply")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReplyInput(false)}
                className="text-gray-600"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
