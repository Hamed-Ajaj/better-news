import {
  createFileRoute,
  useBlocker,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { toast } from "sonner";
import z from "zod";

import { createPostSchema } from "@/shared/types";
import { postSubmit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldInfo } from "@/components/field-info";

export const Route = createFileRoute("/_auth/submit")({
  component: RouteComponent,
});

const schema = z.object({
  title: z.string().min(6),
  content: z.string().min(10),
  url: z.string().optional(),
});

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      url: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await postSubmit(value.title, value.content, value.url);
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        router.invalidate();
        await navigate({ to: "/post", search: { id: res.data.postId } });
        return;
      } else {
        if (!res.isFormError) {
          toast.error("Failed to create post", { description: res.error });
        }
        form.setErrorMap({
          onSubmit: res.isFormError ? res.error : "Unexpeted error",
        });
      }
    },
  });
  const shouldBlock = form.state.isDirty && !form.state.isSubmitting;

  useBlocker({
    shouldBlockFn: () => {
      if (!shouldBlock) return false;

      const shouldLeave = confirm("Are you sure you want to leave?");
      return !shouldLeave;
    },
  });

  return (
    <div className="w-full">
      <Card className="mx-auto max-w-lg mt-12 border-border/25">
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Leave url blank to submit a question for discussion. If there is no
            url, text will appear at the top of the thread. If there is a url,
            text is optional.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="grid gap-4"
        >
          <CardContent>
            <div className="grid gap-4">
              <form.Field
                name="title"
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Title</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <form.Field
                name="url"
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>URL</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <form.Field
                name="content"
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Content</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <form.Subscribe
                selector={(state) => [state.errorMap]}
                children={([errorMap]) =>
                  errorMap.onSubmit ? (
                    <p className="text-[0.8rem] fonfont-medium text-destructive">
                      {errorMap.onSubmit?.toString()}
                    </p>
                  ) : null
                }
              />
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    {isSubmitting ? "..." : "Submit"}
                  </Button>
                )}
              />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
