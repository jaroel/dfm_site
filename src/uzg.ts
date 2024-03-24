import { getFtpListing } from "./ftp";

export async function fetchUzgListing() {
	// Current hour isn't uploaded fully yet
	const threshold_timestamp = new Date().getTime() - 3600000;
	return (
		(await getFtpListing())
			.map((item) => item.name)
			// .filter((file) => file.endsWith("-12-2023-19-00.mp3"))
			.filter((file) => file.endsWith(".mp3"))
			.map((file_name) => {
				const [day, month, year, hour] = file_name.split(/[-.]/);
				return {
					src: `/uzg/${file_name}`,
					datetime: new Date(`${year}-${month}-${day}T${hour}:00`),
				};
			})
      .filter((el) => el.datetime.getTime() <= threshold_timestamp)
      .sort((a, b) => (a.datetime >= b.datetime ? -1 : 1))
	);
}
