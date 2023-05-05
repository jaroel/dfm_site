import type {APIRoute} from 'astro'
import {connectToFtp} from '../../uzg'

export const getFileStream = async (filename: string) => {
  filename = filename.trim()
  if (!filename) {
    return undefined
  }

  const connection = await connectToFtp()
  const stream = await connection.get(filename)
  stream.addListener('close', () => {
    connection.destroy()
  })
  return stream
}

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
