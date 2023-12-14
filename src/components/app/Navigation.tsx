import { Sections, currentSection } from "~/state";
import { buttonVariants } from "../ui/button";
import clsx from "clsx";
import { AuthDialog } from "./AuthDialog";

const buttonClassBase =
  "flex-grow rounded-none hover:brightness-75 dark:hover:brightness-125";
const buttonClassActive = "font-bold bg-primary text-primary-foreground";
const buttonClassInactive = "text-secondary-foreground";

export function Navigation() {
  return (
    <div class="fixed overflow-hidden md:absolute bottom-0 right-0 md:right-4 w-full md:w-auto md:bottom-1/2 flex md:flex-col bg-secondary border-t md:border-none border-secondary md:rounded-md">
      <a
        href="#shortener"
        class={buttonVariants({
          variant: "ghost",
          class: clsx(
            buttonClassBase,
            currentSection() === Sections.Shortner
              ? buttonClassActive
              : buttonClassInactive
          ),
        })}
      >
        Shortener
      </a>
      <a
        href="#history"
        class={buttonVariants({
          variant: "ghost",
          class: clsx(
            buttonClassBase,
            currentSection() === Sections.History
              ? buttonClassActive
              : buttonClassInactive
          ),
        })}
      >
        History
      </a>
      <a
        href="#profile"
        class={buttonVariants({
          variant: "ghost",
          class: clsx(
            buttonClassBase,
            currentSection() === Sections.Profile
              ? buttonClassActive
              : buttonClassInactive
          ),
        })}
      >
        Profile
      </a>
      <AuthDialog />
    </div>
  );
}
