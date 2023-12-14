import { As, useColorMode } from "@kobalte/core";
import { TbCpu, TbMoon, TbSun } from "solid-icons/tb";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setColorMode } = useColorMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As
          component={Button}
          variant="ghost"
          size="sm"
          class="w-9 h-9 px-0 fixed top-4 right-4"
        >
          <TbSun class="rotate-0 scale-100 transition-all h-6 w-6 dark:-rotate-90 dark:scale-0" />
          <TbMoon class="absolute rotate-90 scale-0 transition-all h-6 w-6 dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle theme</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setColorMode("light")}>
          <TbSun class="mr-2 h-6 w-6" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("dark")}>
          <TbMoon class="mr-2 h-6 w-6" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("system")}>
          <TbCpu class="mr-2 h-6 w-6" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
