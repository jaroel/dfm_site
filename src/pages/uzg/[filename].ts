import type {APIRoute} from 'astro'
import {getFileStream} from '../../uzg'

export const get: APIRoute = async ({params}) => {
  const stream = await getFileStream(params.filename ?? '')

  if (stream) {
    return new Response(stream, {headers: {'content-type': 'audio/mpeg'}})
  }

  return new Response(null, {
    status: 404,
    statusText: 'Not found',
  })
}
