import searchSourceFiles from '../../src/util/searchSourceFiles';

function glob(pattern: string, callback: (err?: Error) => void): void {
	callback(new Error('unknown'));
}

jest.mock('glob', () => glob);

it('rejects an error if the directory does not exist', async () => {
	await expect(() => searchSourceFiles('abcd')).rejects.toThrowError('unknown');
});
