import React, { useState, useEffect } from 'react';
import { Radio, Input } from 'antd';
import { joinFilterEmpty } from '@/pages/helper';

function ReturnAddress({ returnContact, returnPhone, returnAddress, setReturnAddress }) {
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [radioKey, setRadioKey] = useState(1)
  const textInput = React.createRef();
  useEffect(() => {
    let result = radioKey === 1 ? ({
      returnContact,
      returnPhone,
      returnAddress
    }) : ({
      returnContact: contact,
      returnPhone: phone,
      returnAddress: address
    })
    setReturnAddress(result)
  }, [radioKey, contact, phone, address])
  const handleChange = (event) => {
    const { value } = event.target;
    if (value === 0) {
      textInput.current.focus();
    }
    setRadioKey(value)
  }
  return (
    <Radio.Group value={radioKey} onChange={handleChange}>
      <Radio value={1}>{joinFilterEmpty([returnContact, returnPhone, returnAddress]) || '暂无'}</Radio>
      <Radio value={0}>
        <Input.Group>
          <input ref={textInput} placeholder="收货人姓名" value={contact} onChange={(event) => { setContact(event.target.value) }} />
          <input placeholder="收货人电话" type="tel" maxLength={11} value={phone} onChange={(event) => { setPhone(event.target.value) }} />
          <input style={{ width: '300px' }} placeholder="收货人详细地址" value={address} onChange={(event) => { setAddress(event.target.value) }} />
        </Input.Group>
      </Radio>
    </Radio.Group>
  )
}
export default ReturnAddress;