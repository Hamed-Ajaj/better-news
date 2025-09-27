import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

import { AlertTriangle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

export function ErrorComponent({ error }: { error: Error }) {
  const isDev = process.env.NODE_ENV !== "production";
  const router = useRouter();
  const queryClientErrorBoundary = useQueryErrorResetBoundary();
  useEffect(() => {
    queryClientErrorBoundary.reset();
  }, [queryClientErrorBoundary]);
  return (
    <div className="mt-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant={"destructive"}>
          <AlertTriangle className="size-4" />
          <AlertTitle>Oops! Something went wrong</AlertTitle>
          <AlertDescription>
            we&apos;re sorry, but we encoutered an unexpected error.
          </AlertDescription>
        </Alert>
        <div className="mt-4 space-y-4">
          <Button
            onClick={() => {
              router.invalidate();
            }}
            className="w-full"
          >
            Try Again
          </Button>
          <Button asChild className="w-full" variant={"outline"}>
            <Link to="/">Return to hompage</Link>
          </Button>
          {isDev ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="error-details">
                <AccordionTrigger>View error details</AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-md bg-muted p-4">
                    <h3 className="mb-2 font-semibold">Error Message:</h3>
                    <p className="mb-4 text-sm">{error.message}</p>
                    <h3 className="mb-2 font-semibold">Stack Trace:</h3>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                      {error.stack}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </div>
      </div>
    </div>
  );
}
