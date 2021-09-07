import path from 'path';

import { Config } from '../base/Config';
import MessageBundle from '../base/MessageBundle';
import SourceSet from '../base/SourceSet';

export const command = 'update [sourcePattern]';
export const describe = 'Extract messages from source files and update message bundles. If sourcePattern is not defined, source directory will be used.';

interface UpdateArgs extends Config {
	sourcePattern?: string;
}

export async function handler(argv: UpdateArgs): Promise<void> {
	const sourceSet = new SourceSet();
	sourceSet.setOverrideIdFn(argv.overrideIdFn);

	if (argv.sourcePattern) {
		await sourceSet.addFiles(argv.sourcePattern);
	} else if (argv.sourceDir) {
		console.log('Searching source files...');
		sourceSet.on('added', (filePath) => {
			console.log(`Found ${filePath}`);
		});
		await sourceSet.addDirectory(argv.sourceDir);
	} else {
		console.error('Please define a source directory (sourceDir) in the configuration file.');
		process.exit(1);
	}

	sourceSet.on('extracted', (filePath) => {
		console.log(`Parsing ${filePath}`);
	});
	const messages = sourceSet.extractMessages();

	const { locales } = argv;
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		console.log(`Updating ${bundle.getFilePath()}`);
		await bundle.update(messages);
	}
}
