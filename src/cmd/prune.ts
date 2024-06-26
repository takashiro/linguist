import path from 'path';

import { parse } from '../base/Config.js';
import MessageBundle from '../base/MessageBundle.js';
import SourceSet from '../base/SourceSet.js';

export const command = 'prune';
export const describe = 'Remove non-existing messages from bundles.';

export async function handler(): Promise<void> {
	console.log('Searching source files...');

	const config = await parse();

	const sourceSet = new SourceSet();
	sourceSet.setOverrideIdFn(config.overrideIdFn);

	sourceSet.on('added', (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	await sourceSet.addDirectory(config.sourceDir);

	sourceSet.on('extracted', (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	const messages = sourceSet.extractMessages();

	const { locales } = config;
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(config.messageDir, `${localeId}.json`));
		console.log(`Pruning ${bundle.getFilePath()}`);
		await bundle.prune(messages);
	}
}
