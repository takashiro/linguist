import * as ts from 'typescript';
import { transform, MessageDescriptor } from '@formatjs/ts-transformer';

const compilerOptions = {
	jsx: ts.JsxEmit.React,
	module: ts.ModuleKind.CommonJS,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	target: ts.ScriptTarget.ES2015,
	outDir: 'tmp',
};

function emptyFn(): void {}

function extractMessages(sourceFiles: string[]): MessageDescriptor[] {
	const messages: MessageDescriptor[] = [];
	const program = ts.createProgram(sourceFiles, compilerOptions);
	program.emit(undefined, emptyFn, undefined, undefined, {
		before: [
			transform({
				onMsgExtracted(filePath: string, msgs: MessageDescriptor[]): void {
					messages.push(...msgs);
				},
			}),
		],
	});
	return messages;
}

export default extractMessages;
