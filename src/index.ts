import {
	Opts,
	transform as formatJsTransform,
} from '@formatjs/ts-transformer';
import { SourceFile, TransformerFactory } from 'typescript';

import { Config, parse } from './base/Config';

export interface TransformOptions extends Opts {
	config?: string;
}

export function transform(options: TransformOptions): TransformerFactory<SourceFile> {
	const config: Partial<Config> = options.config ? parse(options.config) : {};
	if (!options.overrideIdFn) {
		options.overrideIdFn = config.overrideIdFn;
	}
	return formatJsTransform(options);
}
