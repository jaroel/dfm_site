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
    const groupName = func(item)
    if (group === undefined) {
      group = new Group<K, T>(groupName, item)
    }

    if (groupName !== group.key) {
      results.push(group)
      group = new Group<K, T>(groupName, item)
    }

    group.members.push(item)
  }

  if (group !== undefined) {
    results.push(group)
  }

  return results
}
