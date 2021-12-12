import { cac } from 'cac';
import fs from 'fs-extra';
import path from 'path';

const cli = cac('pcv');

const pkg = fs.readJSONSync(path.join(__dirname, '../package.json'), {
  encoding: 'utf8',
});

require('v8-compile-cache');

cli.command('run').action(() => {
  console.log(1);
});

cli.version(pkg.version);
cli.usage(``);
cli.help();
cli.parse();

process.on('SIGINT', function () {
  process.exit();
});

export default cli;
