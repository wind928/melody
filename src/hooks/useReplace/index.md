## useReplace

将字符串中的 \${} 占位符进行替换，可以替换为数字、字符串等简单对象，也可以替换为 dom 或 react 元素

Demo:

```tsx
import React, { useState } from 'react';
import { Input, Tag } from 'antd';
import { useReplace } from 'melody';
import 'antd/dist/antd.css';

export default () => {
  const [testStr, setTestStr] = useState('${subjectStr} is a ${objectStr}');
  const replaceOptions = {
    subjectStr: 123,
    objectStr: key => <Tag color="green">{key}</Tag>,
  };
  const result = useReplace(testStr, replaceOptions);
  return (
    <div>
      <div>
        <h3>测试字符串： </h3>
        <Input value={testStr} onInput={e => setTestStr(e.target.value)} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>替换结果： </h3>
        {result}
      </div>
    </div>
  );
};
```

More skills for writing demo: https://d.umijs.org/guide/demo-principle
