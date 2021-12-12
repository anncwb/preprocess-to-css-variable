import { defineRuleOptions } from '../../utils';
import { antDesignColorMap } from '../../context';
import { ANT_DESIGN_COLOR_MAP } from '../../constants/color';
import { createProcessColorFunc } from '../../color-func';
import { mergeRule } from '../index';
import { COLOR_FUNC_NAME_LIST } from '../../../client/util';
import isColor from 'is-color';

const rule = defineRuleOptions({
  styleFilePath: 'style/themes/default.less',
  atRules: [
    (atRule) => {
      const value = atRule.value?.replace(/^@/, '');
      if (!value) {
        return;
      }
      if (atRule.value && antDesignColorMap.has(atRule.name)) {
        if (atRule.value.includes('@')) {
          const mapValue = antDesignColorMap.get(value);
          mapValue && antDesignColorMap.set(atRule.name, mapValue);
        } else {
          antDesignColorMap.set(atRule.name, atRule.value);
        }
        const varName = atRule.name.replace(/^@/, '');
        const hasAlias = ANT_DESIGN_COLOR_MAP.get(varName);
        atRule.value = `var(--${hasAlias ? atRule.name : varName})`;
      }
    },
    (atRule) => {
      const name = atRule.name;
      const value = atRule.value;

      let includeLessFunc = false;
      for (const funcName of COLOR_FUNC_NAME_LIST) {
        if (includeLessFunc) {
          continue;
        }
        if (value?.includes(funcName)) {
          includeLessFunc = true;
        }
      }

      if (!antDesignColorMap.has(name) && value && !includeLessFunc) {
        // 暂时只抽取 颜色变量
        if (isColor(value)) {
          antDesignColorMap.set(name, value);
          atRule.value = `var(--${name})`;
        }
      }
    },
  ],
});

const processColorFunc = createProcessColorFunc();

for (const processFunc of processColorFunc) {
  mergeRule(rule, processFunc);
}

export default rule;
