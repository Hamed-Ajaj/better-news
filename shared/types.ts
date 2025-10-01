import z, { coerce, literal } from "zod";

import { insertCommentSchema } from "../server/db/schemas/comments";
import { insertPostSchema } from "../server/db/schemas/posts";
import type { ApiRoutes } from "../server/index";

export { type ApiRoutes };

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).max(255),
});

export const createPostSchema = z
  .object({
    title: z.string().min(5, "Title must be more than 5 chars").max(100),
    url: z.string().optional().or(literal("")),
    content: z
      .string()
      .min(5, "Content must be more than 5 chars")
      .max(2000)
      .optional(),
  })
  .refine((data) => data.url || data.content, {
    message: "Either URL or Content must be provided",
    path: ["url", "content"],
  });

export const sortBySchema = z.enum(["points", "recent"]);
export const orderSchema = z.enum(["asc", "desc"]);

export type SortBy = z.infer<typeof sortBySchema>;
export type Order = z.infer<typeof orderSchema>;

export const paginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  sortBy: sortBySchema.default("recent"),
  order: orderSchema.default("desc"),
  author: z.string().optional(),
  site: z.string().optional(),
});

export const createCommentSchema = insertCommentSchema.pick({
  content: true,
});

export type Post = {
  id: number;
  title: string;
  url: string | null;
  content: string | null;
  points: number;
  createdAt: string;
  commentCount: number;
  author: {
    id: string;
    username: string;
  };

  isUpvoted: boolean;
};

export type Comment = {
  id: number;
  userId: string;
  content: string;
  points: number;
  depth: number;
  commentCount: number;
  createdAt: string;
  postId: number;
  parentCommentId: number | null;
  commentUpvotes: {
    userId: string;
  }[];
  author: {
    username: string;
    id: string;
  };
  childComments?: Comment[];
};

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPages: number;
  };
  data: T;
} & Omit<SuccessResponse, "data">;
