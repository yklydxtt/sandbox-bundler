#!/usr/bin/env node

const chalk = require('chalk');
const {program}= require('commander');
const version = require('../package.json').version;

program.version(version);

program.command('react [input]')
    .description('satrt a react demo')
    .action(bundle);

program.on('--help', function () {
    console.log('');
    console.log('  Run `' + chalk.bold('bundle help <command>') + '` for more information on specific commands');
    console.log('');
    });

program.parse(process.argv);

function bundle(main,command,input){
    const Bundler=require('../');
    const bundler=new Bundler(main,command,input);
    bundler.start();
}