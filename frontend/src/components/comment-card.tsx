import { useState } from "react";
import {
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import { Comment } from "@/shared/types";
import { getCommentComments, userQueryOptions } from "@/lib/api";
import { useDeleteComment, useUpvoteComment } from "@/lib/api-hooks";
import { cn, relativeTime } from "@/lib/utils";

import CommentForm from "./comment-form";
import { Separator } from "./ui/separator";

type CommentCardProps = {
  comment: Comment;
  depth: number;
  activeReplyId: number | null;
  setActiveReplyId: React.Dispatch<React.SetStateAction<number | null>>;
  isLatest: boolean;
  toggleUpvote: ReturnType<typeof useUpvoteComment>["mutate"];
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
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userQueryOptions());
  console.log(user);
  const {
    data: comments,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ["comments", "comment", comment.id],
    queryFn: ({ pageParam }) => getCommentComments(comment.id, pageParam),
    initialPageParam: 1,
    staleTime: Infinity,
    initialData: {
      pageParams: [1],
      pages: [
        {
          success: true,
          message: "comments Fetched",
          data: comment.childComments ?? [],
          pagination: {
            page: 1,
            totalPages: Math.ceil(comment.commentCount / 2),
          },
        },
      ],
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPage <= lastPageParam) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });
  const deleteCommentMutation = useDeleteComment();
  const isReplying = activeReplyId === comment.id;
  const loadFirstPage =
    comments?.pages[0].data?.length === 0 && comment.commentCount > 0;

  const isUpvoted = comment.commentUpvotes.length > 0;
  const isDraft = comment.id === -1;
  console.log(hasNextPage || loadFirstPage);
  return (
    <div
      className={cn(
        depth > 0 && "ml-4 border-l border-border pl-4",
        isDraft && "pointer-events-none opacity-50",
      )}
    >
      <div className="py-2">
        <div className="mb-2 flex items-center space-x-1 text-xs">
          <button
            disabled={!user}
            className={cn(
              "flex items-center space-x-1 hover:text-primary",
              isUpvoted ? "text-primary" : "text-muted-foreground",
            )}
            onClick={() =>
              toggleUpvote({
                id: comment.id.toString(),
                parentCommentId: comment.parentCommentId,
                postId: comment.postId,
              })
            }
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
            {isCollapsed ? <MinusIcon size={14} /> : <PlusIcon size={14} />}
          </button>
        </div>
        {!isCollapsed && (
          <>
            <p className="mb-2 text-sm text-foreground">{comment.content}</p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {user && (
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center space-x-1 hover:text-foreground"
                    onClick={() =>
                      setActiveReplyId(isReplying ? null : comment.id)
                    }
                  >
                    <MessageSquareIcon size={12} />
                    <span>reply</span>
                  </button>

                  {user?.id === comment.author.id && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <button
                        className="flex items-center space-x-1 hover:text-foreground"
                        onClick={() => deleteCommentMutation.mutate(comment.id)}
                      >
                        <TrashIcon size={12} />
                        <span>delete</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {isReplying && (
              <div className="mt-2">
                <CommentForm
                  id={comment.id}
                  isParent
                  onSuccess={() => setActiveReplyId(null)}
                />
              </div>
            )}
          </>
        )}
      </div>
      {!isCollapsed &&
        comments &&
        comments.pages.map((page, index) => {
          const isLastPage = index === comments.pages.length - 1;
          return page.data.map((reply: Comment, index: number) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              isLatest={isLastPage && index === page.data.length - 1}
              toggleUpvote={toggleUpvote}
            />
          ));
        })}
      {!isCollapsed && (hasNextPage || loadFirstPage) && (
        <div className="mt-2">
          <button
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (loadFirstPage) {
                queryClient.invalidateQueries({
                  queryKey: ["comments", "comment", comment.id],
                });
              } else {
                fetchNextPage();
              }
            }}
            disabled={!(hasNextPage || loadFirstPage) || isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <span>Loading...</span>
            ) : (
              <>
                <ChevronDownIcon size={12} />
                <span>More replies</span>
              </>
            )}
          </button>
        </div>
      )}
      {!isLatest && <Separator className="my-2" />}
    </div>
  );
};

export default CommentCard;
