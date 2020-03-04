import React, { useState, useEffect } from 'react';
import { Radio, Input, Row } from 'antd';
import { joinFilterEmpty } from '@/pages/helper';
function ReturnAddress({ returnContact, returnPhone, returnAddress, setReturnAddress }: any) {
  const [data, setData] = useState({
    contact: '',
    phone: '',
    address: '',
  });
  const [radioKey, setRadioKey] = useState(1);
  const textInput: any = React.createRef();
  useEffect(() => {
    let result =
      radioKey === 1
        ? {
          returnContact,
          returnPhone,
          returnAddress,
        }
        : {
          returnContact: data.contact,
          returnPhone: data.phone,
          returnAddress: data.address,
        };
    setReturnAddress(result);
  }, [radioKey, returnContact, returnPhone, returnAddress, data.contact, data.phone, data.address]);
  const handleChange = (event: any) => {
    const { value } = event.target;
    if (value === 0) {
      textInput.current.focus();
    }
    setRadioKey(value);
  };
  const handleInput = (event: any) => {
    const { value, name } = event.target;
    setData(
      Object.assign({}, data, {
        [name]: value,
      }),
    );
  };
  const handleFocus = () => {
    setRadioKey(0);
  };
  return (
    <Radio.Group value={radioKey} onChange={handleChange}>
      <Row>
        <Radio value={1}>
          {joinFilterEmpty([returnContact, returnPhone, returnAddress]) || '暂无'}
        </Radio>
      </Row>
      <Row>
        <Radio value={0}>
          <Input.Group>
            <Input
              ref={textInput}
              onFocus={handleFocus}
              name="contact"
              placeholder="收货人姓名"
              onChange={handleInput}
            />
            <Input
              onFocus={handleFocus}
              placeholder="收货人电话"
              name="phone"
              type="tel"
              maxLength={11}
              onChange={handleInput}
            />
            <Input
              onFocus={handleFocus}
              style={{ width: '300px' }}
              name="address"
              placeholder="收货人详细地址"
              onChange={handleInput}
            />
          </Input.Group>
        </Radio>
      </Row>
    </Radio.Group>
  );
}
export default ReturnAddress;
