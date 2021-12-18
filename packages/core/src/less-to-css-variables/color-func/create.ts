import type {
  AtRuleUnionDeclaration,
  FormatResult,
  Result,
} from '../../../types';
import funcTemplate from '../templates/cover-func-template';
import upperFirst from 'lodash/upperFirst';
import { whenColorFuncReplace } from '../utils/when-replace';
import { antDesignColorMap } from '../context';
import * as util from '../../client/util';

/**
 * 创建注入函数
 * @param funcName 函数名
 */
export const createInjectMixinTemplateFunction = (funcName: string) => {
  const templateName = `cover${upperFirst(funcName)}Template`;
  return (result: Result) => {
    try {
      // postcss-less 无法解析 @functions 的用法
      // 所以直接通过修改通配生成后的字符文件内容进行注入
      result.css = (funcTemplate as any)[templateName] + result.css;
    } catch (error) {
      console.error('injection template error: ', error);
    }
    return result;
  };
};

/**
 * 创建覆盖函数
 * @param funcName 函数名
 * @returns
 */
export const createCoverFunc = (funcName: string) => {
  return (atRule: AtRuleUnionDeclaration) => {
    return whenColorFuncReplace(
      atRule,
      (str) => !!str && str.indexOf(`${funcName}(`) !== -1,
      (str) => {
        if (funcName === 'color') {
          return (
            str
              .replace(/\s/g, '')
              .replace(/color\(~?`?([^`]+)+(?=\)$)*/, (_, $1) => $1)
              // hack
              .replace('`)', '')
          );
        }

        const coverName = `cover${upperFirst(funcName)}`;
        const isFunctionVariables = str.includes(';');

        const replaceRE = str.includes('~`')
          ? new RegExp(`(${funcName})(\\(([.*\\s\\S][?=^;])+?=\\))`, 'g')
          : new RegExp(`(${funcName})(\\([.*\\s\\S]+\\))`);

        if (!replaceRE.test(str)) {
          return str
            .replace(new RegExp(`${funcName}\\(`, 'g'), coverName + '(')
            .replace(/%/g, '');
        }
        return str.replace(replaceRE, (_, $1, $2) => {
          let value: string = $2.replace(/\s/g, '');

          if (value.startsWith('(') && value.endsWith(')')) {
            value = value.substring(1, value.length - 1);
          }

          let varName = value;
          let varNumber = '';
          if (value.includes(',')) {
            const [p1, p2] = value.split(',');
            varName = p1;
            varNumber = p2;
          }

          value = value.substring(1, value.length - 1);

          if (varName.includes('@')) {
            const [s, v] = varName.split('@');
            varName = s.includes("'") ? `${s}@${v}` : `'@{${v}}'`;
          } else {
            const intNumber = parseInt(varNumber);
            if (util.staticColorList.includes(funcName)) {
              return util[funcName](varName, intNumber);
            }
          }

          if (varNumber.includes('%')) {
            varNumber = varNumber.replace(/%$/, '');
          }

          if (varNumber.includes('@')) {
            const match = varNumber.match(/@([\w-]+)/);
            const name = match?.[1];
            if (name) {
              varNumber = `'@{${name}}'`;
            }
          }

          const newFuncName = $1.replace(new RegExp(funcName, 'g'), coverName);
          handleCoverVariables(
            isFunctionVariables,
            funcName,
            varName,
            varNumber,
          );
          let result = `${newFuncName}(${varName}${
            varNumber ? `,${varNumber}` : ''
          })`;

          result =
            result.includes('~`') || str.includes('~`')
              ? result
              : `~\`${result}\``;

          if (!matchBrackets(result)) {
            result = result.replace(/;?$/, ');');
          }
          return result.replace(/%/, '');
        });
      },
    );
  };
};
function handleCoverVariables(
  isFunctionVariables: boolean,
  funcName: string,
  varName: string,
  varNumber: string,
) {
  if (!isFunctionVariables) {
    const match = varName.match(/\{(.*)\}/);
    if (match) {
      const name = match[1];
      // 小于1
      let num = parseInt(varNumber);
      if (num < 1) {
        num = num * 10;
      }
      const variablesName = `${name}--${funcName}--${num}`;
      antDesignColorMap.set(variablesName, util.__ANT_DESIGN_FUNCTION_TOKEN__);
    }
  }
}

/**
 * 创建相关函数
 * @param funcName
 * @returns
 */
export function createColorFunction(
  funcName: string,
): [(atRule: AtRuleUnionDeclaration) => void, FormatResult] {
  const injectFunc = createInjectMixinTemplateFunction(funcName);
  const coverFunc = createCoverFunc(funcName);
  return [coverFunc, injectFunc];
}

function matchBrackets(str: string) {
  var n = 0;
  for (let s of str) {
    if (s === '(') {
      n++;
    }
    if (s === ')') {
      if (n === 0) {
        return false;
      }
      n--;
    }
  }
  return n === 0;
}
