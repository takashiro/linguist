import * as path from 'path';

import { Config } from '../base/Config';
import MessageBundle from '../base/MessageBundle';
import searchSourceFiles from '../util/searchSourceFiles';
import extractMessages from '../util/extractMessages';

export const command = 'update';
export const describe = 'Extract messages from source files and update message bundles.';

export async function handler(argv: Config): Promise<void> {
	console.log('Searching source files...');
	const sourceFiles = await searchSourceFiles(argv.sourceDir);
	const messages = extractMessages(sourceFiles, argv.overrideIdFn, (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		console.log(`Updating ${bundle.getFilePath()}`);
		await bundle.update(messages);
	}
}
