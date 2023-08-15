import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";

const AppContent = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: client</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Tailwind</div>
  </div>
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:8080/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
