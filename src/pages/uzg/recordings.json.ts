import type {APIRoute} from 'astro'
import {getFtpListing} from '../../uzg'

function getWeekNumber(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  return Math.ceil(
    (((d.getFullYear() - yearStart.getFullYear()) / 86_400_000) + 1) / 7,
  )
}

const monthNamesUpperCase = [
  'Januari',
  'Februari',
  'Maart',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Augustus',
  'September',
  'Oktober',
  'November',
  'December',
]
const monthNamesLowerCase = monthNamesUpperCase.map(month => month.toLowerCase())
const weekdayDisplayUpperCase = [
  'Zondag',
  'Maandag',
  'Dinsdag',
  'Woensdag',
  'Donderdag',
  'Vrijdag',
  'Zaterdag',
]
const weekdayDisplayLowerCase = weekdayDisplayUpperCase.map(day => day.toLowerCase())
const nameToDate = /(\d\d)-(\d\d)-(\d\d\d\d)-(\d\d)-(\d\d).mp3/

const getRecordings = (listing: Awaited<ReturnType<typeof getFtpListing>>) => listing
  .map(value => {
    const parsedName = nameToDate
      .exec(value.name)
      ?.slice(1, 6)
      .map(value => Number.parseInt(value, 10))

    if (!parsedName) {
      return
    }

    return {
      filename: value.name,
      day: parsedName[0]!,
      month: parsedName[1]!,
      monthIndex: (parsedName[1]!) - 1,
      year: parsedName[2]!,
      hour: parsedName[3]!,
      minute: parsedName[4]!,
    }
  })
  .filter(Boolean)
  .map(value => {
    const date = new Date(
      value.year,
      value.monthIndex,
      value.day,
      value.hour,
      value.minute,
    )
    const weekday = date.getDay()
    const recording = {
      ...value,
      title: '',
      date,
      monthDisplayUpperCase: monthNamesUpperCase[value.monthIndex] ?? '',
      monthDisplayLowerCase: monthNamesLowerCase[value.monthIndex] ?? '',
      weekday,
      weekdayDisplayUpperCase: weekdayDisplayUpperCase[weekday] ?? '',
      weekdayDisplayLowerCase: weekdayDisplayLowerCase[weekday] ?? '',
      url: `/uzg/${value.filename}`,
      weekNumber: getWeekNumber(date),
    }
    recording.title = `Uitzending Dinxper FM van ${recording.weekdayDisplayLowerCase} ${recording.day} ${recording.monthDisplayLowerCase} ${recording.year}`
    return recording
  })
  .sort((a, b) => ((a.date || 0) >= (b.date || 0) ? -1 : 1))

export type Recordings = ReturnType<typeof getRecordings>

export const get: APIRoute = async () => {
  const listing = await getFtpListing()
  return {body: JSON.stringify(getRecordings(listing))}
}
