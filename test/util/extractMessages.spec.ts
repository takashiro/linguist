import * as path from 'path';

import extractMessages from '../../src/util/extractMessages';

it('should extract messages', () => {
	const descriptors = extractMessages([
		'test/sample/Box.tsx',
	]);
	expect(descriptors).toHaveLength(2);
	expect(descriptors[0]).toStrictEqual({
		id: 'create-room',
		defaultMessage: 'Create Room',
	});
	expect(descriptors[1]).toStrictEqual({
		id: 'enter-room',
		defaultMessage: 'Enter Room',
	});
});

it('should notify progress state', () => {
	const callback = jest.fn();
	extractMessages([
		'test/sample/Box.tsx',
		'test/sample/messages.ts',
	], callback);
	expect(callback).toBeCalledTimes(2);
	expect(callback).nthCalledWith(1, path.join('test', 'sample', 'Box.tsx'));
	expect(callback).nthCalledWith(2, path.normalize('test/sample/messages.ts'));
});
