import extractMessages from '../src/util/extractMessages';

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
