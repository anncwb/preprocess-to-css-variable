import cssVariables, {
  unCoverVariable,
  convertedVariables,
  // @ts-ignore skip
} from './less-variables';
import { getVarNameAndFunc, __ANT_DESIGN_FUNCTION_TOKEN__ } from './util';
import * as util from './util';
import { generate as antDesignGenerate } from '@ant-design/colors';
export interface GenerateOptions {
  selector?: string | HTMLElement;
  color?:
    | {
        primary?: string;
        error?: string;
        warning?: string;
        success?: string;
      }
    | string;
  variables?: Record<string, string>;
  manualVariables?: string[];
}

export async function generate(options: GenerateOptions = {}) {
  const { selector = ':root', color, manualVariables = [] } = options;
  mergeConvertedVariables(manualVariables);

  if (typeof color === 'string') {
    options.color = {
      primary: color,
    };
  }
  const variables = await generateVariables(options);

  let cssText = ``;
  Object.keys(variables).forEach((key) => {
    cssText += `\t${key}: ${variables[key]};\n`;
  });
  const dom =
    typeof selector === 'string'
      ? document && (document.querySelector(selector) as HTMLElement)
      : selector;

  if (dom) {
    dom.style.cssText = dom.style.cssText + cssText;
  }
  return { variables, cssText };
}

async function generateVariables(
  options: GenerateOptions = {},
): Promise<Record<string, string>> {
  const generateColor = await generateColors(options);
  Object.assign(cssVariables, generateColor, options.variables || {});
  const result = convertedVariables;

  await Promise.all(
    Object.keys(unCoverVariable).map(async (key) => {
      const ret = getVarNameAndFunc(key);
      if (ret) {
        const { varName, funcName, varNumber } = ret;

        const color = cssVariables[varName] || result[`--${varName}`];
        if (color) {
          const newColor = util[funcName](color, varNumber);
          cssVariables[key] = newColor;
        }
      }
    }),
  );
  // // 转化需要计算的颜色
  // Object.keys(unCoverVariable).forEach((key) => {
  //   const ret = getVarNameAndFunc(key);
  //   if (ret) {
  //     const { varName, funcName, varNumber } = ret;

  //     const color = cssVariables[varName] || result[`--${varName}`];
  //     if (color) {
  //       const newColor = util[funcName](color, varNumber);
  //       cssVariables[key] = newColor;
  //     }
  //   }
  // });

  // 转成 var类型
  Object.keys(cssVariables).forEach((key) => {
    result[`--${key}`] = cssVariables[key];
  });
  return result;
}

async function generateColors(options: GenerateOptions = {}) {
  const { color = {} } = options;
  const result: Record<string, string> = {};
  // 第5个主色
  const mainIndex = 5;

  const alias = {
    primary: 'blue',
    success: 'green',
    error: 'red',
    warning: 'gold',
  };

  Object.keys(color).forEach((key) => {
    if (color[key]) {
      const colors = antDesignGenerate(color[key]);
      result[`${key}-color`] = colors[mainIndex];
      const getValue = (item, index) =>
        index === mainIndex ? `var(--${key}-color)` : item;
      colors.forEach((item, index) => {
        result[`${alias[key]}-${index + 1}`] = getValue(item, index);
      });

      if (key === 'primary') {
        colors.forEach((item, index) => {
          result[`primary-${index + 1}`] = getValue(item, index);
        });
      }
    }
  });
  return result;
}

function mergeConvertedVariables(variables: string[] = []) {
  const obj = {};
  variables.forEach((key) => {
    obj[key] = __ANT_DESIGN_FUNCTION_TOKEN__;
  });
  Object.assign(unCoverVariable, obj);
}

export default { generate };
