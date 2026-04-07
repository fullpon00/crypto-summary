import { createHash } from 'crypto'

export function createDedupeHash(url: string, title: string): string {
  return createHash('sha256').update(`${url}::${title}`).digest('hex')
}
