import type {APIRoute} from 'astro'
import {getRecordings} from '../../uzg'

export const get: APIRoute = async () => {
  const recordings = await getRecordings()
  return {body: JSON.stringify(recordings)}
}
