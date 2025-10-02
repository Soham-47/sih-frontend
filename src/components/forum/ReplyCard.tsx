import { Clock } from "lucide-react";
import type { Reply } from "@/pages/Forum";

interface ReplyCardProps {
  reply: Reply;
}

export const ReplyCard = ({ reply }: ReplyCardProps) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
          {reply.userAvatar}
        </div>
      </div>

      {/* Reply content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm text-gray-900">
            {reply.userName}
          </h4>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimestamp(reply.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{reply.content}</p>
      </div>
    </div>
  );
};
