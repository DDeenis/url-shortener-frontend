import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import {
  Sections,
  setCurrentSection,
  setTotalUrlsShortened,
  setUser,
  totalUrlsShortened,
  user,
} from "~/state";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { Button } from "~/components/ui/button";
import { EditProfileDialog } from "~/components/app/EditProfileDialog";

const stringToColor = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return color;
};

function getContrastYIQ(hexcolor: string) {
  var r = parseInt(hexcolor.substring(1, 3), 16);
  var g = parseInt(hexcolor.substring(3, 5), 16);
  var b = parseInt(hexcolor.substring(5, 7), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export default function ProfileSection() {
  const [isLoading, setIsLoding] = createSignal(false);

  let el: HTMLDivElement | undefined;

  const useVisibilityObserver = createVisibilityObserver({ threshold: 1 });
  const visible = useVisibilityObserver(() => el);

  createEffect(() => {
    if (visible()) {
      setCurrentSection(Sections.Profile);
      history.replaceState({}, "", "#" + Sections.Profile);
    }
  });

  onMount(() => {
    fetch("/api/url/counters")
      .then((r) => r.json())
      .then((r) => {
        if (typeof r === "string") {
          throw r;
        }

        setTotalUrlsShortened(r.all);
      })
      .catch((err) => console.error(err));
  });

  const avatarText = createMemo(() => {
    const userData = user();
    if (!userData) return "?";
    return userData.username
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  });
  const avatarBgColor = createMemo(() => stringToColor(avatarText()));
  const avatarTextColor = createMemo(() => getContrastYIQ(avatarBgColor()));

  const onLogOut = () => {
    setIsLoding(true);
    fetch("/api/logout", {
      method: "POST",
    })
      .then((r) => {
        setIsLoding(false);
        if (r.ok) {
          setUser(undefined);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoding(false);
      });
  };

  return (
    <div
      class="snap-start h-screen flex flex-col items-center justify-center space-y-6"
      id={Sections.Profile}
      ref={el}
    >
      <div class="w-full max-w-xl flex flex-col items-center">
        <h2 class="text-2xl font-bold text-primary">Profile</h2>
        <div class="w-full mt-4 border-t border-secondary">
          <div class="flex items-center space-x-4 p-4 border-b border-secondary">
            <div
              class="h-24 w-24 flex items-center justify-center text-2xl font-bold rounded-full select-none"
              style={{
                "background-color": avatarBgColor(),
                color: avatarTextColor(),
              }}
            >
              {avatarText()}
            </div>
            <div>
              <p class="text-primary font-bold">{user()?.username}</p>
              <p class="text-muted-foreground">{user()?.email}</p>
            </div>
          </div>
          <div class="py-2 border-b border-secondary">
            <p class="text-primary font-bold">Total URLs Shortened</p>
            <p class="text-muted-foreground">{totalUrlsShortened()}</p>
          </div>
          <div class="py-2 border-b border-secondary">
            <p class="text-primary font-bold">Account Created</p>
            <time class="text-muted-foreground">
              {new Date(user()?.registerAt ?? 0).toLocaleDateString()}
            </time>
          </div>
          <div class="flex gap-2 mt-2">
            <EditProfileDialog />
            <Button
              class="bg-destructive text-destructive-foreground hover:text-primary-foreground"
              disabled={isLoading()}
              onClick={onLogOut}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
