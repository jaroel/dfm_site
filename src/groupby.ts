export type Group<K, T> = {
	key: K;
	head: T;
	members: T[];
};

export function groupBy<K, T>(
	list: T[],
	func: (x: T) => K,
): Array<Group<K, T>> {
	const results: Array<Group<K, T>> = [];
	let group: Group<K, T> | undefined;

	for (const item of list) {
		const key = func(item);

		if (!group || key !== group.key) {
			group = {
				key,
				head: item,
				members: [],
			};
			results.push(group);
		}

		group.members.push(item);
	}

	return results;
}
