import searchSourceFiles from '../src/util/searchSourceFiles';

it('should returns all source files', async () => {
	const files = await searchSourceFiles('test/sample');
	expect(files).toStrictEqual([
		'test/sample/Box.tsx',
		'test/sample/messages.ts',
	]);
});
