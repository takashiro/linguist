#!/usr/bin/env node
import yargs from 'yargs';
import assert from 'assert';

const { argv } = yargs
	.option('locales', {
		describe: 'Define supported locales',
		default: 'en-US,zh-CN',
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
