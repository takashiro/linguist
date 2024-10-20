import {
	jest,
	it,
	expect,
} from '@jest/globals';
import path from 'path';

import SourceSet from '../../src/base/SourceSet.js';

it('should extract messages', () => {
	const set = new SourceSet();
	set.setOverrideIdFn('[sha512:contenthash:base64:8]');
	expect(set.getOverrideIdFn()).toBe('[sha512:contenthash:base64:8]');

	const added = jest.fn();
	set.on('added', added);
	set.addFile('test/sample/Box.tsx');

	expect(added).toHaveBeenCalledTimes(1);
	expect(added).toHaveBeenCalledWith('test/sample/Box.tsx');

	const extracted = jest.fn();
	set.on('extracted', extracted);
	const descriptors = set.extractMessages();

	expect(descriptors).toHaveLength(2);
	expect(descriptors[0]).toStrictEqual({
		id: 'create-room',
		defaultMessage: 'Create Room',
	});
	expect(descriptors[1]).toStrictEqual({
		id: 'Z6D74Z4r',
		defaultMessage: 'Enter Room',
	});

	expect(extracted).toHaveBeenCalledTimes(1);
	expect(extracted).toHaveBeenCalledWith(path.join('test', 'sample', 'Box.tsx'));
});

it('should add TypeScript source files', async () => {
	const set = new SourceSet();
	await set.addDirectory('test/sample');
	expect(set.getSize()).toBe(2);
	const files = set.getFiles();
	expect(files).toHaveLength(2);
	expect(files).toContain(path.join('test', 'sample', 'Box.tsx'));
	expect(files).toContain(path.join('test', 'sample', 'messages.ts'));
});

it('should search JavaScript source files', async () => {
	const set = new SourceSet();
	await set.addFiles('test/sample/*.ts');
	await set.addFiles('test/sample/*.jsx');
	expect(set.getSize()).toBe(2);
	const messages = set.extractMessages();
	expect(messages).toHaveLength(4);
});
