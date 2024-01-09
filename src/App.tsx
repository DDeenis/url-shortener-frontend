import { Show, onMount } from "solid-js";
import { Navigation } from "./components/app/Navigation";
import HistorySection from "./sections/History";
import ProfileSection from "./sections/Profile";
import ShortenerSection from "./sections/Shortener";
import { ThemeToggle } from "./components/app/ThemeToggle";
import { isLogged, setUser } from "./state";
import { Toaster } from "./components/ui/toast";

function App() {
  onMount(() => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView();
    }

    fetch("/api/profile")
      .then((r) => r.json())
      .then((r) => {
        if (typeof r === "string") {
          console.warn(r);
          setUser(undefined);
          return;
        }

        setUser(r);
      })
      .catch((err) => {
        console.error(err);
        setUser(undefined);
      });
  });

  return (
    <>
      <main class="w-full h-screen overflow-y-scroll scroll-smooth snap snap-y snap-mandatory bg-background p-2 md:p-0">
        <ShortenerSection />
        <Show when={isLogged()}>
          <HistorySection />
          <ProfileSection />
        </Show>
        <Navigation />
        <ThemeToggle />
      </main>
      <Toaster />
    </>
  );
}

export default App;
