import path from 'path';

import { parse } from '../base/Config.js';
import MessageBundle from '../base/MessageBundle.js';
import ReleaseFormat from '../base/ReleaseFormat.js';

export const command = 'release';
export const describe = 'Create JavaScript files of message bundles.';

export async function handler(): Promise<void> {
	const config = await parse();
	const { locales } = config;
	for (const localeId of locales) {
		const bundle = new MessageBundle(path.join(config.messageDir, `${localeId}.json`));
		bundle.setAst(config.ast);
		const releasePath = path.join(config.outDir, `${localeId}.${config.format}`);
		console.log(`Generating ${releasePath} from ${bundle.getFilePath()}`);
		if (config.format === ReleaseFormat.JS) {
			await bundle.releaseJs(releasePath, config.globalVariable);
		} else if (config.format === ReleaseFormat.JSON) {
			await bundle.releaseJson(releasePath);
		}
	}
}
