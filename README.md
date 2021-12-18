# preprocess-to-css-variable

用于组件库将 Less 变量转化为 css 变量

## 安装

```bash
yarn add preprocess-to-css-variable -D
```

## 使用

### CLI

```js
// package.json

// ant-design
"scripts": {
  "postinstall": "pcv ant-design"
},

// ant-design-vue
"scripts": {
  "postinstall": "pcv ant-design-vue"
},

// --force  强制执行
// --verbose  打印修改文件
// --revert  还原默认
"scripts": {
  "postinstall": "pcv ant-design --force --verbose --revert"
},
```

### Node Api

```js
import { runLessToCssVariables } from 'preprocess-to-css-variable';

runLessToCssVariables({
  // revert: false,
  // force: false,
  libraryList: [
    {
      name: 'ant-design',
    },
  ],
});
```

### 客户端使用

```js
import { generate } from 'preprocess-to-css-variable/es';

(async () => {
  await generate(Options);
})();
```

#### generate

```ts
export interface GenerateOptions {
  /**
   *  css 变量插入的节点
   * @default :root
   */
  selector?: string | HTMLElement;
  /**
   *  预设的主颜色
   */
  color?:
    | {
        primary?: string;
        error?: string;
        warning?: string;
        success?: string;
      }
    | string;
  /**
   *  需要改变的变量
   */
  variables?: Record<string, string>;
  /**
   *  需要进行计算的颜色
   */
  manualVariables?: string[];
}
export declare function generate(options?: GenerateOptions): Promise<{
  variables: Record<string, string>;
  cssText: string;
}>;
```

## 其他说明

执行成功之后，首次执行 `generate`，会将 所有的 css 变量插入到 `:root` 上面，后续只要修改对应的 css 变量即可达到修改主题的效果，具体的 css 变量请在执行成功后打开 `Chrome devtools` 进行查看。

## 已支持的组件库

- [x] Ant Design
- [x] Ant Design Vue

## 灵感来源

[transform-antd-theme-variable](https://github.com/spark-build/transform-antd-theme-variable)
