import upperFirst from 'lodash/upperFirst';
import { COLOR_FUNC_NAME_LIST } from '../../client/util';
function createBaseTemplate(funcName: string) {
  const upName = upperFirst(funcName);
  return `.cover${upName}Mixin() {
  @functions: ~\`(function() {
    this.cover${upName} = function(color, amount) {
      if (String(color).indexOf('var(') === 0) {
        /*
          (var(--primary-color), 7) -> var(--primary-7)
        */
        if (color.indexOf('--primary-color') !== -1 ) {
          var m = amount > 10 ? amount/10 :amount
          return color.replace('-color)',  '-' + m + ')')
        }
        /*
          (var(--error-color), 70%) ===> var(--error-color--${funcName}-7)
        */
        return color.replace(')',  '--${funcName}--' + parseInt(amount) + ')')
      }
      return color
    }
  })()\`;
}
.cover${upName}Mixin();\n`;
}

const result: Record<string, string> = {};
COLOR_FUNC_NAME_LIST.forEach((funcName) => {
  const name = `cover${upperFirst(funcName)}Template`;
  if (funcName === 'color') {
    result[name] = ``;
  } else {
    result[name] = createBaseTemplate(funcName);
  }
});

export default result;
