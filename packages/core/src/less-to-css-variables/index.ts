import type { Options, RunLessToCssVariablesOptions } from '../../types';
import { generateCoverages } from './generate';
import { buildRules } from './rules';
import { runReductions } from './reduction';
import { resolveLibraryList } from './utils/resolve';
import chalk from 'chalk';
import path from 'path';
import { generateVariables } from './generate/variables';
import { SeriesType, LibraryItem } from '../../types/index';

export async function runLessToCssVariables({
  cwd = process.cwd(),
  revert = false,
  force = false,
  verbose = false,
  libraryList = [],
  series = 'ant-design',
}: RunLessToCssVariablesOptions = {}) {
  const libEntry = resolveLibraryList(libraryList);

  await Promise.all(
    libEntry.map(async (libraryDir, index) => {
      const libraryItem = libraryList[index];
      createDefaultOptions(series, libraryItem);

      const rules = await buildRules(libraryItem, series, force);

      const opts: Options = {
        cwd,
        force,
        revert,
        verbose,
        libraryDir,
        libraryItem,
        joinFullPath: (...paths: string[]) => path.join(libraryDir, ...paths),
      };

      try {
        if (revert) {
          return runReductions(rules, opts).then(() => {
            console.info(
              ` Restore the ${chalk.cyan(
                libraryItem.name,
              )} style variable file successfully`,
            );
          });
        }

        // 执行修改、覆盖
        return generateCoverages(rules, opts).then(() => {
          console.info(
            `Successfully overwrite and modify the ${chalk.cyan(
              libraryItem.name,
            )} style variable file`,
          );
        });
      } catch (error: any) {
        console.error(`[preprocess-less-to-css-variable]: ${error.toString()}`);
      }
    }),
  );
  // 处理变量，写入缓存
  await generateVariables();
}

function createDefaultOptions(
  seriesType: SeriesType,
  libraryItem: LibraryItem,
) {
  if (seriesType === 'ant-design') {
    if (!libraryItem.includes || libraryItem.includes.length === 0) {
      libraryItem.includes = ['lib', 'es'];
    }
  }
}
