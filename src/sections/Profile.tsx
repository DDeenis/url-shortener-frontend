import { Sections, setCurrentSection } from "~/state";

export default function ProfileSection() {
  const observer = new IntersectionObserver(
    () => {
      setCurrentSection(Sections.Profile);
      //   location.hash = Sections.Profile;
      history.replaceState({}, "", "#" + Sections.Profile);
    },
    {
      threshold: 1,
    }
  );

  return (
    <div
      class="snap-start h-screen flex flex-col items-center justify-center space-y-6"
      id={Sections.Profile}
      ref={(el) => observer.observe(el)}
    >
      <div class="w-full max-w-xl flex flex-col items-center">
        <h2 class="text-2xl font-bold text-primary">Profile</h2>
        <div class="w-full mt-4 border-t border-secondary">
          <div class="flex items-center space-x-4 p-4 border-b border-secondary">
            <div class="h-24 w-24 bg-blue-500 text-white flex items-center justify-center text-2xl font-bold rounded-full">
              UN
            </div>
            <div>
              <p class="text-primary font-bold">User Name</p>
              <p class="text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <div class="py-2 border-b border-secondary">
            <p class="text-primary font-bold">Total URLs Shortened:</p>
            <p class="text-muted-foreground">125</p>
          </div>
          <div class="py-2 border-b border-secondary">
            <p class="text-primary font-bold">Account Created:</p>
            <time class="text-muted-foreground">2023-01-01</time>
          </div>
        </div>
      </div>
    </div>
  );
}
