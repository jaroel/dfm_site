/**
 * `Map.groupBy` with a fallback for browsers that predate ES2024. Keys keep
 * the order they are first seen in `items`.
 */
export function groupBy<K, T>(items: Iterable<T>, key: (item: T) => K) {
  if (typeof Map.groupBy === "function") {
    return Map.groupBy(items, key);
  }

  const groups = new Map<K, T[]>();
  for (const item of items) {
    const groupKey = key(item);
    const group = groups.get(groupKey);
    if (group) {
      group.push(item);
    } else {
      groups.set(groupKey, [item]);
    }
  }
  return groups;
}
