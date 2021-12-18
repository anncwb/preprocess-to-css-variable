import { runLessToCssVariables } from '../../../core/dist/index';

runLessToCssVariables({
  // revert: true,
  force: true,
  libraryList: [
    {
      absolute: true,
      absolutePath: require.resolve('antd'),
      name: 'antd',
      includes: ['es', 'lib'],
    },
  ],
});
