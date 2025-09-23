import { insertPostSchema } from "@/db/schemas/posts";
import z, { coerce } from "zod";

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

export const createPostSchema = insertPostSchema
  .pick({
    title: true,
    url: true,
    content: true,
  })
  .refine(
    (data) => data.url || data.content,
    "Either url or content is required",
  );

export const sortBySchema = z.enum(["points", "recent"]);
export const ordercSchema = z.enum(["asc", "desc"]);

export const paginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  sortBy: sortBySchema.default("recent"),
  order: ordercSchema.default("desc"),
  author: z.string().optional(),
  site: z.string().optional(),
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
  }

  isUpvoted: boolean;
}

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPages: number;
  }
  data: T
} & Omit<SuccessResponse, "data">;
