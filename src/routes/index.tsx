import { Slot, component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

import Player from "~/components/Player";
import Controls from "~/components/Controls";

// @ts-ignore
import Logo from "~/assets/logodinxperfm.png?jsx&w=768";
// @ts-ignore
import Programmering from "~/assets/programmering.jpg?jsx&w=1085";
import programmering_source from "~/assets/programmering.jpg";

// @ts-ignore
import Logomakt from "~/assets/sponsors/makt.jpg?jsx&w=250";
// @ts-ignore
import Logo13 from "~/assets/sponsors/logo13.jpg?jsx&w=250";
// @ts-ignore
import Logo15 from "~/assets/sponsors/logo15.jpg?jsx&w=250";
// @ts-ignore
import Logo16 from "~/assets/sponsors/logo16.jpg?jsx&w=250";
// @ts-ignore
import Logo23 from "~/assets/sponsors/logo23.jpg?jsx&w=250";
// @ts-ignore
import Olddutch from "~/assets/sponsors/olddutch.jpg?jsx&w=250";
// @ts-ignore
import Mashops from "~/assets/sponsors/mashops.jpg?jsx&w=250";
// @ts-ignore
import Harmtakke from "~/assets/sponsors/logo-harmtakke.jpg?jsx&w=250";
// @ts-ignore
import Etenbijrico from "~/assets/sponsors/etenbijrico.jpg?jsx&w=250";
// @ts-ignore
import Blauwemeer from "~/assets/sponsors/logo-blauwe-meer.png?jsx&w=250";
// @ts-ignore
import Tibatek_logo_web from "~/assets/sponsors/tibatek_logo_web.png?jsx&w=250";
// @ts-ignore
import LogoDedriesprong from "~/assets/sponsors/dedriesprong.jpg?jsx&w=250";

export default component$(() => {
	return (
		<>
			<div class="mb-10 mt-10 flex justify-evenly">
				<div class="max-w-sm">
					<Logo alt="Het swingende geluid van Dinxperlo!" loading="eager" />
					<p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
				</div>
			</div>
			<nav class="flex justify-evenly bg-gray-100">
				<ul class="my-1 flex list-none flex-wrap">
					<li>
						<Player>
							<Controls
								title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!"
								label="Luister live!"
								src="https://stream.dinxperfm.nl/1"
							/>
						</Player>
					</li>
					<li>
						<Link
							class="mt-3 inline-block px-4 text-blue-700 no-underline"
							href="/uzg"
						>
							Uitzending gemist?
						</Link>
					</li>
				</ul>
			</nav>
			<div class="mt-10 flex justify-center">
				<Programmering
					alt="Programmering vanaf 4 maart 2023 van Dinxperlo FM "
					loading="eager"
				/>
			</div>
			<div class="text-center">
				<a target="blank" class="text-blue-400" href={programmering_source}>
					In nieuwe pagina openen
				</a>
			</div>
			<div class="mt-10 text-center">
				<h2 class="mb-8 text-2xl">
					Dinxper FM wordt mede mogelijk gemaakt door
				</h2>
				<div class="flex flex-row flex-wrap justify-evenly">
					<Sponsor
						href="https://www.facebook.com/markt.dinxperlo/"
						title="De markt van Dinxperlo"
					>
						<Logomakt alt="Logo van de markt van Dinxperlo" />
					</Sponsor>
					<Sponsor
						href="http://www.naaiateliermoniqueharmsen.nl/"
						title="Naai Atelier Monique Harmsen"
					>
						<Logo13 alt="Logo van Naai Atelier Monique Harmsen" />
					</Sponsor>
					<Sponsor href="https://podesta.nl/" title="Podesta">
						<Logo15 alt="Logo van Podesta" />
					</Sponsor>
					<Sponsor
						href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/"
						title="Adviesbureau Roenhorst"
					>
						<Logo16 alt="Logo van Adviesbureau Roenhorst" />
					</Sponsor>
					<Sponsor href="http://www.vvnf.nl/home" title="VVNF Dinxperlo">
						<Logo23 alt="Logo van VVNF Dinxperlo" />
					</Sponsor>
					<Sponsor href="https://www.olddutchdinxperlo.nl/" title="Old Dutch">
						<Olddutch alt="Logo van Old Dutch" />
					</Sponsor>
					<Sponsor
						href="https://www.ma-shops.nl/?ref=dinxperfm"
						title="MA-Shops"
					>
						<Mashops alt="Logo van MA-Shops" />
					</Sponsor>
					<Sponsor href="https://harmtakke.nl" title="Harm Takke">
						<Harmtakke alt="Logo van Harm Takke" />
					</Sponsor>
					<Sponsor href="https://etenbijrico.nl" title="Eten bij Rico">
						<Etenbijrico alt="Logo van Eten bij Rico" />
					</Sponsor>
					<Sponsor href="https://hetblauwemeer.nl" title="Het Blauwe Meer">
						<Blauwemeer alt="Logo van Het Blauwe Meer" />
					</Sponsor>
					<Sponsor href="https://tibatek.de" title="Tibatek">
						<Tibatek_logo_web
							style="background-color: white; padding: 4px"
							alt="Logo van Tibatek"
						/>
					</Sponsor>

					<Sponsor
						href="https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL"
						title="Cafetaria de Driesprong"
					>
						<LogoDedriesprong alt="Logo van Cafetaria de Driesprong" />
					</Sponsor>
				</div>
			</div>
		</>
	);
});

const Sponsor = component$((props: { href: string; title: string }) => {
	return (
		<div class="p-1 mb-2">
			<a href={props.href} title={props.title} target="blank">
				<Slot />
			</a>
		</div>
	);
});

export const head: DocumentHead = {
	title: "Dinxper FM - het swingende geluid van Dinxperlo",
	meta: [
		{
			name: "description",
			content: "Dinxper FM - het swingende geluid van Dinxperlo",
		},
	],
};
