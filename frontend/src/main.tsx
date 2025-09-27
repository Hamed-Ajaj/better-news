import "./index.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Loader2Icon } from "lucide-react";
import ReactDOM from "react-dom/client";

import { ErrorComponent } from "./components/error-component";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  defaultPendingComponent: () => (
    <div className="mx-auto flex mt-8 flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" />
      <p className="text-sm text-muted-foreground mt-2">loading...</p>
    </div>
  ),
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
