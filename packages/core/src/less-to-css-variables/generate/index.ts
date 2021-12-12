import type { Options, ReplaceVariableRules } from '../../../types';
import { getBackupFilePath } from '../utils';
import { transformLessToCssVariable } from '../postcss/transform';
import { copyFile, existsSync, writeFile } from 'fs-extra';

interface GenerateCoverageOptions {
  ruleOption: ReplaceVariableRules;
  options: Options;
}

// 生成覆盖
const generateCoverage = async ({
  ruleOption,
  options,
}: GenerateCoverageOptions) => {
  const { styleFilePath, ...lastOptions } = ruleOption;
  const { joinFullPath, force, debug } = options;

  // 获取真实的备份 less 文件路径
  const realBackupStyleFilePath = getBackupFilePath(styleFilePath);

  // 拼接完整备份 less 文件路径
  const backupFilePath = joinFullPath(realBackupStyleFilePath);

  // 如果备份文件存在，并且不是强制覆盖的话，就跳过
  if (existsSync(backupFilePath) && !force) {
    return;
  }

  // 拼接完整的less 文件路径
  const realStyleFilePath = joinFullPath(styleFilePath);

  // 如果有备份，那就读取备份的文件内容
  const readFilePath = existsSync(backupFilePath)
    ? backupFilePath
    : realStyleFilePath;

  const transformResult = await transformLessToCssVariable(
    readFilePath,
    lastOptions,
  );

  if (!transformResult) {
    throw new Error('');
  }

  const realStyleFilePathByNorm = joinFullPath(styleFilePath);
  const backupFilePathByNorm = joinFullPath(realBackupStyleFilePath);

  // 调试模式，不执行文件替换
  if (debug) {
    return Promise.resolve();
  }

  if (!(force && existsSync(backupFilePathByNorm))) {
    // 先备份
    await copyFile(realStyleFilePathByNorm, backupFilePathByNorm);
  }

  return writeFile(
    realStyleFilePathByNorm,
    transformResult.css || transformResult.content || '',
  );
};

export const generateCoverages = (
  replaceVariableRules: ReplaceVariableRules[],
  options: Options,
) => {
  return Promise.all(
    replaceVariableRules.map((ruleOption) =>
      generateCoverage({ options, ruleOption }),
    ),
  );
};
