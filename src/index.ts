import {
	Opts,
	transform as formatJsTransform,
} from '@formatjs/ts-transformer';
import { SourceFile, TransformerFactory } from 'typescript';

import { Config as FullConfig, parseSync } from './base/Config';

export type Config = Partial<FullConfig>;

export interface TransformOptions extends Opts {
	config?: string;
}

export function transform(options: TransformOptions = {}): TransformerFactory<SourceFile> {
	const config = parseSync();
	if (!options.overrideIdFn) {
		options.overrideIdFn = config.overrideIdFn;
	}
	if (options.ast === undefined) {
		options.ast = config.ast;
	}
	return formatJsTransform(options);
}
