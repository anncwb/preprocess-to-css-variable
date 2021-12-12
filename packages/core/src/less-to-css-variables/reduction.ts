import type { Options, ReplaceVariableRules } from '../../types';
import { existsSync, copyFile, remove } from 'fs-extra';
import { getBackupFilePath } from './utils';

const moduleTypes = {
  esm: 'es',
  lib: 'lib',
};

// 还原
const reduction = async (
  ruleOption: ReplaceVariableRules,
  options: Options,
) => {
  const { joinFullPath } = options;
  // 获取真实的备份 less 文件路径
  const backupStyleFilePath = getBackupFilePath(ruleOption.styleFilePath);

  return Promise.all(
    // 打包的模块规范有两种，都要覆盖，避免错误引用导致出现问题
    Object.values(moduleTypes).map(async (norm) => {
      const realStyleFilePathByNorm = joinFullPath(
        norm,
        ruleOption.styleFilePath,
      );
      const backupFilePath = joinFullPath(norm, backupStyleFilePath);

      if (!existsSync(backupFilePath)) {
        return Promise.resolve();
      }

      // 复制覆盖
      await copyFile(backupFilePath, realStyleFilePathByNorm);
      return remove(backupFilePath);
    }),
  );
};

// 批量还原
export const runReductions = (
  replaceVariableRules: ReplaceVariableRules[],
  options: Options,
) => {
  return Promise.all(
    replaceVariableRules.map((item) => reduction(item, options)),
  );
};
