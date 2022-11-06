import { InterpolateNameFn } from '@formatjs/ts-transformer';

export interface Config {
	/**
	 * Supported locales of the application. Each locale has a separate file. Default: en-US, zh-CN.
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
	 * Whether to use AST format.
	 */
	ast: boolean;

	/**
	 * Global variable name of messages (For *.js format only) (Default: 'linguist')
	 */
	globalVariable: string;
}

export function parse(location: string): Partial<Config> {
	try {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		return require(location);
	} catch (e) {
		return {};
	}
}
