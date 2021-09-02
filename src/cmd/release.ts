import * as path from 'path';

import { Config } from '../base/Config';
import MessageBundle from '../base/MessageBundle';

export const command = 'release';
export const describe = 'Create JavaScript files of message bundles.';

export async function handler(argv: Config): Promise<void> {
	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		const releasePath = path.join(argv.outDir, `${localeId}.js`);
		console.log(`Generating ${releasePath} from ${bundle.getFilePath()}`);
		await bundle.release(releasePath);
	}
}
