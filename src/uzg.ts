import '@total-typescript/ts-reset' // eslint-disable-line import/no-unassigned-import

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
