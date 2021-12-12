export const ANT_DESIGN_PRESET_COLOR_LIST = [
  'blue',
  'purple',
  'cyan',
  'green',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold',
  'primary-color',
  'magenta',
];

export const PRIMARY_KEY = 'primary';

// ant-design color series
export const ANT_DESIGN_COLOR_MAP = new Map<string, string[]>();

ANT_DESIGN_COLOR_MAP.set('blue-6', [
  'primary-color',
  'info-color',
  'processing-color',
  'link-color',
]);
ANT_DESIGN_COLOR_MAP.set('green-6', ['success-color']);
ANT_DESIGN_COLOR_MAP.set('red-6', ['error-color', 'highlight-color']);
ANT_DESIGN_COLOR_MAP.set('gold-6', ['warning-color']);

export const REVERT_COLOR_MAP: [string, string[]][] = [
  [
    'primary-color',
    ['info-color', 'processing-color', 'primary-6', 'link-color', 'blue-6'],
  ],
  ['success-color', ['green-6']],
  ['error-color', ['red-6', 'highlight-color']],
  ['warning-color', ['gold-6']],
];

export const ANT_DESIGN_BASE_COLOR = 'blue';
