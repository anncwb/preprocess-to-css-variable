import type {
  AtRule as PostCssAtRule,
  Declaration,
  Result,
  Root,
  Helpers,
} from 'postcss';

export type AtRuleUnionDeclaration = AtRule | Declaration;

export type AtRule = PostCssAtRule & { value?: string };

export * from 'postcss';

export type FormatResult = (result: Result) => Result;

export type DeclarationProcessor = (
  decl: Declaration,
  helper: Helpers,
) => Promise<void> | void;

export type AtRuleProcessor = (
  atRule: AtRule,
  helper: Helpers,
) => Promise<void> | void;

export interface ReplaceVariableRules {
  styleFilePath: string;
  atRules?: AtRuleProcessor[];
  decls?: DeclarationProcessor[];
  resolveRoot?: (root: Root) => void;
  formatResult?: FormatResult;
}

export type Options = {
  libraryItem: LibraryItem;
  libraryDir: string;
  cwd: string;
  force: boolean;
  revert: boolean;
  debug: boolean;
  verbose: boolean;
  joinFullPath: (...paths: string[]) => string;
};

export interface LibraryItem {
  absolute?: boolean;
  absolutePath?: string;
  name: string;
  includes: string[];
}
export interface RunLessToCssVariablesOptions {
  cwd?: string;
  revert?: boolean;
  force?: boolean;
  debug?: boolean;
  verbose?: boolean;
  libraryList?: LibraryItem[];
  includes?: [];
  series?: SeriesType;
}

export interface ProcessFunction {
  funcName: string;
  decls: DeclarationProcessor[];
  atRules: AtRuleProcessor[];
  formatResult: FormatResult;
}

export type SeriesType = 'ant-design';
