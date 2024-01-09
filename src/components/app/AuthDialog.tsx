import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Validators, createForm } from "~/lib/forms";
import { TbEye, TbEyeFilled } from "solid-icons/tb";
import { Show, createSignal } from "solid-js";
import { setUser } from "~/state";
import { showToast } from "../ui/toast";

export function AuthDialog() {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);

  const closeModal = () => setIsOpen(false);

  return (
    <Dialog open={isOpen()} onOpenChange={setIsOpen}>
      <DialogTrigger
        as={Button}
        class="bg-emerald-300 text-emerald-800 hover:bg-emerald-500 hover:text-emerald-950 rounded-none"
        type="button"
      >
        Log In
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="login" class="mt-4">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log in</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" class="max-w-[425px] mx-auto mt-4">
            <LogInForm closeModal={closeModal} />
          </TabsContent>
          <TabsContent value="register" class="max-w-[425px] mx-auto mt-4">
            <RegistrationForm closeModal={closeModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  closeModal: () => void;
}

type RegistrationFormInputs = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

function RegistrationForm({ closeModal }: Props) {
  const form = createForm<RegistrationFormInputs>();
  const [revealPassword, setRevealPassword] = createSignal(false);
  const [revealPasswordRepeat, setRevealPasswordRepeat] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const [
    usernameOptions,
    emailOptions,
    passwordOptions,
    passwordRepeatOptions,
  ] = form.registerMany([
    {
      key: "username",
      options: {
        required: true,
        validators: [Validators.max(64)],
      },
    },
    {
      key: "email",
      options: {
        required: true,
        validators: [Validators.email, Validators.max(128)],
      },
    },
    {
      key: "password",
      options: {
        required: true,
      },
    },
    {
      key: "repeatPassword",
      options: {
        required: true,
        name: "repeat-password",
        validators: [
          (value, state) => {
            return value !== state.password
              ? {
                  type: "passwords-not-match",
                  message: "Passwords don't match",
                }
              : undefined;
          },
        ],
      },
    },
  ]);

  const onRegister = form.onSubmit((values) => {
    setLoading(true);
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.status === 409) {
          form.setError("username", {
            type: "username-exist",
            message: "Username is already taken",
          });
          return "Registration error";
        }

        return r.json();
      })
      .then((r) => {
        setLoading(false);

        if (typeof r === "string") {
          console.error(r);
          return;
        }

        setUser(r);
        closeModal();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        showToast({
          title: "Error",
          description: "Failed to create your account",
        });
      });
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle class="text-xl">Registration</DialogTitle>
        <DialogDescription>
          You can create personal profile to save your links and see additional
          statistics.
        </DialogDescription>
      </DialogHeader>
      <form
        id="registration-form"
        class="grid grid-cols-4 gap-4 py-4"
        novalidate
        onSubmit={onRegister}
      >
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">
            Username
          </Label>
          <Input
            id="username"
            placeholder="johnsmith"
            class="col-span-3"
            classList={{
              "outline outline-2 outline-error-foreground":
                !!form.error.username?.length,
            }}
            aria-invalid={!!form.error.username?.length}
            aria-errormessage="username-error"
            {...usernameOptions}
          />
        </div>
        <Show when={!!form.error.username?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="username-error"
          >
            {form.error.username?.[0].message}
          </span>
        </Show>
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">
            Email
          </Label>
          <Input
            id="email"
            placeholder="johnsmith@example.com"
            type="email"
            class="col-span-3"
            classList={{
              "outline outline-2 outline-error-foreground":
                !!form.error.email?.length,
            }}
            aria-invalid={!!form.error.email?.length}
            aria-errormessage="email-error"
            {...emailOptions}
          />
        </div>
        <Show when={!!form.error.email?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="email-error"
          >
            {form.error.email?.[0].message}
          </span>
        </Show>
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="password" class="text-right">
            Password
          </Label>
          <div class="relative col-span-3">
            <Input
              id="password"
              type={revealPassword() ? "text" : "password"}
              autocomplete="password"
              classList={{
                "outline outline-2 outline-error-foreground":
                  !!form.error.password?.length,
              }}
              aria-invalid={!!form.error.password?.length}
              aria-errormessage="password-error"
              {...passwordOptions}
            />
            <button
              title="Reveal password"
              class="absolute top-1/2 -translate-y-1/2 right-3"
              onMouseDown={() => setRevealPassword(true)}
              onMouseUp={() => setRevealPassword(false)}
            >
              <Show when={revealPassword()} fallback={<TbEye />}>
                <TbEyeFilled />
              </Show>
            </button>
          </div>
        </div>
        <Show when={!!form.error.password?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="password-error"
          >
            {form.error.password?.[0].message}
          </span>
        </Show>
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="repeat-password" class="text-right">
            Password repeat
          </Label>
          <div class="relative col-span-3">
            <Input
              id="repeat-password"
              type={revealPasswordRepeat() ? "text" : "password"}
              autocomplete="repeat-password"
              classList={{
                "outline outline-2 outline-error-foreground":
                  !!form.error.repeatPassword?.length,
              }}
              aria-invalid={!!form.error.repeatPassword?.length}
              aria-errormessage="repeat-password-error"
              {...passwordRepeatOptions}
            />
            <button
              title="Reveal password"
              class="absolute top-1/2 -translate-y-1/2 right-3"
              onMouseDown={() => setRevealPasswordRepeat(true)}
              onMouseUp={() => setRevealPasswordRepeat(false)}
            >
              <Show when={revealPasswordRepeat()} fallback={<TbEye />}>
                <TbEyeFilled />
              </Show>
            </button>
          </div>
        </div>
        <Show when={!!form.error.repeatPassword?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="repeat-password-error"
          >
            {form.error.repeatPassword?.[0].message}
          </span>
        </Show>
      </form>
      <DialogFooter>
        <Button type="submit" form="registration-form" disabled={loading()}>
          Create profile
        </Button>
      </DialogFooter>
    </>
  );
}

type LogInFormInputs = {
  username: string;
  password: string;
};

function LogInForm({ closeModal }: Props) {
  const form = createForm<LogInFormInputs>();
  const [revealPassword, setRevealPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const [usernameOptions, passwordOptions] = form.registerMany([
    {
      key: "username",
      options: {
        required: true,
      },
    },
    {
      key: "password",
      options: {
        required: true,
      },
    },
  ]);

  const onLogIn = form.onSubmit((values) => {
    setLoading(true);
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.status === 401) {
          form.setError("password", {
            type: "invalid-credentials",
            message: "Invalid login or password",
          });
          return "Unauthorized";
        }

        return r.json();
      })
      .then((r) => {
        setLoading(false);

        if (typeof r === "string") {
          console.error(r);
          return;
        }

        setUser(r);
        closeModal();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        showToast({
          title: "Error",
          description: "Failed to log you in",
        });
      });
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle class="text-xl">Log in</DialogTitle>
        <DialogDescription>Log in to see your profile data.</DialogDescription>
      </DialogHeader>
      <form
        id="login-form"
        class="grid grid-cols-4 gap-4 py-4"
        novalidate
        onSubmit={onLogIn}
      >
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">
            Username
          </Label>
          <Input
            id="username"
            placeholder="johnsmith"
            class="col-span-3"
            classList={{
              "outline outline-2 outline-error-foreground":
                !!form.error.username?.length,
            }}
            aria-invalid={!!form.error.username?.length}
            aria-errormessage="username-error"
            {...usernameOptions}
          />
        </div>
        <Show when={!!form.error.username?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="username-error"
          >
            {form.error.username?.[0].message}
          </span>
        </Show>
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="password" class="text-right">
            Password
          </Label>
          <div class="relative col-span-3">
            <Input
              id="password"
              type={revealPassword() ? "text" : "password"}
              autocomplete="password"
              classList={{
                "outline outline-2 outline-error-foreground":
                  !!form.error.password?.length,
              }}
              aria-invalid={!!form.error.password?.length}
              aria-errormessage="password-error"
              {...passwordOptions}
            />
            <button
              title="Reveal password"
              class="absolute top-1/2 -translate-y-1/2 right-3"
              onMouseDown={() => setRevealPassword(true)}
              onMouseUp={() => setRevealPassword(false)}
            >
              <Show when={revealPassword()} fallback={<TbEye />}>
                <TbEyeFilled />
              </Show>
            </button>
          </div>
        </div>
        <Show when={!!form.error.password?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="password-error"
          >
            {form.error.password?.[0].message}
          </span>
        </Show>
      </form>
      <DialogFooter>
        <Button type="submit" form="login-form" disabled={loading()}>
          Log in
        </Button>
      </DialogFooter>
    </>
  );
}
