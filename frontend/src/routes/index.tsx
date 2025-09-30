import { createFileRoute } from "@tanstack/react-router";
import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

import z from "zod";

import { Post } from "@/shared/types";
import { getPosts } from "@/lib/api";
import { useUpvotePost } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";
import SortBar from "@/components/sort-bar";

const homeSearchSchema = z.object({
  sortBy: fallback(z.enum(["points", "recent"]), "points").default("recent"),
  order: fallback(z.enum(["desc", "asc"]), "desc").default("desc"),
  author: z.optional(fallback(z.string(), "")),
  site: z.optional(fallback(z.string(), "")),
});

const postsInfiniteQueryOptions = ({
  sortBy,
  order,
  author,
  site,
}: z.infer<typeof homeSearchSchema>) =>
  infiniteQueryOptions({
    queryKey: ["posts", sortBy, order, author, site],
    queryFn: ({ pageParam }) =>
      getPosts({
        pageParam,
        pagination: {
          sortBy,
          order,
          author,
          site,
        },
      }),
    initialPageParam: 1,
    staleTime: Infinity,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: zodSearchValidator(homeSearchSchema),
});

function HomeComponent() {
  const { sortBy, order, author, site } = Route.useSearch();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({ sortBy, order, author, site }),
    );
  const upvoteMutation = useUpvotePost();
  return (
    <div className="p-4 mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Submissions</h1>
      <SortBar sortBy={sortBy} order={order} />
      <div className="space-y-4">
        {data?.pages.map((page) =>
          page.data.map((post: Post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={() => upvoteMutation.mutate(post.id.toString())}
            />
          )),
        )}
      </div>
      <div className="mt-6">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing More"}
        </Button>
      </div>
    </div>
  );
}
