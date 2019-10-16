import React, { useState } from 'react';
import { Radio, InputNumber } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
function FareSelector(props: any) {
  const [disabled, setDisabled]: useStateType = useState<boolean>(false);
  return (
    <>
      <Radio disabled={disabled} onChange={(e: RadioChangeEvent) => {setDisabled(e.target.checked)}}>
        <InputNumber style={{width: 80}}/>
      </Radio>
      <br />
      <Radio disabled={disabled}>不发货</Radio>
    </>
  );
}

export default FareSelector;
