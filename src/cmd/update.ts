import * as path from 'path';

import MessageBundle from '../base/MessageBundle';
import searchSourceFiles from '../util/searchSourceFiles';
import extractMessages from '../util/extractMessages';

export const command = 'update';
export const describe = 'Extract messages from source files and update message bundles.';

interface Arguments {
	locales: string;
	sourceDir: string;
	messageDir: string;
}

export async function handler(argv: Arguments): Promise<void> {
	console.log('Searching source files...');
	const sourceFiles = await searchSourceFiles(argv.sourceDir);
	const messages = extractMessages(sourceFiles, (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		console.log(`Updating ${bundle.getFilePath()}`);
		await bundle.update(messages);
	}
}
