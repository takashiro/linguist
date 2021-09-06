import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import MessageDescriptor from './MessageDescriptor';

const {
	readFile,
	writeFile,
} = fs.promises;

function convertToMap(descriptors: MessageDescriptor[]): Map<string, MessageDescriptor> {
	const map = new Map<string, MessageDescriptor>();
	for (const desc of descriptors) {
		if (!desc.id) {
			continue;
		}
		map.set(desc.id, desc);
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

	async update(descriptors: MessageDescriptor[]): Promise<void> {
		const oldContent = await this.read();
		const map = convertToMap(oldContent);

		for (const desc of descriptors) {
			if (!desc.id) {
				continue;
			}

			const descriptor = map.get(desc.id);
			if (!descriptor) {
				map.set(desc.id, {
					id: desc.id,
					defaultMessage: desc.defaultMessage,
					description: desc.description,
					message: '',
				});
			} else if (descriptor.defaultMessage !== desc.defaultMessage) {
				Object.assign(descriptor, desc);
				descriptor.message = '';
			}
		}

		const newContent = Array.from(map.values());
		await this.save(newContent);
	}

	async prune(messages: MessageDescriptor[]): Promise<void> {
		const oldContent = await this.read();
		const map = convertToMap(messages);
		const newContent = oldContent.filter((desc) => desc.id && map.has(desc.id));
		await this.save(newContent);
	}

	save(messages: MessageDescriptor[]): Promise<void> {
		return new Promise((resolve, reject) => {
			const output = fs.createWriteStream(this.filePath);
			output.once('error', reject);
			output.once('close', resolve);

			output.write(JSON.stringify(messages, undefined, '\t'));
			output.write('\n');
			output.close();
		});
	}

	async release(): Promise<Record<string, string>> {
		const content = await this.read();
		const messages: Record<string, string> = {};
		for (const desc of content) {
			if (desc.id && desc.message) {
				messages[desc.id] = desc.message;
			}
		}
		return messages;
	}

	async releaseJs(outputPath: string, variableName: string): Promise<void> {
		const messages = await this.release();
		await writeFile(outputPath, `window.${variableName} = ${JSON.stringify(messages)};`);
	}

	async releaseJson(outputPath: string): Promise<void> {
		const messages = await this.release();
		await writeFile(outputPath, JSON.stringify(messages));
	}
}
