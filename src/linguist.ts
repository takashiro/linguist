#!/usr/bin/env node
import yargs from 'yargs';
import assert from 'assert';

const { argv } = yargs
	.option('locales', {
		describe: 'Define supported locales',
		type: 'array',
		default: 'en-US',
	})
	.option('sourceDir', {
		describe: 'The directory to search source files.',
		default: 'src',
	})
	.option('messageDir', {
		describe: 'The directory to save message bundles.',
		default: 'message',
	})
	.option('overrideIdFn', {
		describe: 'Assign an automatic message id if no explicit id is defined.',
	})
	.config()
	.default('config', '.linguistrc.js')
	.version()
	.commandDir('cmd')
	.recommendCommands()
	.demandCommand()
	.help();

assert(argv);
