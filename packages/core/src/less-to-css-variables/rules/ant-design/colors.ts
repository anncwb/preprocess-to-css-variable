import { defineRuleOptions } from '../../utils';
import { generate } from '@ant-design/colors';
import {
  ANT_DESIGN_BASE_COLOR,
  ANT_DESIGN_COLOR_MAP,
} from '../../constants/color';
import { antDesignColorMap } from '../../context';
import { createProcessColorFunc } from '../../color-func';
import { mergeRule } from '..';
import { Result } from '../../../../types';
import { PRIMARY_KEY } from '../../constants/color';

const COLOR_NAME_RE = /(\w+)-(\d)+$/;
const COLOR_MAIN_RE = /(\w+)-6$/;

const BASE_NAME_RE = /(\w+)-(base)$/;

const defaultMainColorMap = new Map<string, string>();

const baseColorMap = new Map<string, string>();
const rule = defineRuleOptions({
  styleFilePath: 'style/color/colors.less',
  atRules: [
    (atRule) => {
      if (BASE_NAME_RE.test(atRule.name)) {
        baseColorMap.set(atRule.name, atRule.value!);
      }
      // 修改color.less为css变量，并记录到数组内
      if (COLOR_MAIN_RE.test(atRule.name)) {
        let value = atRule.value;
        const match = atRule.name.match(COLOR_MAIN_RE);
        const colorName = match?.[1];
        if (value?.startsWith('@') && BASE_NAME_RE.test(value)) {
          value = baseColorMap.get(value.replace(/^@/, ''));
        }
        if (colorName && value) {
          const colors = generate(value);
          const mainColor = colors[5];

          defaultMainColorMap.set(colorName, mainColor);
          colors.forEach((color, index) => {
            antDesignColorMap.set(`${colorName}-${index + 1}`, color);
          });
          // 对一些特殊的环境变量进行写入，如 primary-color error-color
          const addColors = ANT_DESIGN_COLOR_MAP.get(atRule.name);

          if (addColors && Array.isArray(addColors)) {
            addColors.forEach((item) => {
              const mainKey = `${colorName}-6`;
              antDesignColorMap.set(item, `var(--${mainKey})`);
            });
          }

          // 额外添加ant-design系列的 primary-{n}
          if (colorName === ANT_DESIGN_BASE_COLOR) {
            colors.forEach((color, index) => {
              // primary-color
              antDesignColorMap.set(
                `primary-${index + 1}`,
                index === 5 ? 'var(--primary-color)' : color,
              );
            });
          }
        }
        atRule.value = `var(--${atRule.name})`;
      }
      if (
        COLOR_NAME_RE.test(atRule.name) &&
        atRule.name.startsWith(PRIMARY_KEY)
      ) {
        atRule.value = `var(--${atRule.name})`;
      }
    },
  ],
  formatResult: (result: Result) => {
    let cssText = ``;
    for (const [key, value] of defaultMainColorMap) {
      cssText += `\t--${key}-6: ${value};\n`;
    }
    result.css = `:root{\n${cssText}}\n` + result.css;
    return result;
  },
});

const processColorFunc = createProcessColorFunc();

for (const processFunc of processColorFunc) {
  mergeRule(rule, processFunc);
}

export default rule;
