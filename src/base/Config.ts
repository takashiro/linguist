import { InterpolateNameFn } from '@formatjs/ts-transformer';

export interface Config {
	locales: string;
	sourceDir: string;
	messageDir: string;
	distDir: string;
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
