import type { ProcessFunction } from '../../../types';
import { COLOR_FUNC_NAME_LIST } from '../../client/util';
import { createColorFunction } from './create';

export function createProcessColorFunc(): ProcessFunction[] {
  const processFunctionList: ProcessFunction[] = [];
  COLOR_FUNC_NAME_LIST.forEach((funcName) => {
    const [coverFunc, injectFunc] = createColorFunction(funcName);
    processFunctionList.push({
      funcName,
      decls: [coverFunc],
      atRules: [coverFunc],
      formatResult: injectFunc,
    });
  });
  return processFunctionList;
}
