import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

import MessageBundle from '../../src/base/MessageBundle';
import MessageDescriptor from '../../src/base/MessageDescriptor';

const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

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
	message: 'okay',
};
const desc4 = {} as unknown as MessageDescriptor;

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
	desc3,
];

afterAll(async () => {
	await unlink(bundle.getFilePath());
});

it('should save messages', async () => {
	const save = jest.spyOn(bundle, 'save');
	await bundle.update([desc1, desc2]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith(bundleContent2);
	save.mockRestore();
});

it('should read messages', async () => {
	const descriptors = await bundle.read();
	expect(descriptors).toStrictEqual(bundleContent2);
});

it('should merge duplicate messages and skip invalid messages', async () => {
	const save = jest.spyOn(bundle, 'save').mockResolvedValue();
	await bundle.update([
		desc2,
		desc3,
		desc4,
	]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith(bundleContent3);
	save.mockRestore();
});

it('should be released', async () => {
	const read = jest.spyOn(bundle, 'read').mockResolvedValue([desc3, desc4]);
	const message = await bundle.release();
	expect(message).toStrictEqual({
		test3: 'okay',
	});
	read.mockRestore();
});

it('should be released in JavaScript.', async () => {
	const release = jest.spyOn(bundle, 'release').mockResolvedValue({
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
	release.mockRestore();
});

it('should be released in JSON format', async () => {
	const release = jest.spyOn(bundle, 'release').mockResolvedValue({
		test5: 'wow',
	});
	const out = path.join(os.tmpdir(), 'tmp.json');
	await bundle.releaseJson(out);
	const output = JSON.parse(await readFile(out, 'utf-8'));
	await unlink(out);
	expect(output).toStrictEqual({
		test5: 'wow',
	});
	release.mockRestore();
});

it('should remove invalid messages', async () => {
	const read = jest.spyOn(bundle, 'read').mockResolvedValue([desc1, desc4]);
	const save = jest.spyOn(bundle, 'save').mockResolvedValue();
	await bundle.update([]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith([desc1]);
	read.mockRestore();
	save.mockRestore();
});

it('should prune unused messages', async () => {
	const read = jest.spyOn(bundle, 'read').mockResolvedValue([desc1, desc2]);
	const save = jest.spyOn(bundle, 'save').mockResolvedValue();
	await bundle.prune([desc2, desc3]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith([desc2]);
	read.mockRestore();
	save.mockRestore();
});
