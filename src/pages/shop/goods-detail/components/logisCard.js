import React from 'react';
import { Card, Form, Table, Spin } from 'antd';
import WrapCard from './wrapCard'
import { getFreightTemplate } from '../api';

const FormItem = Form.Item

const FreightInfo = ({ data: freightTemplate }) => {

  if (!freightTemplate) return <Spin />

  const columns = [{
    title: '编号',
    dataIndex: 'index',
    width: 200,
    key: 'index',
    render: (val, record, index) => {
      return index + 1;
    }
  },
  {
    title: '目的地',
    dataIndex: 'describe',
    key: 'describe'
  },
  {
    title: '运费/元',
    dataIndex: 'fare',
    key: 'fare',
    width: 200,
    render: (text, record, index) => {
      return record.rankType === 1 ? record.cost : '不发货';
    }
  }]

  return <div>
    <p>
      模板名称: {freightTemplate.templateName}{' '}
      默认运费: {freightTemplate.defaultNumber}
    </p>
    <Table
      pagination={false}
      dataSource={freightTemplate.rankList}
      columns={columns}
    />
  </div>
}

class LogisCard extends React.Component {
  state = {
    freightTemplate: null
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data && this.props.data) {
      this.fetchTemplateDetail()
    }
  }

  fetchTemplateDetail = () => {
    const { data: { freightTemplateId } } = this.props
    getFreightTemplate(freightTemplateId).then(freightTemplate => {
      this.setState({
        freightTemplate
      })
    })
  }

  render() {
    const { data } = this.props
    const { freightTemplate } = this.state

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    return (
      <WrapCard
        data={data}
        render={logisInfo => (
          <Card title='物流信息'>
            <Form {...formItemLayout}>
              <FormItem label="物流体积">
                <span className="ant-form-text">{logisInfo.bulk}</span>
              </FormItem>
              <FormItem label="物流重量">
                <span className="ant-form-text">{logisInfo.weight}</span>
              </FormItem>
              <FormItem label="运费设置">
                {
                  logisInfo.withShippingFree === 1 ?
                    '包邮' :
                    <FreightInfo data={freightTemplate} />
                }
              </FormItem>
              <FormItem label="退货地址">
                <div>
                  <p>{logisInfo.returnContact} {logisInfo.returnPhone}</p>
                  <p>{logisInfo.returnAddress}</p>
                </div>
              </FormItem>
            </Form>
          </Card>
        )}
      />
    )
  }
}

export default LogisCard