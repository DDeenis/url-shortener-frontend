import { onMount } from "solid-js";
import { Navigation } from "./components/app/Navigation";
import HistorySection from "./sections/History";
import ProfileSection from "./sections/Profile";
import ShortenerSection from "./sections/Shortener";
import { ThemeToggle } from "./components/app/ThemeToggle";

function App() {
  onMount(() => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView();
    }
  });

  return (
    <main class="w-full h-screen overflow-y-scroll scroll-smooth snap snap-y snap-mandatory bg-background p-2 md:p-0">
      <ShortenerSection />
      <HistorySection />
      <ProfileSection />
      <Navigation />
      <ThemeToggle />
    </main>
  );
}

export default App;
