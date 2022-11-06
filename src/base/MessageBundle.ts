import fs from 'fs';
import path from 'path';
import { MessageFormatElement, parse } from '@formatjs/icu-messageformat-parser';

import MessageDescriptor from './MessageDescriptor';

type RawMessageBundle = Record<string, string>;

type AstMessageBundle = Record<string, MessageFormatElement[]>;

const {
	readFile,
	writeFile,
	mkdir,
} = fs.promises;

async function prepareDir(filePath: string): Promise<void> {
	const fileDir = path.dirname(filePath);
	if (!fs.existsSync(fileDir)) {
		await mkdir(fileDir, { recursive: true });
	}
}

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

	protected ast = false;

	constructor(filePath: string) {
		this.filePath = filePath;
	}

	getFilePath(): string {
		return this.filePath;
	}

	isAst(): boolean {
		return this.ast;
	}

	setAst(ast: boolean): void {
		this.ast = ast;
	}

	async read(): Promise<MessageDescriptor[]> {
		if (!fs.existsSync(this.filePath)) {
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
		newContent.sort((a, b) => a.id.localeCompare(b.id));
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

	async release(): Promise<AstMessageBundle | RawMessageBundle> {
		return this.isAst() ? this.releaseAst() : this.releaseRaw();
	}

	async releaseAst(): Promise<AstMessageBundle> {
		const content = await this.read();
		const messages: AstMessageBundle = {};
		for (const desc of content) {
			if (desc.id && desc.message) {
				messages[desc.id] = parse(desc.message);
			}
		}
		return messages;
	}

	async releaseRaw(): Promise<RawMessageBundle> {
		const content = await this.read();
		const messages: RawMessageBundle = {};
		for (const desc of content) {
			if (desc.id && desc.message) {
				messages[desc.id] = desc.message;
			}
		}
		return messages;
	}

	async releaseJs(outputPath: string, variableName: string): Promise<void> {
		const messages = await this.release();
		await prepareDir(outputPath);

		return new Promise((resolve, reject) => {
			const output = fs.createWriteStream(outputPath);
			output.once('error', reject);
			output.once('close', resolve);

			output.write('window.');
			output.write(variableName);
			output.write('=');
			output.write(JSON.stringify(messages));
			output.write(';');
			output.close();
		});
	}

	async releaseJson(outputPath: string): Promise<void> {
		const messages = await this.release();
		await prepareDir(outputPath);
		await writeFile(outputPath, JSON.stringify(messages));
	}
}
