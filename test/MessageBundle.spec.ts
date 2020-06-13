import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

import MessageBundle from '../src/base/MessageBundle';

const writeFile = util.promisify(fs.writeFile);

const bundle = new MessageBundle(path.join(os.tmpdir(), 'zh-CN.json'));

const desc1 = {
	id: 'test1',
};
const desc2 = {
	id: 'test2',
	defaultMessage: 'test2',
};
const desc3 = {
	id: 'test3',
};
const desc4 = {};

afterAll(() => {
	fs.unlinkSync(bundle.getFilePath());
});

it('should save messages', async () => {
	await bundle.update([
		desc1,
		desc2,
	]);
});

it('should read messages', async () => {
	const descriptors = await bundle.read();
	expect(descriptors).toHaveLength(2);
	expect(descriptors[0]).toStrictEqual(desc1);
	expect(descriptors[1]).toStrictEqual(desc2);
});

it('should merge duplicate messages and skip invalid messages', async () => {
	await bundle.update([
		desc2,
		desc3,
		desc4,
	]);
	const descriptors = await bundle.read();
	expect(descriptors).toHaveLength(3);
	expect(descriptors[0]).toStrictEqual(desc1);
	expect(descriptors[1]).toStrictEqual(desc2);
	expect(descriptors[2]).toStrictEqual(desc3);
});

it('should remove invalid messages', async () => {
	await writeFile(bundle.getFilePath(), JSON.stringify([desc1, desc4]));
	await bundle.update([]);
	const descriptors = await bundle.read();
	expect(descriptors).toStrictEqual([desc1]);
});
