import { createSignal } from "solid-js";

export enum Sections {
  Shortner = "shortener",
  History = "history",
  Profile = "profile",
}

export const [currentSection, setCurrentSection] = createSignal<Sections>(
  Sections.Shortner
);
