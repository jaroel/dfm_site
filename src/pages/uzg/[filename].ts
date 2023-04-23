import type {APIRoute} from 'astro'
import {connectToFtp} from '../../uzg'

export const get: APIRoute = async ({params}) => {
  if (!params.filename) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    })
  }

  const connection = await connectToFtp()
  const stream = await connection.get(params.filename)
  stream.addListener('close', () => {
    connection.destroy()
  })
  return new Response(stream, {headers: {'content-type': 'audio/mpeg'}})
}
