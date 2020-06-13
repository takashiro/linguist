import * as glob from 'glob';

function searchSourceFiles(sourceDir: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		glob(`${sourceDir}/**/*.@(ts|tsx)`, (err, matches) => {
			if (err) {
				reject(err);
			} else {
				resolve(matches);
			}
		});
	});
}

export default searchSourceFiles;
