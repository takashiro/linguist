import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';
import type { InterpolateNameFn } from '@formatjs/ts-transformer';

export interface Config {
	/**
	 * Supported locales of the application. Each locale has a separate file. (Default: en-US, zh-CN, ja-JP)
	 */
	locales: string[];

	/**
	 * The directory to look for source files. (Default: 'src')
	 */
	sourceDir: string;

	/**
	 * The directory to save messages extracted from source files. (Default: 'message')
	 */
	messageDir: string;

	/**
	 * Output directory to generated released version of messages. (Default: 'dist/message')
	 */
	outDir: string;

	/**
	 * If no explicit id is defined, generate an automatic id for the message.
	 */
	overrideIdFn: string | InterpolateNameFn;

	/**
	 * 'Format of message bundles (js or json).
	 */
	format: string;

	/**
	 * Whether to use AST format. (Default: `true`)
	 */
	ast: boolean;

	/**
	 * Global variable name of messages (For *.js format only) (Default: 'linguist')
	 */
	globalVariable: string;
}

const explorer = cosmiconfig('linguist');

function resolve({
	locales = ['en-US', 'zh-CN', 'ja-JP'],
	sourceDir = 'src',
	messageDir = 'message',
	outDir = 'dist/message',
	overrideIdFn = '[sha512:contenthash:base64:6]',
	format = 'json',
	ast = true,
	globalVariable = 'linguist',
}: Partial<Config> = {}): Config {
	return {
		locales,
		sourceDir,
		messageDir,
		outDir,
		overrideIdFn,
		format,
		ast,
		globalVariable,
	};
}

export async function parse(): Promise<Config> {
	const res = await explorer.search();
	return resolve(res?.config);
}

const explorerSync = cosmiconfigSync('linguist');

export function parseSync(): Config {
	const res = explorerSync.search();
	return resolve(res?.config);
}
