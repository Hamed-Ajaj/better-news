import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ChevronUpIcon, TrashIcon } from "lucide-react";

import { Post } from "@/shared/types";
import { userQueryOptions } from "@/lib/api";
import { useDeletePost } from "@/lib/api-hooks";
import { cn, relativeTime } from "@/lib/utils";

import { badgeVariants } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";

const PostCard = ({
  post,
  onUpvote,
}: {
  post: Post;
  onUpvote?: (id: number) => void;
}) => {
  const { data: user } = useQuery(userQueryOptions());
  const navigate = useNavigate();
  const deletePostMutation = useDeletePost();
  return (
    <Card className="flex flex-row items-start justify-start pt-3">
      <button
        onClick={() => {
          onUpvote?.(post.id);
        }}
        className={cn(
          "ml-3 flex flex-col items-center justify-center text-muted-foreground hover:text-primary",
          post.isUpvoted ? "text-primary" : "",
        )}
        disabled={!user}
      >
        <ChevronUpIcon size={20} />
        <span className="text-xs font-medium">{post.points}</span>
      </button>
      <div className="flex grow flex-col justify-between">
        <div className="flex items-start px-3 py-0">
          <div className="flex grow flex-wrap items-center gap-x-2 ">
            <CardTitle className="flex justify-between items-center text-xl w-full font-medium">
              {post.url ? (
                <a
                  href={post.url}
                  className="text-foreground hover:text-primary hover:underline"
                >
                  {post.title}
                </a>
              ) : (
                <Link
                  to={`/post`}
                  search={{ id: post.id }}
                  className="text-foreground hover:text-primary hover:underline"
                >
                  {post.title}
                </Link>
              )}

              {user?.id === post.author.id && (
                <Button
                  onClick={() => {
                    deletePostMutation.mutate(post.id);
                    navigate({
                      to: "/",
                    });
                  }}
                  variant="link"
                  className="cursor-pointer text-gray-500 text-xs hover:underline hover:text-primary"
                >
                  delete
                </Button>
              )}
            </CardTitle>
            {post.url ? (
              <Link
                className={cn(
                  badgeVariants({ variant: "secondary" }),
                  "text-xs font-normal cursor-pointer transition-colors hover:bg-primary/80 hover:underline",
                )}
                to={post.url}
              >
                {new URL(post.url).hostname}
              </Link>
            ) : null}
          </div>
        </div>
        <CardContent className="px-3 ">
          {post.content && (
            <p className="mb-2 text-foreground text-sm">{post.content}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground">
            <span>
              By{" "}
              <Link
                className="hover:underline"
                to="/"
                search={{ author: post.author.id }}
              >
                {post.author.username}
              </Link>
            </span>
            <span>&middot;</span>
            <span>{relativeTime(post.createdAt)}</span>
            <span>&middot;</span>
            <Link
              to="/post"
              search={{ id: post.id }}
              className="hover:underline"
            >
              {post.commentCount} comments
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PostCard;
