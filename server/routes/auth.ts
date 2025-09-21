import { Hono } from "hono";

import { db } from "@/adapter";
import type { Context } from "@/context";
import { userTable } from "@/db/schemas/auth";
import { lucia } from "@/lucia";
import { zValidator } from "@hono/zod-validator";
import { generateId } from "lucia";

import { loginSchema, type SuccessResponse } from "@/shared/types";
import { HTTPException } from "hono/http-exception";

export const authRouter = new Hono<Context>().post(
  "/signup",
  zValidator("form", loginSchema),
  async (c) => {
    const { username, password } = c.req.valid("form");
    const password_hash = await Bun.password.hash(password);
    const userId = generateId(15);

    try {
      await db.insert(userTable).values({
        id: userId,
        username,
        password_hash,
      });

      const session = await lucia.createSession(userId, { username });
      const sessionCookie = lucia.createSessionCookie(session.id).serialize();
      c.header("Set-Cookie", sessionCookie, { append: true });

      return c.json<SuccessResponse>(
        {
          success: true,
          message: "User created",
        },
        201,
      );
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === "23505") {
        throw new HTTPException(409, { message: "Username already exists" });
      }
      throw new HTTPException(500, { message: "Failed to Create User" })
    }
  },
);
