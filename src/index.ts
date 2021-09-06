import path from 'path';
import {
	Opts,
	transform as formatJsTransform,
} from '@formatjs/ts-transformer';
import { SourceFile, TransformerFactory } from 'typescript';

import { Config, parse } from './base/Config';

export { Config } from './base/Config';

export interface TransformOptions extends Opts {
	config?: string;
}

export function transform(options: TransformOptions = {}): TransformerFactory<SourceFile> {
	const configPath = path.resolve(process.cwd(), options.config || '.linguistrc.js');
	const config: Partial<Config> = parse(configPath);
	if (!options.overrideIdFn) {
		options.overrideIdFn = config.overrideIdFn;
	}
	return formatJsTransform(options);
}
