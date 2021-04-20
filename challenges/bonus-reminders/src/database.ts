declare const REMINDERS: KVNamespace;

type KEY = string;

interface Reminder {
	id: number;
	text: string;
}

export function toKey(phone: string, country: string): KEY {
	return `${country}::${phone.substring(1)}` as KEY;
}

export function display(items: Reminder[]): string {
	let len = items.length, output='';

	if (len > 0) {
		output += `You have ${len} reminder`;
		if (len !== 1) output += 's';
		output += ':\n';

		items.forEach(tmp => {
			output += `· (${tmp.id}) ${tmp.text}\n`;
		});
	} else {
		output += 'You have no reminders.\n';
	}

	output += '\nReply with "NEW <text>" to add a reminder.';
	if (len > 0) output += '\nReply with "DONE <id>" to remove a reminder.';

	return output;
}

export function load(key: KEY): Promise<Reminder[]> {
	return REMINDERS.get<Reminder[]>(key, 'json').then(x => x || []);
}

// List expires after 7 days (seconds)
const expirationTtl = 60 * 60 * 24 * 7;
export function save(key: KEY, arr: Reminder[]): Promise<void> {
	return REMINDERS.put(key, JSON.stringify(arr), { expirationTtl });
}
