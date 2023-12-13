import { Show, onMount } from "solid-js";
import { Navigation } from "./components/app/Navigation";
import HistorySection from "./sections/History";
import ProfileSection from "./sections/Profile";
import ShortenerSection from "./sections/Shortener";
import { TbMoon, TbSun } from "solid-icons/tb";
import { Toggle } from "./components/ui/toggle";

function App() {
  const isDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;

  onMount(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark");
    }

    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView();
    }
  });

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
  };

  return (
    <main class="w-full h-screen overflow-y-scroll scroll-smooth snap snap-y snap-mandatory bg-gray-100 dark:bg-gray-700 p-2 md:p-0">
      <ShortenerSection />
      <HistorySection />
      <ProfileSection />
      <Navigation />
      <Toggle
        class="fixed top-4 right-4"
        onChange={toggleTheme}
        defaultPressed={isDarkTheme}
      >
        {(state) => (
          <Show when={state.pressed()} fallback={<TbMoon class="w-6 h-6" />}>
            <TbSun class="stroke-white w-6 h-6" />
          </Show>
        )}
      </Toggle>
    </main>
  );
}

export default App;
