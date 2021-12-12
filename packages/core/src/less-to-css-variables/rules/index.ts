import type {
  ReplaceVariableRules,
  LibraryItem,
  SeriesType,
  ProcessFunction,
} from '../../../types';
import fg from 'fast-glob';
import path from 'path';
import fs from 'fs-extra';
import { resolveLibrary } from '../utils/resolve';
import { BACKUP_EXT } from '../constants';
import { createProcessColorFunc } from '../color-func';
import { compose } from '../utils';

export async function buildRules(
  libraryItem: LibraryItem,
  series: SeriesType,
  force: boolean,
) {
  let findSeriesRules = await findRules(series);

  const { includes = [] } = libraryItem;
  const entry = resolveLibrary(libraryItem);
  if (!entry) {
    return [];
  }

  const seriesRules: ReplaceVariableRules[] = [];
  includes.forEach((item) => {
    const realRule = findSeriesRules
      .map((fcr) => ({
        ...fcr,
        styleFilePath: `${item}/${fcr.styleFilePath}`,
      }))
      .filter((val) => {
        return fs.existsSync(path.join(entry, val.styleFilePath));
      });
    seriesRules.push(...realRule);
  });
  if (!includes.length) {
    return seriesRules;
  }

  // 搜索组件库内所有的less
  const getPattern = (isForce: boolean) =>
    includes.map((item) => `**/${item}/**/*${isForce ? BACKUP_EXT : ''}.less`);

  if (force) {
    const backupFiles = fg.sync(getPattern(true), {
      cwd: entry,
      absolute: true,
      ignore: ['**/vc-dialog/**'],
    });

    await Promise.all(
      backupFiles.map(async (backupFile) => {
        if (fs.existsSync(backupFile)) {
          fs.copyFileSync(backupFile, backupFile.replace(BACKUP_EXT, ''));
        }
      }),
    );
  }

  const files = fg.sync(getPattern(false), {
    cwd: entry,
    absolute: true,
    ignore: [`**/*${BACKUP_EXT}.less`, '**/vc-dialog/**'],
  });

  let rules: ReplaceVariableRules[] = [];

  Promise.all(files.map((file) => walkFile(file, entry, rules)));

  const styleFiles = seriesRules.map((item) => item.styleFilePath);

  rules = rules.filter((rule) => {
    return !styleFiles.includes(rule.styleFilePath);
  });
  return [...rules, ...seriesRules];
}

async function walkFile(
  file: string,
  entry: string,
  rules: ReplaceVariableRules[],
) {
  const content: string | null = fs.readFileSync(file, { encoding: 'utf-8' });
  const rule: ReplaceVariableRules = {
    styleFilePath: path.relative(entry, file),
  };
  let change = false;
  const processColorFunc = createProcessColorFunc();
  for (const processFunc of processColorFunc) {
    // postcss不支持 @functions 解析
    if (
      content.includes(processFunc.funcName + '(') &&
      !content.includes('@functions')
    ) {
      mergeRule(rule, processFunc);
      change = true;
    }
  }
  if (change) {
    rules.push(rule);
  }
}

// 查询自定义的rules
const findRules = async (series: SeriesType) => {
  const files =
    fg.sync([`${series}/index.{ts,js}`], {
      cwd: __dirname,
      absolute: true,
    }) || [];

  const rules = [] as ReplaceVariableRules[];

  for (let i = 0; i < files.length; i += 1) {
    if (/\.d\.ts$/.test(files[i])) {
      continue;
    }
    const importRet = await import(files[i].replace(/^\./, __dirname)).then(
      (r) => {
        return r.default?.default ?? r.default;
      },
    );
    rules.push(...(Array.isArray(importRet) ? importRet : [importRet]));
  }

  return rules;
};

export function mergeRule(
  rule: ReplaceVariableRules,
  processFunc: ProcessFunction,
) {
  const { decls, atRules, formatResult } = processFunc;
  rule.decls = [...(rule.decls || []), ...decls];
  rule.atRules = [...(rule.atRules || []), ...atRules];
  rule.formatResult = rule.formatResult
    ? compose(rule.formatResult, formatResult)
    : formatResult;
  return rule;
}
