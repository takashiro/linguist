import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import * as mkdirp from 'mkdirp';

import MessageDescriptor from './MessageDescriptor';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function convertToMap(messages: MessageDescriptor[]): Map<string, MessageDescriptor> {
	const map = new Map<string, MessageDescriptor>();
	for (const message of messages) {
		if (!message.id) {
			continue;
		}
		map.set(message.id, message);
	}
	return map;
}

export default class MessageBundle {
	protected filePath: string;

	constructor(filePath: string) {
		this.filePath = filePath;
	}

	getFilePath(): string {
		return this.filePath;
	}

	async read(): Promise<MessageDescriptor[]> {
		if (!fs.existsSync(this.filePath)) {
			await mkdirp(path.dirname(this.filePath));
			return [];
		}

		const content = await readFile(this.filePath, 'utf-8');
		const messages = JSON.parse(content);
		return messages;
	}

	async update(messages: MessageDescriptor[]): Promise<void> {
		const oldContent = await this.read();
		const map = convertToMap(oldContent);

		for (const message of messages) {
			if (!message.id) {
				continue;
			}

			const descriptor = map.get(message.id);
			if (!descriptor) {
				map.set(message.id, message);
			} else {
				Object.assign(descriptor, message);
			}
		}

		const newContent = Array.from(map.values());
		await writeFile(this.filePath, JSON.stringify(newContent, undefined, '\t'));
	}

	async release(outputPath: string): Promise<void> {
		const content = await this.read();
		const messages: Record<string, string> = {};
		for (const desc of content) {
			if (desc.id && desc.message) {
				messages[desc.id] = desc.message;
			}
		}
		await writeFile(outputPath, `window.linguist = { messages: ${JSON.stringify(messages)} };`);
	}
}
