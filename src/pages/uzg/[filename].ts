import type {APIRoute} from 'astro'
import {FTP} from 'ftp-ts'

export const getFileStream = async (filename: string) => {
  filename = filename.trim()
  if (!filename) {
    return undefined
  }

  const connection = await FTP.connect({
    host: '86.81.98.192',
    user: 'UZG',
    password: '4862KpZ2',
  })
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
