import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

export const getConnection = async () => {
  return await FTP.connect({
    host: "dinxperfm.freeddns.org",
    user: "UZG",
    password: "4862KpZ2",
  });
};

export async function getFtpListing() {
  const connection = await getConnection();
  const listing = await connection.list();
  connection.end();
  return listing.filter(
    (value): value is IListingElement => typeof value !== "string",
  );
}

export async function getUzgListing() {
  // Current hour isn't uploaded fully yet
  const threshold_timestamp = new Date().getTime() - 3600000;
  return (
    (await getFtpListing())
      .map((item) => item.name)
      // .filter((file) => file.endsWith("-12-2023-19-00.mp3"))
      .filter((file) => file.endsWith(".mp3"))
      .map((file_name) => {
        const [day, month, year, hour] = file_name.split(/[-.]/);
        const minute = "00";
        const datetime = new Date(`${year}-${month}-${day}T${hour}:${minute}`);

        return {
          day: datetime.getDate(),
          month: datetime.getMonth() as
            | 0
            | 1
            | 2
            | 3
            | 4
            | 5
            | 6
            | 7
            | 8
            | 9
            | 10
            | 11,
          year: datetime.getFullYear(),
          weekday: datetime.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          hour: datetime.getHours(),
          src: `/uzg/${file_name}`,
          key: datetime.getTime(),
        };
      })
      .filter((el) => el.key <= threshold_timestamp)
      .sort((a, b) => (a.key >= b.key ? -1 : 1))
  );
}
