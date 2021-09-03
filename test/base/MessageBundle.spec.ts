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
	defaultMessage: 'okay',
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
	await bundle.update([desc1, desc2]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith(bundleContent2);
});

it('should read messages', async () => {
	const descriptors = await bundle.read();
	expect(descriptors).toStrictEqual(bundleContent2);
});

it('should merge duplicate messages and skip invalid messages', async () => {
	await bundle.update([
		desc2,
		desc3,
		desc4,
	]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith(bundleContent3);
});

it('should clear existing message if default message is changed', async () => {
	save.mockResolvedValueOnce();
	await bundle.update([{
		id: 'test3',
		defaultMessage: 'new',
	}]);
	expect(save).toBeCalledWith([
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
	const out = path.join(os.tmpdir(), 'tmp.json');
	await bundle.releaseJson(out);
	const output = JSON.parse(await readFile(out, 'utf-8'));
	await unlink(out);
	expect(output).toStrictEqual({
		test5: 'wow',
	});
});

it('should remove invalid messages', async () => {
	read.mockResolvedValueOnce([desc1, desc4]);
	save.mockResolvedValueOnce();
	await bundle.update([]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith([desc1]);
});

it('should prune unused messages', async () => {
	read.mockResolvedValueOnce([desc1, desc2]);
	save.mockResolvedValueOnce();
	await bundle.prune([desc2, desc3]);
	expect(save).toBeCalledTimes(1);
	expect(save).toBeCalledWith([desc2]);
});
