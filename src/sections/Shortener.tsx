import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sections, setCurrentSection } from "~/state";

export default function ShortenerSection() {
  const observer = new IntersectionObserver(
    () => {
      setCurrentSection(Sections.Shortner);
      //   location.hash = Sections.Shortner;
      history.replaceState({}, "", "#" + Sections.Shortner);
    },
    {
      threshold: 1,
    }
  );

  return (
    <div
      class="snap-start h-screen flex flex-col items-center justify-center space-y-6"
      id={Sections.Shortner}
      ref={(el) => observer.observe(el)}
    >
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">
        URL Shortener
      </h1>
      <div class="w-full max-w-xl flex items-center justify-center space-x-2">
        <Input
          class="flex-grow bg-white"
          placeholder="Enter the long URL"
          type="url"
        />
        <Button class="bg-blue-500 text-white" type="submit">
          Shorten
        </Button>
      </div>
      <div class="w-full max-w-xl flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 p-4 rounded-md">
        <p class="flex-grow text-gray-800 dark:text-gray-200 overflow-hidden overflow-ellipsis">
          shortened.url/123456
        </p>
        <Button
          class="text-blue-500 border-blue-500 bg-white"
          variant="outline"
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
