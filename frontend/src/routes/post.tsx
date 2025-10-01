import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

import z from "zod";

import { getPost } from "@/lib/api";
import { useUpvotePost } from "@/lib/api-hooks";
import PostCard from "@/components/post-card";

const postSearchSchema = z.object({
  id: fallback(z.number(), 0).default(0),
  sortBy: fallback(z.enum(["points", "recent"]), "points").default("points"),
  order: fallback(z.enum(["asc", "desc"]), "desc").default("desc"),
});

const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    staleTime: Infinity,
    retry: false,
    throwOnError: true,
  });

export const Route = createFileRoute("/post")({
  component: RouteComponent,
  validateSearch: zodSearchValidator(postSearchSchema),
});

function RouteComponent() {
  const { id, sortBy, order } = Route.useSearch();
  const { data } = useSuspenseQuery(postQueryOptions(id));
  const upvotePost = useUpvotePost();
  return (
    <div className="mx-auto max-w-3xl">
      {data && (
        <PostCard
          post={data.data}
          onUpvote={() => upvotePost.mutate(id.toString())}
        />
      )}
    </div>
  );
}
