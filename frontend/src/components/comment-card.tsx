import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ChevronUpIcon,
  MessageSquareIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

import { Comment } from "@/shared/types";
import { userQueryOptions } from "@/lib/api";
import { cn, relativeTime } from "@/lib/utils";

import CommentForm from "./comment-form";
import { Button } from "./ui/button";

type CommentCardProps = {
  comment: Comment;
  depth: number;
  activeReplyId: number | null;
  setActiveReplyId: React.Dispatch<React.SetStateAction<number | null>>;
  isLatest: boolean;
  toggleUpvote: () => void;
};
const CommentCard = ({
  comment,
  depth,
  activeReplyId,
  setActiveReplyId,
  isLatest,
  toggleUpvote,
}: CommentCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { data: user } = useQuery(userQueryOptions());
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const isUpvoted = comment.commentUpvotes.length > 0;
  return (
    <div className={cn(depth > 0 && "ml-4 border-l border-border pl-4")}>
      <div className="py-2">
        <div className="mb-2 flex items-center space-x-1 text-xs">
          <button
            disabled={!user}
            className={cn(
              "flex items-center space-x-1 hover:text-primary",
              isUpvoted ? "text-primary" : "text-muted-foreground",
            )}
          >
            <ChevronUpIcon size={14} />
            <span className="font-medium">{comment.points}</span>
          </button>
          <span className="text-muted-foreground">·</span>
          <span className="font-medium">{comment.author.username}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {relativeTime(comment.createdAt)}
          </span>
          <span className="text-muted-foreground">·</span>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? <PlusIcon size={14} /> : <MinusIcon size={14} />}
          </button>
        </div>
        {!isCollapsed && (
          <p className="mb-2 text-sm text-foreground">not collapsed</p>
        )}
        {user && (
          <button
            className="flex items-center space-x-1 hover:text-foreground"
            onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
          >
            <MessageSquareIcon size={12} />
            <span>reply</span>
          </button>
        )}
        {isReplying && <div className="mt-2">comment form</div>}
      </div>
    </div>
  );
};

export default CommentCard;
