import * as path from 'path';
import MessageBundle from '../base/MessageBundle';

export const command = 'release';
export const describe = 'Create JavaScript files of message bundles.';

interface Arguments {
	locales: string;
	messageDir: string;
	distDir: string;
}

export async function handler(argv: Arguments): Promise<void> {
	const locales = argv.locales.split(',');
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(argv.messageDir, `${localeId}.json`));
		const releasePath = path.join(argv.distDir, `${localeId}.js`);
		console.log(`Generating ${releasePath} from ${bundle.getFilePath()}`);
		await bundle.release(releasePath);
	}
}
