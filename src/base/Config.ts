import { InterpolateNameFn } from '@formatjs/ts-transformer';

export interface Config {
	/**
	 * Supported locales of the application. Each locale has a separate file. Default: en-US, zh-CN.
	 */
	locales: string;

	/**
	 * The directory to look for source files. Default: 'src'.
	 */
	sourceDir: string;

	/**
	 * The directory to save messages extracted from source files. Default: 'message'.
	 */
	messageDir: string;

	/**
	 * The directory to release i18n files. Default: 'dist/message'.
	 */
	distDir: string;

	/**
	 * If no explicit id is defined, generate an automatic id for the message.
	 */
	overrideIdFn: string | InterpolateNameFn;
}

export function parse(location: string): Partial<Config> {
	try {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		return require(location);
	} catch (e) {
		return {};
	}
}