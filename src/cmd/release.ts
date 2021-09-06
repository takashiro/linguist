import path from 'path';
import { Argv } from 'yargs';

import { Config } from '../base/Config';
import MessageBundle from '../base/MessageBundle';
import ReleaseFormat from '../base/ReleaseFormat';

export const command = 'release';
export const describe = 'Create JavaScript files of message bundles.';

interface ReleaseArgs extends Config {
	/**
	 * The directory to release i18n files. Default: 'dist/message'.
	 */
	outDir: string;

	/**
	 * File format of released messages
	 */
	format: ReleaseFormat;

	/**
	 * If released in *.js format, define a global variable to store i18n messages.
	 */
	globalVariable: string;
}

export function builder(argv: Argv): Argv {
	return argv
		.option('outDir', {
			description: 'Output directory to generated released version of messages.',
			type: 'string',
			default: 'dist/message',
		})
		.option('format', {
			description: 'Format of message bundles. (js or json)',
			type: 'string',
			default: 'json',
		})
		.option('globalVariable', {
			description: 'Global variable name of messages (For *.js format only)',
			type: 'string',
			default: 'linguist',
		});
}

export async function handler(argv: ReleaseArgs): Promise<void> {
	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		const releasePath = path.join(argv.outDir, `${localeId}.${argv.format}`);
		console.log(`Generating ${releasePath} from ${bundle.getFilePath()}`);
		if (argv.format === ReleaseFormat.JS) {
			await bundle.releaseJs(releasePath, argv.globalVariable);
		} else if (argv.format === ReleaseFormat.JSON) {
			await bundle.releaseJson(releasePath);
		}
	}
}
