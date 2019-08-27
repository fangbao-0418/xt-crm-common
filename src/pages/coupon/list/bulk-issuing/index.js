import React, { useState, useEffect } from 'react';
import { Message } from 'antd';
import { formItemLayout } from '@/config';
import { DatePicker, Row, Col, Card, Form, Checkbox, Input, Button, Radio } from 'antd';
import { saveCouponTaskInfo } from '../../api';
import Upload from '@/components/upload';
import '../index.scss'
// 批量发券
function BulkIssuing({ form: { getFieldDecorator, getFieldsValue, setFieldsValue }, match, history }) {
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  const getUserGroupValue = (fields) => {
    let result;
    switch (fields.receiveUserGroup) {
      case 0:
        return 0;
      case 1:
        result = fields.userLevel.join(',')
        return result;
      case 2:
        result = fields.userPhones;
        return result;
      case 3:
        return fileUrl;
      default:
        break;
    }
  }
  const getExecutionTime = (fields) => {
    let result;
    switch (fields.sendingTimeKey) {
      case 0:
        return 0;
      case 1:
        result = fields.timedTransmissionTime.valueOf();
        return result;
      default:
        return 0;
    }
  }
  const handleSave = async () => {
    const fields = getFieldsValue();
    const params = {
      ...fields,
      executionTime: getExecutionTime(fields),
      userGroupValue: getUserGroupValue(fields),
      couponId: +match.params.id
    };
    const res = await saveCouponTaskInfo(params);
    if (res) {
      Message.success('批量发券成功');
      history.goBack();
    }
  }
  // 是否定时发送
  const isTimedTransmission = () => {
    const { sendingTimeKey } = getFieldsValue(['sendingTimeKey']);
    return sendingTimeKey === 1;
  }
  const isUserLevel = () => {
    const { receiveUserGroup } = getFieldsValue(['receiveUserGroup']);
    return receiveUserGroup === 1;
  }
  const isUserPhones = () => {
    const { receiveUserGroup } = getFieldsValue(['receiveUserGroup']);
    return receiveUserGroup === 2;
  }
  const handleChange = (fileList) => {
    fileList = fileList.slice(-1);
    console.log('fileList=>', fileList)
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileUrl(fileList[0] && fileList[0].url);
    setFieldsValue({receiveUserGroup: 3})
    setFileList(fileList);
  }
  useEffect(() => {
    const urlSearch = new URLSearchParams(history.location.search);
    const name = urlSearch.get('name');
    console.log('name=>', name);
    setName(name)
  });
  return (
    <Card>
      <Row>
        <Col offset={3}>
          <h2 className="form-title">基本信息</h2>
        </Col>
      </Row>
      <Form {...formItemLayout}>
        <Form.Item label="优惠券名称">{name}</Form.Item>
        <Form.Item label="目标用户">
          {getFieldDecorator('receiveUserGroup', {
            initialValue: 0
          })(
            <Radio.Group>
              <Radio style={radioStyle} value={0}>全部用户</Radio>
              <Radio style={radioStyle} value={1}>按用户等级</Radio>
              {isUserLevel() && (
                getFieldDecorator('userLevel')(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={8}>
                        <Checkbox value={0}>普通用户</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={10}>普通团长</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={11}>体验团长</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={12}>星级团长</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={20}>社区管理员</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={30}>城市合伙人</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                )
              )}
              <Radio style={radioStyle} value={2}>指定用户</Radio>
              {isUserPhones() && (
                getFieldDecorator('userPhones')(
                  <Input.TextArea style={{ width: '528px' }} rows={4} placeholder="输入用户手机号，以半角逗号隔开，例13928387247,15619237922" />
                )
              )}
              <div>
                <Upload size={2} onChange={handleChange} value={fileList}>
                  <Button type="link">上传excel</Button>
                </Upload>
              </div>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="发送时间">
          {getFieldDecorator('sendingTimeKey', { initialValue: 0 })(
            <Radio.Group>
              <Radio style={radioStyle} value={0}>立即发送</Radio>
              <Radio style={radioStyle} value={1}>定时发送</Radio>
              {isTimedTransmission() && (
                <div>
                  选择时间：{getFieldDecorator('timedTransmissionTime')(<DatePicker showTime />)}
                </div>
              )}
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 5 },
        }}>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button className="ml10">取消</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default Form.create({ name: 'bulk-issuing' })(BulkIssuing);