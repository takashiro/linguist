#!/usr/bin/env node
import yargs from 'yargs';
import assert from 'assert';

const { argv } = yargs
	.version()
	.commandDir('cmd')
	.recommendCommands()
	.demandCommand()
	.help();

assert(argv);
