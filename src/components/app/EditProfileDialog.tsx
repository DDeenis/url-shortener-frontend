import { Show, createSignal } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { TbAlertTriangleFilled, TbEye, TbEyeFilled } from "solid-icons/tb";
import { Validators, createForm } from "~/lib/forms";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { setUser, user } from "~/state";
import { showToast } from "../ui/toast";

export const EditProfileDialog = () => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);

  const closeModal = () => setIsOpen(false);

  return (
    <Dialog open={isOpen()} onOpenChange={setIsOpen}>
      <DialogTrigger
        as={Button}
        class="bg-primary text-primary-foreground"
        type="button"
      >
        Edit Profile
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="details" class="mt-4">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="details">Profile Detail</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="details" class="max-w-[425px] mx-auto mt-4">
            <EditProfileDetailsForm closeModal={closeModal} />
          </TabsContent>
          <TabsContent value="password" class="max-w-[425px] mx-auto mt-4">
            <ChangePasswordForm closeModal={closeModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface Props {
  closeModal: () => void;
}

const EditProfileDetailsForm = ({ closeModal }: Props) => {
  const form = createForm<{
    username: string;
    email: string;
  }>({
    defaultValues: {
      username: user()?.username,
      email: user()?.email,
    },
  });
  const [loading, setLoading] = createSignal(false);

  const [usernameOptions, emailOptions] = form.registerMany([
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
  ]);

  const onSubmit = form.onSubmit((values) => {
    if (values.username && values.email) {
      setLoading(true);
      fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => {
          setLoading(false);
          if (r.status !== 204) throw "Error";

          setUser((u) => ({
            ...u!,
            username: values.username!,
            email: values.email!,
          }));
          showToast({
            title: "Success",
            description: "Your profile details were updated",
          });
          closeModal();
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          showToast({
            title: "Error",
            description: "Failed to update your profile details",
          });
        });
    }
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle class="text-xl">Edit profile details</DialogTitle>
      </DialogHeader>
      <form
        id="edit-details-form"
        class="grid grid-cols-4 gap-4 py-4"
        novalidate
        onSubmit={onSubmit}
      >
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">
            Username
          </Label>
          <Input
            id="username"
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
      </form>
      <DialogFooter>
        <Button
          type="reset"
          form="edit-details-form"
          onClick={closeModal}
          variant={"outline"}
        >
          Cancel
        </Button>
        <Button type="submit" form="edit-details-form" disabled={loading()}>
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
};

const ChangePasswordForm = ({ closeModal }: Props) => {
  const form = createForm<{
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  }>();
  const [revealPassword, setRevealPassword] = createSignal(false);
  const [revealNewPassword, setRevealNewPassword] = createSignal(false);
  const [revealNewPasswordRepeat, setRevealNewPasswordRepeat] =
    createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const [currentPasswordOptions, newPasswordOptions, newPasswordRepeatOptions] =
    form.registerMany([
      {
        key: "currentPassword",
        options: {
          required: true,
          name: "current-password",
        },
      },
      {
        key: "newPassword",
        options: {
          required: true,
          name: "new-password",
          validators: [
            (value, state) => {
              return value === state.currentPassword
                ? {
                    type: "passwords-same",
                    message: "Your new password is same to current password",
                  }
                : undefined;
            },
          ],
        },
      },
      {
        key: "repeatNewPassword",
        options: {
          required: true,
          name: "repeat-password",
          validators: [
            (value, state) => {
              return value !== state.newPassword
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

  const onSubmit = form.onSubmit((values) => {
    if (values.currentPassword && values.newPassword) {
      setLoading(true);
      fetch("/api/profile/password", {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => {
          setLoading(false);
          if (r.status === 409) {
            form.setError("currentPassword", {
              type: "wrong-password",
              message: "Invalid password",
            });
            return;
          }

          showToast({
            title: "Success",
            description: "Your password was updated",
          });
          closeModal();
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          showToast({
            title: "Error",
            description: "Failed to update your password",
          });
        });
    }
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle class="text-xl">Change password</DialogTitle>
        <DialogDescription>
          <Alert>
            <TbAlertTriangleFilled class="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              You wil loose all sessions on other devices
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>
      <form
        id="change-password-form"
        class="grid grid-cols-4 gap-4 py-4"
        novalidate
        onSubmit={onSubmit}
      >
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="current-password" class="text-right">
            Current password
          </Label>
          <div class="relative col-span-3">
            <Input
              id="current-password"
              type={revealPassword() ? "text" : "password"}
              autocomplete="password"
              classList={{
                "outline outline-2 outline-error-foreground":
                  !!form.error.currentPassword?.length,
              }}
              aria-invalid={!!form.error.currentPassword?.length}
              aria-errormessage="current-password-error"
              {...currentPasswordOptions}
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
        <Show when={!!form.error.currentPassword?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="current-password-error"
          >
            {form.error.currentPassword?.[0].message}
          </span>
        </Show>
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="new-password" class="text-right">
            New password
          </Label>
          <div class="relative col-span-3">
            <Input
              id="new-password"
              type={revealNewPassword() ? "text" : "password"}
              autocomplete="password"
              classList={{
                "outline outline-2 outline-error-foreground":
                  !!form.error.newPassword?.length,
              }}
              aria-invalid={!!form.error.newPassword?.length}
              aria-errormessage="new-password-error"
              {...newPasswordOptions}
            />
            <button
              title="Reveal password"
              class="absolute top-1/2 -translate-y-1/2 right-3"
              onMouseDown={() => setRevealNewPassword(true)}
              onMouseUp={() => setRevealNewPassword(false)}
            >
              <Show when={revealNewPassword()} fallback={<TbEye />}>
                <TbEyeFilled />
              </Show>
            </button>
          </div>
        </div>
        <Show when={!!form.error.newPassword?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="new-password-error"
          >
            {form.error.newPassword?.[0].message}
          </span>
        </Show>
        <div class="col-span-4 grid grid-cols-4 items-center gap-4">
          <Label for="repeat-new-password" class="text-right">
            Repeat new password
          </Label>
          <div class="relative col-span-3">
            <Input
              id="repeat-new-password"
              type={revealNewPasswordRepeat() ? "text" : "password"}
              autocomplete="repeat-new-password"
              classList={{
                "outline outline-2 outline-error-foreground":
                  !!form.error.repeatNewPassword?.length,
              }}
              aria-invalid={!!form.error.repeatNewPassword?.length}
              aria-errormessage="repeat-new-password-error"
              {...newPasswordRepeatOptions}
            />
            <button
              title="Reveal password"
              class="absolute top-1/2 -translate-y-1/2 right-3"
              onMouseDown={() => setRevealNewPasswordRepeat(true)}
              onMouseUp={() => setRevealNewPasswordRepeat(false)}
            >
              <Show when={revealNewPasswordRepeat()} fallback={<TbEye />}>
                <TbEyeFilled />
              </Show>
            </button>
          </div>
        </div>
        <Show when={!!form.error.repeatNewPassword?.length}>
          <span
            class="text-error-foreground text-sm col-start-2 col-end-4 -mt-3"
            id="repeat-new-password-error"
          >
            {form.error.repeatNewPassword?.[0].message}
          </span>
        </Show>
      </form>
      <DialogFooter>
        <Button
          type="reset"
          form="change-password-form"
          onClick={closeModal}
          variant={"outline"}
        >
          Cancel
        </Button>
        <Button type="submit" form="change-password-form" disabled={loading()}>
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
};
