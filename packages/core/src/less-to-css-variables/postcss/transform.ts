import type { Plugin, Result } from 'postcss';
import type { ReplaceVariableRules } from '../../../types';
import postcss from 'postcss';
import * as syntax from 'postcss-less';
import { readFile, existsSync } from 'fs-extra';

type PluginOptions = Pick<
  ReplaceVariableRules,
  'atRules' | 'resolveRoot' | 'formatResult' | 'decls'
>;
const transformPlugin = ({
  resolveRoot,
  atRules,
  decls,
}: PluginOptions): Plugin => {
  return {
    postcssPlugin: 'transformLessToCssVariablePlugin',
    Root(root) {
      resolveRoot?.(root);
    },
    async AtRule(atRule, helper) {
      if (atRules) {
        Promise.all(atRules.map((fn) => fn(atRule, helper)));
      }
    },
    Declaration(decl, helper) {
      if (decls) {
        Promise.all(decls.map((fn) => fn(decl, helper)));
      }
    },
  };
};
export const transformLessToCssVariable = async (
  filePath: string,
  options: PluginOptions,
) => {
  if (!existsSync(filePath)) {
    throw new Error(
      `[transformLessToCssVariable] ${filePath} file does not exist.`,
    );
  }
  const fileContent = (await readFile(filePath)).toString('utf-8');

  return postcss([transformPlugin(options)])
    .process(fileContent, { syntax, from: filePath })
    .then((result): Result => options.formatResult?.(result) ?? result)
    .catch((e) => console.log('postcss error', e));
};
