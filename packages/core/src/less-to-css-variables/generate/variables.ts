import { antDesignColorMap } from '../context';
import {
  ANT_DESIGN_BASE_COLOR,
  ANT_DESIGN_COLOR_MAP,
  ANT_DESIGN_PRESET_COLOR_LIST,
  PRIMARY_KEY,
  REVERT_COLOR_MAP,
} from '../constants/color';
import fs from 'fs-extra';
import path from 'path';
import { COLOR_FN_RE, __ANT_DESIGN_FUNCTION_TOKEN__ } from '../../client/util';

const FUNCTION_TOKEN_RE = /(\w+)-(\w+)--(\w+)--(\d{1,2})/;

async function transformPresetColorToVar() {
  const aliasColors: { color: string; alias: string }[] = [];
  const addonColors: string[] = [];
  for (const [key, value] of ANT_DESIGN_COLOR_MAP) {
    value.forEach((color) => {
      addonColors.push(color);
      aliasColors.push({
        color,
        alias: key.replace(
          new RegExp(`^${ANT_DESIGN_BASE_COLOR}`),
          PRIMARY_KEY,
        ),
      });
    });
  }

  for (const [key, value] of antDesignColorMap) {
    const match = key.match(FUNCTION_TOKEN_RE);
    if (match) {
      const [, varName, varNum, funcName, colorDepth] = match;

      if (
        value !== __ANT_DESIGN_FUNCTION_TOKEN__ ||
        funcName !== 'colorPalette' ||
        (!ANT_DESIGN_PRESET_COLOR_LIST.includes(varName) &&
          !addonColors.includes(`${varName}-${varNum}`))
      ) {
        continue;
      }

      // 6位主色，主色已经转换过
      if (parseInt(varNum) === 6) {
        antDesignColorMap.set(key, `var(--${varName}-${colorDepth})`);
      } else if (varName === PRIMARY_KEY) {
        antDesignColorMap.set(key, `var(--${PRIMARY_KEY}-${colorDepth})`);
      } else {
        const aliasColor = aliasColors.find(
          (item) => item.color === `${varName}-${varNum}`,
        );
        if (aliasColor) {
          antDesignColorMap.set(key, `var(--${aliasColor.alias})`);
        }
      }
    }
  }
}

function setEnvColor() {
  REVERT_COLOR_MAP.forEach((item) => {
    const [key, values] = item;
    values.forEach((val) => {
      antDesignColorMap.set(val, `var(--${key})`);
    });
  });
}

export async function generateVariables() {
  // 处理 预置函数转换为 var()
  await transformPresetColorToVar();

  // 需要计算的函数转换
  let variables = ``;
  let convertedVariables = ``;
  let unCoverVariables = ``;
  setEnvColor();
  for (const [key, value] of antDesignColorMap) {
    if (value.startsWith('var(')) {
      convertedVariables += `\t"--${key}": "${value}",\n`;
    } else if (value === __ANT_DESIGN_FUNCTION_TOKEN__) {
      const match = key.match(COLOR_FN_RE);
      if (match) {
        const matchKey = match?.[1];
        if (antDesignColorMap.has(matchKey)) {
          unCoverVariables += `\t"${key}": "${value}",\n`;
        }
        // else {
        //   console.log(key);
        // }
      }
    } else {
      variables += `\t"${key}": "${value}",\n`;
    }
  }

  fs.outputFileSync(
    path.resolve(__dirname, '../../../es/less-variables.js'),
    `export default {\n${variables}}\n export const unCoverVariable = {\n${unCoverVariables}}\nexport const convertedVariables = {\n${convertedVariables}}\n`,
    {
      encoding: 'utf8',
    },
  );
}
