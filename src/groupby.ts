export class Group<K, T> {
  'key': K
  'head': T
  members: T[] = []

  constructor(key: K, head: T) {
    this.key = key
    this.head = head
  }
}

export function groupBy<K, T>(
  list: T[],
  func: (x: T) => K,
): Array<Group<K, T>> {
  const results: Array<Group<K, T>> = []
  let group: Group<K, T> | undefined
  for (const item of list) {
    const key = func(item)
    if (group === undefined) {
      group = new Group(key, item)
    }

    if (key !== group.key) {
      results.push(group)
      group = new Group(key, item)
    }

    group.members.push(item)
  }

  if (group !== undefined) {
    results.push(group)
  }

  return results
}
