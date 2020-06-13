import * as path from 'path';
import * as ts from 'typescript';
import { transform, MessageDescriptor } from '@formatjs/ts-transformer';

const compilerOptions = {
	jsx: ts.JsxEmit.React,
	module: ts.ModuleKind.ESNext,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	target: ts.ScriptTarget.Latest,
	experimentalDecorators: true,
	noEmitOnError: false,
	noUnusedLocals: true,
	noUnusedParameters: true,
	stripInternal: true,
};

type ProgressCallback = (filePath: string) => void;

function extractMessages(sourceFiles: string[], progressCallback?: ProgressCallback): MessageDescriptor[] {
	const messages: MessageDescriptor[] = [];
	const program = ts.createProgram(sourceFiles, compilerOptions);
	program.emit(undefined, (output, data, writeByteOrderMark, onError, input) => {
		if (input && progressCallback) {
			for (const sourceFile of input) {
				progressCallback(path.relative(process.cwd(), sourceFile.fileName));
			}
		}
	}, undefined, undefined, {
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
