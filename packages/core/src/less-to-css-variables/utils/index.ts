import type { ReplaceVariableRules, FormatResult } from '../../../types';
import path from 'path';
import { BACKUP_EXT } from '../constants';
import isFunction from 'lodash/isFunction';

// Get the location of the backup file
export const getBackupFilePath = (mainPath: string, backupPath?: string) => {
  if (backupPath) {
    return backupPath;
  }
  const ext = path.extname(mainPath);
  if (mainPath.endsWith(`${BACKUP_EXT}${ext}`)) {
    return mainPath;
  }
  return mainPath.replace(ext, BACKUP_EXT + ext);
};

export const defineRuleOptions = (options: ReplaceVariableRules) => options;

export const compose =
  <F extends FormatResult>(...args: F[]) =>
  (params: ReturnType<FormatResult>) =>
    args.reduce((prev, current) => {
      const result = isFunction(prev) ? prev(params) : prev;
      return current(result) as any;
    }) as any;
