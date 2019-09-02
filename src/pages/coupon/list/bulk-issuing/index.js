import React, { useState, useEffect } from 'react';
import { Message } from 'antd';
import { formItemLayout } from '@/config';
import { DatePicker, Row, Col, Card, Form, Checkbox, Input, Button, Radio } from 'antd';
import { saveCouponTaskInfo } from '../../api';
import Upload from '@/components/upload';
import moment from 'moment';
import { disabledDate as beforeDisabledDate, afterDisabledDate } from '@/pages/helper';
import '../index.scss'

const rangeDisabledDate = (current) => {
  return beforeDisabledDate(current) || afterDisabledDate(current);
}
// 批量发券
function BulkIssuing({ form: { getFieldDecorator, getFieldsValue, validateFields }, match, history }) {
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [fileValues, setFileValues] = useState('');
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  const getUserGroupValue = (fields) => {
    let result;
    switch (fields.receiveUserGroup) {
      case 0:
        return 'all';
      case 1:
        fields.userLevel = fields.userLevel.include(30) ? [...fields.userLevel, 40] : fields.userLevel;
        result = fields.userLevel.join(',')
        return result;
      case 2:
        result = fields.userPhones;
        return result;
      case 3:
        return fileValues;
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
        result = fields.timedTransmissionTime && fields.timedTransmissionTime.valueOf();
        return result;
      default:
        return 0;
    }
  }
  const handleSave = () => {
    const { receiveUserGroup } = getFieldsValue(['receiveUserGroup']);
    if (receiveUserGroup === 3 && Array.isArray(fileList) && fileList.length === 0) {
      Message.error('请上传Excel文件');
      return;
    }
    validateFields(async (err, fields) => {
      if (!err) {
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
    })
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
  const isExcelUpload = () => {
    const { receiveUserGroup } = getFieldsValue(['receiveUserGroup']);
    return receiveUserGroup === 3;
  }
  const handleChange = (fileList) => {
    fileList = fileList.slice(-1);
    console.log('fileList=>', fileList)
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    const { url, name } = fileList[0] || {};
    setFileValues(url + ',' + name);
    setFileList(fileList);
  }
  const handleCancel = () => {
    history.goBack();
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
                <Form.Item>
                  {getFieldDecorator('userPhones', { rules: [{ required: true, message: '请输入用户手机号' }] })(
                    <Input.TextArea style={{ width: '528px' }} rows={4} placeholder="输入用户手机号，以半角逗号隔开，例13928387247,15619237922" />
                  )}
                </Form.Item>
              )}
              <Radio style={radioStyle} value={3}>Excel文件上传</Radio>
              {isExcelUpload() && (
                <Upload accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" size={5} onChange={handleChange} value={fileList}>
                  <Button type="link">上传excel</Button>
                  <span>(文件最大上传5M)</span>
                </Upload>
              )}
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="发送时间">
          {getFieldDecorator('sendingTimeKey', { initialValue: 0 })(
            <Radio.Group>
              <Radio style={radioStyle} value={0}>立即发送</Radio>
              <Radio style={radioStyle} value={1}>定时发送</Radio>
              {isTimedTransmission() && (
                <Row type="flex">
                  <span>选择时间：</span>
                  <Form.Item>{getFieldDecorator('timedTransmissionTime', { rules: [{ required: true, message: '请选择时间' }] })(<DatePicker showTime disabledDate={rangeDisabledDate} />)}
                  </Form.Item>
                  <span class="ml10">（定时发送最多30天）</span>
                </Row>
              )}
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 5 },
        }}>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button className="ml10" onClick={handleCancel}>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default Form.create({ name: 'bulk-issuing' })(BulkIssuing);