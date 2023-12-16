// @refresh reload
import { Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import bgImage from "~/assets/dfm_studio-blurred.jpg";
import Player from "./components/Player";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Dinxper FM - het swingende geluid van Dinxperlo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body
        class="text-slate-50 h-screen bg-gray-600 bg-center bg-cover bg-fixed font-[Cabin]"
        style={{ "background-image": `url(${bgImage})` }}
      >
        <ErrorBoundary>
          <Player></Player>
        </ErrorBoundary>
        <div class="h-screen overflow-auto bg-black/75">
          <div class="max-w-7xl mx-auto">
            <Suspense>
              <ErrorBoundary>
                <Routes>
                  <FileRoutes />
                </Routes>
              </ErrorBoundary>
            </Suspense>
            <nav class="text-black bg-gray-100 p-2 flex justify-center">
              <ul class="flex flex-wrap">
                <li class="ml-1 mr-2">
                  <A href="/" title="DinxperFM home page">
                    Home page
                  </A>
                </li>
                <li class="ml-1 mr-2">
                  <a
                    href="https://www.facebook.com/DinxperFM"
                    title="DinxperFM Facebook pagina"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-facebook inline"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                    </svg>
                    Facebook pagina
                  </a>
                </li>
                <li class="ml-1 mr-2">
                  <a
                    href="mailto:info@dinxperfm.nl"
                    title="Stuur een email naar info@dinxperfm.nl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-envelope-fill inline"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"></path>
                    </svg>
                    info@dinxperfm.nl
                  </a>
                </li>
                <li class="ml-1 mr-2">
                  Bezoekadres: Europastraat 8, 7091 XC, Dinxperlo
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <Scripts />
      </Body>
    </Html>
  );
}
