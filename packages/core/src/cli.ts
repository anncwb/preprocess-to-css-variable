import { cac } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import { runLessToCssVariables } from './less-to-css-variables';

const cli = cac('pcv');

const pkg = fs.readJSONSync(path.join(__dirname, '../package.json'), {
  encoding: 'utf8',
});

require('v8-compile-cache');

cli
  .command('[name]')
  .option('-r, --revert', 'Restore default files', { default: false })
  .option('-f, --force', 'Force conversion, prohibit caching', {
    default: false,
  })
  .option('--verbose', 'Output changed files', { default: false })
  .action(async (name, { revert, force, verbose }) => {
    await runLessToCssVariables({
      revert,
      force,
      verbose,
      libraryList: [{ name, includes: [] }],
    });
  });

cli.version(pkg.version);
cli.usage(`Scaffolding to transform less into less variables.`);
cli.help();
cli.parse();

process.on('SIGINT', function () {
  process.exit();
});

export default cli;
