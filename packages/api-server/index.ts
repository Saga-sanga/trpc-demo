import express from "express";
import { router, publicProcedure } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType } from "@trpc/server";
import cors from "cors"

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
export type Context = inferAsyncReturnType<typeof createContext>;

const appRouter = router({
  hello: publicProcedure.query(() => "Hello from the other side!"),
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
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
