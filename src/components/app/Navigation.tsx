import { Sections, currentSection } from "~/state";
import { Button, buttonVariants } from "../ui/button";
import clsx from "clsx";
import { Separator } from "../ui/separator";
import { AuthDialog } from "./AuthDialog";

export function Navigation() {
  return (
    <div class="fixed overflow-hidden md:absolute bottom-0 right-0 md:right-4 w-full md:w-auto md:bottom-1/2 flex md:flex-col bg-white dark:bg-gray-800 border-t md:border-none border-gray-300 dark:border-gray-600 md:rounded-md">
      <a
        href="#shortener"
        class={buttonVariants({
          variant: "ghost",
          class: clsx(
            "text-gray-600 dark:text-gray-300 flex-grow rounded-none dark:hover:text-gray-600",
            currentSection() === Sections.Shortner &&
              "font-bold bg-gray-200 dark:text-gray-600"
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
            "text-gray-600 dark:text-gray-300 flex-grow rounded-none dark:hover:text-gray-600",
            currentSection() === Sections.History &&
              "font-bold bg-gray-200 dark:text-gray-600"
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
            "text-gray-600 dark:text-gray-300 flex-grow rounded-none dark:hover:text-gray-600",
            currentSection() === Sections.Profile &&
              "font-bold bg-gray-200 dark:text-gray-600"
          ),
        })}
      >
        Profile
      </a>
      <AuthDialog />
    </div>
  );
}
