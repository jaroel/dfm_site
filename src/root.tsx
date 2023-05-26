import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

import bgImage from "~/assets/dfm_studio-blurred.jpg";
const bodyStyles = `background-image: url('${bgImage}')`;

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="UTF-8" />
        <title>Dinxper FM - het swingende geluid van Dinxperlo</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width" />
        <RouterHead />
      </head>
      <body
        class="text-slate-50 h-screen bg-center bg-cover bg-fixed font-[Cabin]"
        style={bodyStyles}
      >
        <div class="h-100 overflow-auto bg-black/75">
          <div class="max-w-7xl mx-auto">
            <RouterOutlet />
            <ServiceWorkerRegister />
          </div>
        </div>
      </body>
    </QwikCityProvider>
  );
});
