import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";

const AppContent = () => {
  const messageContext = trpc.useContext();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("User");
  const messages = trpc.getMessages.useQuery();
  const addMessage = trpc.addMessage.useMutation({onSuccess: () => messageContext.getMessages.invalidate()});
  
  const onAdd = () => {
    setMessage("");
    addMessage.mutate(
      {
        user,
        message,
      },
      // {
      //   onSuccess: () => {
      //     messageContext.getMessages.invalidate();
      //   },
      // }
    );
  };

  const enterKeySubmitHandler = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAdd();
    }
  }

  if (messages.isLoading) {
    return <div>Loading...</div>;
  }

  if (messages.isError) {
    throw new Error(`New Error!, ${messages.error}`);
  }

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl space-y-2">
      {(messages.data ?? []).map((message) => (
        <div key={message.user}>
          <span className="text-green-400">{message.user}: </span>
          {message.message}
        </div>
      ))}
      <div className="space-x-2">
        <input
          className="border rounded-sm w-40 text-center"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="border rounded-sm"
          type="text"
          value={message}
          onKeyDown={enterKeySubmitHandler}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-2 rounded-sm ml-2"
          onClick={onAdd}
        >
          Send!
        </button>
      </div>
    </div>
  );
};

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
