import type {FTP} from 'ftp-ts'
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
