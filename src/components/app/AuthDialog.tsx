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

export function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger
        as={Button}
        class="bg-destructive text-destructive-foreground hover:text-primary-foreground rounded-none"
        type="button"
      >
        Login
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registration</DialogTitle>
          <DialogDescription>
            You can create personal profile to save your links and see
            additional statistics.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">
              Username
            </Label>
            <Input id="username" placeholder="johnsmith" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="johnsmith@example.com"
              class="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
