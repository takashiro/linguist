import {
	jest,
	afterAll,
	afterEach,
	expect,
	it,
} from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';

import MessageBundle from '../../src/base/MessageBundle';
import MessageDescriptor from '../../src/base/MessageDescriptor';

const {
	readFile,
	unlink,
	rmdir,
} = fs.promises;

const bundle = new MessageBundle(path.join(os.tmpdir(), 'zh-CN.json'));

const desc1: MessageDescriptor = {
	id: 'test1',
};
const desc2: MessageDescriptor = {
	id: 'test2',
	defaultMessage: 'test2',
};
const desc3: MessageDescriptor = {
	id: 'test3',
	defaultMessage: 'okay',
	message: 'okay',
};
const desc4 = {} as unknown as MessageDescriptor;
const desc5: MessageDescriptor = {
	id: 'test5',
	message: 'Room {id}',
};

const bundleContent2: MessageDescriptor[] = [
	{
		...desc1,
		message: '',
	},
	{
		...desc2,
		message: '',
	},
];

const bundleContent3: MessageDescriptor[] = [
	...bundleContent2,
	{
		id: 'test3',
		defaultMessage: 'okay',
		message: '',
	},
];

const save = jest.spyOn(bundle, 'save');
const read = jest.spyOn(bundle, 'read');
const release = jest.spyOn(bundle, 'release');

afterAll(async () => {
	await unlink(bundle.getFilePath());
});

afterEach(() => {
	save.mockClear();
	read.mockClear();
});

it('should save messages', async () => {
	await bundle.update([desc2, desc1]);
	expect(save).toHaveBeenCalledTimes(1);
	expect(save).toHaveBeenCalledWith(bundleContent2);
});

it('should read messages', async () => {
	const descriptors = await bundle.read();
	expect(descriptors).toStrictEqual(bundleContent2);
});

it('should merge duplicate messages and skip invalid messages', async () => {
	await bundle.update([
		desc3,
		desc2,
		desc4,
	]);
	expect(save).toHaveBeenCalledTimes(1);
	expect(save).toHaveBeenCalledWith(bundleContent3);
});

it('should clear existing message if default message is changed', async () => {
	save.mockResolvedValueOnce();
	await bundle.update([{
		id: 'test3',
		defaultMessage: 'new',
	}]);
	expect(save).toHaveBeenCalledWith([
		...bundleContent2,
		{
			id: 'test3',
			defaultMessage: 'new',
			message: '',
		},
	]);
});

it('should be released', async () => {
	read.mockResolvedValueOnce([desc3, desc4]);
	const message = await bundle.release();
	expect(message).toStrictEqual({
		test3: 'okay',
	});
});

it('should be released in JavaScript.', async () => {
	release.mockResolvedValueOnce({
		test4: 'ok',
	});
	const out = path.join(os.tmpdir(), 'tmp.js');
	await bundle.releaseJs(out, 'test');
	const outContent = await readFile(out, 'utf-8');
	await unlink(out);
	const window = {
		test: {},
	};
	// eslint-disable-next-line no-eval
	eval(outContent);
	expect(window.test).toStrictEqual({
		test4: 'ok',
	});
});

it('should be released in JSON format', async () => {
	release.mockResolvedValueOnce({
		test5: 'wow',
	});
	const out = path.join(os.tmpdir(), 'linguist/release/tmp.json');
	await bundle.releaseJson(out);
	const output = JSON.parse(await readFile(out, 'utf-8'));
	await unlink(out);
	await rmdir(path.join(os.tmpdir(), 'linguist', 'release'));
	await rmdir(path.join(os.tmpdir(), 'linguist'));
	expect(output).toStrictEqual({
		test5: 'wow',
	});
});

it('should remove invalid messages', async () => {
	read.mockResolvedValueOnce([desc1, desc4]);
	save.mockResolvedValueOnce();
	await bundle.update([]);
	expect(save).toHaveBeenCalledTimes(1);
	expect(save).toHaveBeenCalledWith([desc1]);
});

it('should prune unused messages', async () => {
	read.mockResolvedValueOnce([desc1, desc2]);
	save.mockResolvedValueOnce();
	await bundle.prune([desc2, desc3]);
	expect(save).toHaveBeenCalledTimes(1);
	expect(save).toHaveBeenCalledWith([desc2]);
});

it('should release in AST format', async () => {
	bundle.setAst(true);
	read.mockResolvedValueOnce([desc5]);
	const res = await bundle.release();
	expect(res).toStrictEqual({
		test5: [
			{ type: 0, value: 'Room ' },
			{ type: 1, value: 'id' },
		],
	});
});
