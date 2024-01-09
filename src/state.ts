import { createSignal } from "solid-js";
import { ShortUrl, User } from "./types";
import { makePersisted } from "@solid-primitives/storage";

export enum Sections {
  Shortner = "shortener",
  History = "history",
  Profile = "profile",
}

export const [currentSection, setCurrentSection] = createSignal<Sections>(
  Sections.Shortner
);

export const [user, setUser] = makePersisted(createSignal<User>(), {
  name: "user",
});
export const isLogged = () => !!user();

export const [urls, setUrls] = createSignal<ShortUrl[]>([]);
export const PAGE_SIZE = 5;

export const [totalUrlsShortened, setTotalUrlsShortened] = createSignal(0);
