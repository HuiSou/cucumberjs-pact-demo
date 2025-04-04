import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { CreateServer } from "./server";

const app = CreateServer(5500);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
