import { runLessToCssVariables } from '../../../core/dist/index';

runLessToCssVariables({
  // revert: true,
  force: true,
  libraryList: [
    {
      absolute: true,
      absolutePath: require.resolve('ant-design-vue'),
      name: 'ant-design-vue',
      includes: ['es', 'lib'],
    },
  ],
});
