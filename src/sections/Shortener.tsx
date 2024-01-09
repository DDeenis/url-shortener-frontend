import { For, Show, createEffect, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Validators, createForm } from "~/lib/forms";
import { getFullShortUrl } from "~/lib/utils";
import {
  PAGE_SIZE,
  Sections,
  setCurrentSection,
  setTotalUrlsShortened,
  setUrls,
} from "~/state";
import { ShortUrl } from "~/types";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { showToast } from "~/components/ui/toast";

const shortUrlRegex = new RegExp(
  `${location.protocol}//${location.host}/s/[A-Za-z0-9_-]{21}`
);

export default function ShortenerSection() {
  const form = createForm<{ originalUrl: string }>();
  const [shortUrl, setShortUrl] = createSignal<ShortUrl>();

  let el: HTMLDivElement | undefined;

  const useVisibilityObserver = createVisibilityObserver({ threshold: 1 });
  const visible = useVisibilityObserver(() => el);

  createEffect(() => {
    if (visible()) {
      setCurrentSection(Sections.Shortner);
      history.replaceState({}, "", "#" + Sections.Shortner);
    }
  });

  const fieldOptions = form.register("originalUrl", {
    required: true,
    validators: [
      Validators.max(2048),
      Validators.url,
      (value) => {
        return value && shortUrlRegex.test(value)
          ? { type: "already-shorted", message: "URL is already shorted" }
          : undefined;
      },
    ],
  });

  const onShortenSubmit = form.onSubmit((values) => {
    if (values.originalUrl) {
      fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((r) => {
          if (typeof r === "string") {
            console.error(r);
            return;
          }

          setShortUrl(r);
          setUrls((v) => {
            if (v.length >= PAGE_SIZE) {
              v.pop();
            }
            return [r, ...v];
          });
          setTotalUrlsShortened((v) => v + 1);
        })
        .catch((err) => console.error(err));
    }
  });

  const onUrlCopy = () => {
    navigator.clipboard.writeText(getFullShortUrl(shortUrl()?.id));
    showToast({
      title: "Copied!",
      description: "Shortened link was copied to clipboard",
    });
  };

  return (
    <div
      class="snap-start h-screen flex flex-col items-center justify-center space-y-6"
      id={Sections.Shortner}
      ref={el}
    >
      <h1 class="text-4xl font-bold text-primary">URL Shortener</h1>
      <form
        novalidate
        class="w-full max-w-xl flex items-start justify-center space-x-2"
        onSubmit={onShortenSubmit}
      >
        <div class="w-full flex flex-col gap-2">
          <Input
            class="flex-grow"
            classList={{
              "outline outline-2 outline-error-foreground":
                !!form.error.originalUrl?.length,
            }}
            placeholder="Enter the long URL"
            type="url"
            {...fieldOptions}
          />
          <Show when={!!form.error.originalUrl}>
            <For each={form.error.originalUrl}>
              {(error) => (
                <span class="text-error-foreground text-sm">
                  {error.message}
                </span>
              )}
            </For>
          </Show>
        </div>
        <Button class="bg-primary text-primary-foreground" type="submit">
          Shorten
        </Button>
      </form>
      <Show when={shortUrl()}>
        <div class="w-full max-w-xl flex items-center justify-center space-x-2 border border-secondary p-4 rounded-md">
          <p class="flex-grow text-primary overflow-hidden overflow-ellipsis">
            {getFullShortUrl(shortUrl()?.id)}
          </p>
          <Button
            class="text-primary border-pritext-primary"
            variant="outline"
            onClick={onUrlCopy}
          >
            Copy
          </Button>
        </div>
      </Show>
    </div>
  );
}
