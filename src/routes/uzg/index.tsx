import { Fragment, component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { groupBy } from "~/groupby";
import { getUzgListing } from "~/uzg";

import Controls from "~/components/Controls";
import Player from "~/components/Player";

import Logo from "~/assets/logodinxperfm.png?w=128&jsx";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		maxAge: 3600,
	});
};

export const useRecordings = routeLoader$(async ({ cacheControl }) => {
	cacheControl({
		maxAge: 3600,
	});
	return await getUzgListing();
});

const weekday_long_c = {
	0: "Zondag",
	1: "Maandag",
	2: "Dinsdag",
	3: "Woensdag",
	4: "Donderdag",
	5: "Vrijdag",
	6: "Zaterdag",
};

const month_long_c = {
	0: "Januari",
	1: "Februari",
	2: "Maart",
	3: "April",
	4: "Mei",
	5: "Juni",
	6: "Juli",
	7: "Augustus",
	8: "September",
	9: "Oktober",
	10: "November",
	11: "December",
};

export default component$(() => {
	const entries = useRecordings();
	return (
		<>
			<div class="flex justify-evenly">
				<div class="flex flex-auto items-center">
					<div class="mx-12 my-8">
						<Link href="/">
							<Logo alt="DinxperFM logo" class="mx-auto" />
						</Link>
						<p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
					</div>
					<h1 class="text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl">
						Uitzending gemist
					</h1>
				</div>
			</div>
			<div class="bg-gray-100 p-9 text-black">
				<div class="max-w-7xl px-6 text-center">
					<p class="mx-auto mt-5 max-w-5xl text-xl text-gray-500">
						Dit zijn opnamen van uitzendingen op de Dinxper FM stream. Gebruik
						de speler om de uitzending terug te luisteren. Klik de link om de
						uitzending op te slaan.
					</p>
				</div>
				<hr class="my-8" />

				{entries.value.length === 0 && (
					<p>
						Helaas zijn de opnamen op dit moment niet beschikbaar. Probeer het
						later nog eens.
					</p>
				)}

				<Player>
					{groupBy(entries.value, (item) => item.year).map((years) => (
						<Fragment key={`key-byYear-${years.head.timestamp}`}>
							<h2 class="text-xl text-gray-800">{years.key}</h2>
							<div class="mb-6 ml-4">
								{groupBy(years.members, (item) => item.month).map((months) => {
									const month = month_long_c[months.head.month];
									return (
										<Fragment key={`key-byMonth-${months.head.timestamp}`}>
											<h3 class="mt-2 text-lg text-gray-800">{month}</h3>
											<div class="mb-6 ml-4">
												<ol>
													{groupBy(months.members, (item) => item.day).map(
														(days) => {
															const weekday = weekday_long_c[days.head.weekday];
															return (
																<li key={`key-byDay-${days.head.timestamp}`}>
																	<div class="flex-start flex items-center pt-3">
																		<div class="mr-3 h-2 w-2 rounded-full bg-gray-400" />
																		<p class="text-l text-gray-800">{`${weekday} ${
																			days.head.day
																		} ${month.toLowerCase()}`}</p>
																	</div>
																	<div class="ml-4 mt-2 flex flex-wrap gap-2">
																		{days.members.map((recording) => (
																			<div
																				class="flex-row text-center"
																				key={`key-recording-${recording.timestamp}`}
																			>
																				<Controls
																					title={`Uitzending Dinxper FM van ${weekday} ${recording.day} ${month} ${recording.year} om ${recording.hour} uur`}
																					label={`${recording.hour}:00`}
																					src={recording.src}
																				/>
																				<a
																					class="text-sm text-gray-800 underline"
																					href={recording.src}
																				>
																					download
																				</a>
																			</div>
																		))}
																	</div>
																</li>
															);
														},
													)}
												</ol>
											</div>
										</Fragment>
									);
								})}
							</div>
						</Fragment>
					))}
				</Player>
			</div>
		</>
	);
});

export const head: DocumentHead = {
	title: "Uitzending gemist - Dinxper FM - het swingende geluid van Dinxperlo",
	meta: [
		{
			name: "description",
			content: "Dit zijn opnamen van uitzendingen op de Dinxper FM stream.",
		},
	],
};
