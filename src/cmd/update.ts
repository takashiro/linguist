import * as path from 'path';

import { Config } from '../base/Config';
import MessageBundle from '../base/MessageBundle';
import SourceSet from '../base/SourceSet';

export const command = 'update';
export const describe = 'Extract messages from source files and update message bundles.';

export async function handler(argv: Config): Promise<void> {
	const sourceSet = new SourceSet();
	sourceSet.setOverrideIdFn(argv.overrideIdFn);

	console.log('Searching source files...');
	sourceSet.on('added', (filePath) => {
		console.log(`Found ${filePath}`);
	});
	await sourceSet.addDirectory(argv.sourceDir);

	sourceSet.on('extracted', (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	const messages = sourceSet.extractMessages();

	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		console.log(`Updating ${bundle.getFilePath()}`);
		await bundle.update(messages);
	}
}
