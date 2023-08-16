import express from "express";
import { router, publicProcedure } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType } from "@trpc/server";
import cors from "cors";
import { z } from "zod";

type ChatMessage = {
  user: string;
  message: string;
};

const messages: ChatMessage[] = [
  {
    user: "Ben Dover",
    message: "Hello my name is Ben Dover",
  },
  {
    user: "Mike Hawk",
    message: "Hi Ben, my name is Mike Hawk",
  },
];

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
export type Context = inferAsyncReturnType<typeof createContext>;

const appRouter = router({
  hello: publicProcedure.query(() => [
    "Hello from the other side!",
    "You are in my hands",
  ]),
  welcome: publicProcedure.query(() => "Welcome to TS-Node Dev!"),
  getMessages: publicProcedure
    .input(z.number().default(10))
    .query(({ input }) => messages.slice(-input)),
  addMessage: publicProcedure
    .input(
      z.object({
        user: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ input }) => {
      messages.push(input);
      return input;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();
const port = 8080;
app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/", (req, res) => {
  res.json({ result: { data: "Hello from api-server" } });
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
