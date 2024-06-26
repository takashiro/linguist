#!/usr/bin/env node
import yargs from 'yargs';
import assert from 'assert';

const { argv } = yargs(process.argv.splice(2))
	.version()
	.command(await import('./cmd/prune.js'))
	.command(await import('./cmd/release.js'))
	.command(await import('./cmd/update.js'))
	.recommendCommands()
	.demandCommand()
	.help();

assert(argv);
