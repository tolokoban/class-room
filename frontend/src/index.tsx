import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider, Theme } from "@tolokoban/ui";

import { State } from "@/state";

import App from "./app";
import FontDosis from "./fonts/dosis";

import "./index.css";
import { NotificationProvider } from "./components/Notification";

const queryClient = new QueryClient();

async function start() {
  Theme.apply({
    colors: {
      neutral: ["#556", "#ddd"],
      primary: "#37e",
      secondary: "rgb(195, 117, 0)",
    },
  });
  FontDosis.load300();
  FontDosis.load700();
  const container = document.getElementById("app");
  if (!container) throw Error("Missing element with id #app!");
  createRoot(container).render(<MainPage />);

  const splash = document.getElementById("tgd-logo");
  if (splash) {
    splash.classList.add("vanish");
    window.setTimeout(() => splash.parentNode?.removeChild(splash), 1000);
  }
}

function MainPage() {
  const lang = State.language.useValue();
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <App lang={lang} />
        <NotificationProvider />
      </ModalProvider>
    </QueryClientProvider>
  );
}

start();
