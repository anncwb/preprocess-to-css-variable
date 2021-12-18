import React, { useState } from 'react';
import { Button, Steps } from 'antd';
import { generate } from '../../../core/es/index';

const Step = Steps.Step;
const App = () => {
  const [color, setColor] = useState();
  let refDom: any;
  const inputChange = (e: any) => {
    const value = e.target?.value;
    setColor(value);
    generate({ color: { primary: color } });
  };

  const handleClick = () => {
    refDom?.click();
  };

  return (
    <div className="main">
      <h2>ant design</h2>
      <div className="content">
        <div className="comp">
          <>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed Button</Button>
            <Button type="text">Text Button</Button>
            <Button type="link">Link Button</Button>
          </>
          <Steps current={1}>
            <Step title="Finished" description="This is a description." />
            <Step
              title="In Progress"
              subTitle="Left 00:00:08"
              description="This is a description."
            />
            <Step title="Waiting" description="This is a description." />
          </Steps>
          ,
        </div>
        <div className="color-picker">
          <div
            className="select-button"
            onClick={handleClick}
            style={{ background: color }}
          >
            点击选择颜色
          </div>
          <input
            ref={(node) => (refDom = node)}
            type="color"
            onInput={inputChange}
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
