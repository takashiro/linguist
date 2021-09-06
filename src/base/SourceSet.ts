import { EventEmitter } from 'events';
import path from 'path';
import ts from 'typescript';
import { Glob } from 'glob';
import {
	transform,
	MessageDescriptor,
	InterpolateNameFn,
	Opts,
} from '@formatjs/ts-transformer';

const compilerOptions: ts.CompilerOptions = {
	jsx: ts.JsxEmit.React,
	module: ts.ModuleKind.ESNext,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	target: ts.ScriptTarget.Latest,
	noEmitOnError: false,
	allowJs: true,
};

interface SourceSet {
	on(event: 'added', listener: (fileName: string) => void): this;
	on(event: 'extracted', listener: (fileName: string) => void): this;

	once(event: 'added', listener: (fileName: string) => void): this;
	once(event: 'extracted', listener: (fileName: string) => void): this;

	off(event: 'added', listener: (fileName: string) => void): this;
	off(event: 'extracted', listener: (fileName: string) => void): this;

	emit(event: 'added', fileName: string): boolean;
	emit(event: 'extracted', fileName: string): boolean;
}

class SourceSet extends EventEmitter {
	protected files: string[] = [];

	protected overrideIdFn?: string | InterpolateNameFn;

	getSize(): number {
		return this.files.length;
	}

	getFiles(): string[] {
		return this.files;
	}

	addFile(filePath: string): void {
		this.files.push(filePath);
		this.emit('added', filePath);
	}

	getOverrideIdFn(): string | InterpolateNameFn | undefined {
		return this.overrideIdFn;
	}

	setOverrideIdFn(overrideIdFn?: string | InterpolateNameFn): void {
		this.overrideIdFn = overrideIdFn;
	}

	async addDirectory(sourceDir: string, extensions = ['ts', 'tsx']): Promise<void> {
		await this.addFiles(`${sourceDir}/**/*.@(${extensions.join('|')})`);
	}

	addFiles(pattern: string): Promise<void> {
		const glob = new Glob(pattern);
		glob.on('match', (filePath) => this.addFile(filePath));
		return new Promise((resolve, reject) => {
			glob.once('error', reject);
			glob.once('end', resolve);
		});
	}

	extractMessages(): MessageDescriptor[] {
		const messages: MessageDescriptor[] = [];
		const program = ts.createProgram(this.files, compilerOptions);
		const opts: Opts = {
			onMsgExtracted(filePath: string, msgs: MessageDescriptor[]): void {
				messages.push(...msgs);
			},
		};
		if (this.overrideIdFn !== undefined) {
			opts.overrideIdFn = this.overrideIdFn;
		}
		program.emit(undefined, (output, data, writeByteOrderMark, onError, input) => {
			if (input) {
				for (const sourceFile of input) {
					this.emit('extracted', path.relative(process.cwd(), sourceFile.fileName));
				}
			}
		}, undefined, undefined, {
			before: [
				transform(opts),
			],
		});
		return messages;
	}
}

export default SourceSet;
