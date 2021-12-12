import less from 'less';

// const mx = ``;
// less.render(
//   `
// .coverFadeMixin() {
//   @functions: ~\`(function () {
//     this.coverFade = function (color, amount) {
//       if (String(color).indexOf('var(') === 0) {
//         /*
//           做这样的转化
//           (var(--error-color), 30%) ===> var(--error-color--fade-7)
//         */
//         return color.replace(')', '--fade-' + parseInt(amount) + ')');
//       }

//        return color
//     };
//   })()\`;
// }
// .coverFadeMixin();

// @black: var(--aaa-1);
// @text-color: ~\`coverFade('@{black}', '65%')\`;

// div{
//   color: @text-color;
//   box-shadow: 0 2px 8px ~\`coverFade('@{black}', 45)\` inset;
// }
// `,
//   { javascriptEnabled: true },
//   (err, data) => {
//     console.log(err, data);
//   },
// );

const str = `(~\`fade('@{color}', 5) \`; transparent; transparent)`;

const newStr = str.replace(
  str.includes('~`')
    ? /(fade)(\(([.*\s\S])+\))/g
    : new RegExp(`(fade)(\\([.*\\s\\S]+\\))`),
  (_, $1, $2) => {
    console.log(2222, $1);

    let value = $2.replace(/\s/g, '');

    value = value.substring(1, value.length - 1);
    let param1 = value;
    let param2 = '';

    if (value.includes(',')) {
      const [p1, p2] = value.split(',');
      param1 = p1;
      param2 = p2;
    }
    if (param1.includes('@')) {
      const [s, v] = param1.split('@');
      param1 = s.includes("'") ? `${s}@${v}` : `'@{${v}}'`;
    }

    if (param2.includes('%')) {
      param2 = param2.replace('%', '');
    }

    const result = `${$1.replace(
      new RegExp('fade', 'g'),
      'coverFade',
    )}(${param1}${param2 ? `,${param2}` : ''})`;

    return result.includes('~`') || str.includes('~`')
      ? result
      : `~\`${result}\``;
  },
);

console.log(111, newStr);
