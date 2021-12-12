import tinycolor from 'tinycolor2';

export const __ANT_DESIGN_FUNCTION_TOKEN__ = '_T_';

export const COLOR_FUNC_NAME_LIST: string[] = [
  'color',
  'darken',
  'tint',
  'fade',
  'lighten',
  'shade',
  'fadeout',
  'fadein',
  'colorPalette',
];

export const staticColorList = COLOR_FUNC_NAME_LIST.filter(
  (item) => ~['color', 'colorPalette'].includes(item),
);

function clamp(val: any) {
  return Math.min(1, Math.max(0, val));
}

export const lighten = (color: string, amount?: number): string =>
  tinycolor(color).lighten(amount).toString();

export const darken = (color: string, amount?: number): string =>
  tinycolor(color).darken(amount).toString();

// https://github.com/less/less.js/blob/b37922cfb2932f00d1e8b340f4799ff24a2af0f2/packages/less/src/less/functions/color.js#L318
export const fade = (color: string, amount: number = 10): string => {
  const hsl = tinycolor(color).toHsl();
  hsl.a = amount / 100;
  hsl.a = clamp(hsl.a);
  return tinycolor(hsl).toString();
};

// https://github.com/less/less.js/blob/b37922cfb2932f00d1e8b340f4799ff24a2af0f2/packages/less/src/less/functions/color.js#L444

export const tint = (color: string, amount: number = 10): string => {
  return tinycolor.mix('#ffffff', color, amount).toString();
};
export const shade = (color: string, amount: number = 10): string => {
  return tinycolor.mix('#000000', color, amount).toString();
};

export const fadein = (color, amount, method) => {
  const hsl = tinycolor(color).toHsl();

  if (typeof method !== 'undefined' && method.value === 'relative') {
    hsl.a += (hsl.a * amount.value) / 100;
  } else {
    hsl.a += amount.value / 100;
  }
  hsl.a = clamp(hsl.a);
  return tinycolor(hsl).toString();
};

export const fadeout = (color, amount, method) => {
  const hsl = tinycolor(color).toHsl();

  if (typeof method !== 'undefined' && method.value === 'relative') {
    hsl.a -= (hsl.a * amount.value) / 100;
  } else {
    hsl.a -= amount.value / 100;
  }
  hsl.a = clamp(hsl.a);
  return tinycolor(hsl).toString();
};

// card-skeleton-bg--fade--40
// ! 性能问题
export const COLOR_FN_RE = new RegExp(
  `(.*)+--(${COLOR_FUNC_NAME_LIST.join('|')})--(\\d+)`,
);

export function getVarNameAndFunc(key: string) {
  // const match = key.match(COLOR_FN_RE);
  const [varName, funcName, varNumber] = key.split(
    new RegExp(`--(${COLOR_FUNC_NAME_LIST.join('|')})--`),
  );

  return { varName, funcName, varNumber };
  // if (match) {
  //   const [, varName, funcName, varNumber] = match;
  //   return { varName, funcName, varNumber };
  // }
}

// export const colorPalette = (function () {
//   let hueStep = 2;
//   let saturationStep = 16;
//   let saturationStep2 = 5;
//   let brightnessStep1 = 5;
//   let brightnessStep2 = 15;
//   let lightColorCount = 5;
//   let darkColorCount = 4;

//   let getHue = function (hsv, i, isLight) {
//     let hue;
//     if (hsv.h >= 60 && hsv.h <= 240) {
//       hue = isLight ? hsv.h - hueStep * i : hsv.h + hueStep * i;
//     } else {
//       hue = isLight ? hsv.h + hueStep * i : hsv.h - hueStep * i;
//     }
//     if (hue < 0) {
//       hue += 360;
//     } else if (hue >= 360) {
//       hue -= 360;
//     }
//     return Math.round(hue);
//   };
//   let getSaturation = function (hsv, i, isLight) {
//     let saturation;
//     if (isLight) {
//       saturation = Math.round(hsv.s * 100) - saturationStep * i;
//     } else if (i === darkColorCount) {
//       saturation = Math.round(hsv.s * 100) + saturationStep;
//     } else {
//       saturation = Math.round(hsv.s * 100) + saturationStep2 * i;
//     }
//     if (saturation > 100) {
//       saturation = 100;
//     }
//     if (isLight && i === lightColorCount && saturation > 10) {
//       saturation = 10;
//     }
//     if (saturation < 6) {
//       saturation = 6;
//     }
//     return Math.round(saturation);
//   };
//   let getValue = function (hsv, i, isLight) {
//     if (isLight) {
//       return Math.round(hsv.v * 100) + brightnessStep1 * i;
//     }
//     return Math.round(hsv.v * 100) - brightnessStep2 * i;
//   };

//   return (color, index) => {
//     var isLight = index <= 6;
//     var hsv = tinycolor(color).toHsv();
//     var i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;
//     return tinycolor({
//       h: getHue(hsv, i, isLight),
//       s: getSaturation(hsv, i, isLight),
//       v: getValue(hsv, i, isLight),
//     }).toHexString();
//   };
// })();
