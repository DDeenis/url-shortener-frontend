/* @refresh reload */
import { render } from "solid-js/web";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManager,
} from "@kobalte/core";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

render(
  () => (
    <>
      <ColorModeScript storageType={cookieStorageManager.type} />
      <ColorModeProvider storageManager={cookieStorageManager}>
        <App />
      </ColorModeProvider>
    </>
  ),
  root!
);
