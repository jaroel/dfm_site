import '@total-typescript/ts-reset' // eslint-disable-line import/no-unassigned-import
import type {FTP, IListingElement} from 'ftp-ts'
// Hack https://github.com/vitejs/vite/issues/9061#issuecomment-1203035009
import $FTP from 'ftp-ts'
// @ts-expect-error: .default is a hack.
const ftpClient: FTP = $FTP.default || $FTP // eslint-disable-line @typescript-eslint/no-unsafe-assignment
// End hack

export async function connectToFtp() {
  return ftpClient.connect({
    host: '86.81.98.192',
    user: 'UZG',
    password: '4862KpZ2',
  })
}

export async function getFtpListing() {
  const connection = await connectToFtp()
  const listing = await connection.list()
  connection.destroy()
  return listing.filter((value): value is IListingElement => typeof value !== 'string')
}

export type Recording = {
  title: string;
  filename: string;
  url: string;
  date: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  monthIndex: number;
  monthDisplayUC: string;
  monthDisplayLC: string;
  weekday: number;
  weekdayDisplayUC: string;
  weekdayDisplayLC: string;
  weekNumber: number;
}
