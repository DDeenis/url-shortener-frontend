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
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Profile
        </h2>
        <div class="w-full mt-4 border-t border-gray-300 dark:border-gray-600">
          <div class="flex items-center space-x-4 p-4 border-b border-gray-300 dark:border-gray-600">
            <div class="h-24 w-24 bg-blue-500 text-white flex items-center justify-center text-2xl font-bold rounded-full">
              UN
            </div>
            <div>
              <p class="text-gray-800 dark:text-gray-200 font-bold">
                User Name
              </p>
              <p class="text-gray-600 dark:text-gray-400">user@example.com</p>
            </div>
          </div>
          <div class="py-2 border-b border-gray-300 dark:border-gray-600">
            <p class="text-gray-800 dark:text-gray-200 font-bold">
              Total URLs Shortened:
            </p>
            <p class="text-gray-600 dark:text-gray-400">125</p>
          </div>
          <div class="py-2 border-b border-gray-300 dark:border-gray-600">
            <p class="text-gray-800 dark:text-gray-200 font-bold">
              Account Created:
            </p>
            <time class="text-gray-600 dark:text-gray-400">2023-01-01</time>
          </div>
        </div>
      </div>
    </div>
  );
}
