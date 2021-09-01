import * as path from 'path';

import { Config } from '../base/Config';
import MessageBundle from '../base/MessageBundle';
import SourceSet from '../base/SourceSet';

export const command = 'prune';
export const describe = 'Remove non-existing messages from bundles.';

export async function handler(argv: Config): Promise<void> {
	console.log('Searching source files...');

	const sourceSet = new SourceSet();
	sourceSet.setOverrideIdFn(argv.overrideIdFn);

	sourceSet.on('added', (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	await sourceSet.addDirectory(argv.sourceDir);

	sourceSet.on('extracted', (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	const messages = sourceSet.extractMessages();

	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		console.log(`Pruning ${bundle.getFilePath()}`);
		await bundle.prune(messages);
	}
}
