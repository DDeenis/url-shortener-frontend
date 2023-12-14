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
      <h1 class="text-4xl font-bold text-primary">URL Shortener</h1>
      <div class="w-full max-w-xl flex items-center justify-center space-x-2">
        <Input class="flex-grow" placeholder="Enter the long URL" type="url" />
        <Button class="bg-primary text-primary-foreground" type="submit">
          Shorten
        </Button>
      </div>
      <div class="w-full max-w-xl flex items-center justify-center space-x-2 border border-secondary p-4 rounded-md">
        <p class="flex-grow text-primary overflow-hidden overflow-ellipsis">
          shortened.url/123456
        </p>
        <Button class="text-primary border-pritext-primary" variant="outline">
          Copy
        </Button>
      </div>
    </div>
  );
}
