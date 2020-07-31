import React from 'react'
import { Card, Table, Tabs, Divider } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Info from '../components/info'
import { getFieldsConfig } from './config'

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
]

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
]

interface Props extends AlertComponentProps {}

class Main extends React.Component<Props> {
  /* 补偿申请信息 */
  getApplInfo = () => {
    return [
      {
        label: '补偿原因',
        value: 'Zhou Maomao',
        span: 1,
        type: 'text'
      },
      {
        label: '发起人',
        value: 'Zhou Maomao',
        span: 1,
        type: 'text'
      },
      {
        label: '补偿类型',
        value: 'Zhou Maomao',
        span: 1,
        type: 'text'
      },
      {
        label: '补偿归属',
        value: 'Zhou Maomao',
        span: 1,
        type: 'text'
      },
      {
        label: '补偿金额',
        value: 'Zhou Maomao',
        span: 2,
        type: 'text'
      },
      {
        label: '转账方式',
        value: 'Zhou Maomao',
        span: 2,
        type: 'text'
      },
      {
        label: '姓名',
        value: 'Zhou Maomao',
        span: 2,
        type: 'text'
      },
      {
        label: '转账账号',
        value: 'Zhou Maomao',
        span: 2,
        type: 'text'
      },
      {
        label: '补偿凭证',
        value: 'https://assets.hzxituan.com/small-store-logo/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551587803910284.png',
        span: 2,
        type: 'image'
      },
      {
        label: '补偿说明',
        value: 'Zhou Maomao',
        span: 2,
        type: 'text'
      }
    ]
  }

  handleAduit = () => {
    let form: FormInstance
    this.props.alert({
      title: '审核',
      content: (
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          config={getFieldsConfig()}
          getInstance={(ref) => {
            form = ref
          }}
        >
          <FormItem verifiable name='compensateStatus' />
          <FormItem verifiable name='responsibilityType' />
          <FormItem verifiable name='compensateAmount' />
          <FormItem verifiable required name='illustrate' />
          <FormItem verifiable name='recepitorAccountName' />
          <FormItem verifiable name='receiptorAccountNo' />
          <FormItem verifiable name='remarks' />
      </Form>
      ),
      onOk: () => {
        form.props.form.validateFields((err, values) => {
          if (err) {
            return
          }
          console.log(values)
        })
      }
    })
  }
  render () {
    return (
      <Card bordered={false}>
        <Tabs>
          <Tabs.TabPane tab='补偿详情' key='1'>
            <Card
              title='补偿单编号：20190418131456778899 补偿状态：已完成'
              extra={<span onClick={this.handleAduit} className='href'>审核</span>}
            >
              <Info title='申请补偿信息' column={2} data={this.getApplInfo()} />
              <Divider dashed />
              <Info title='审核信息'>
                <Table
                  size='small'
                  bordered
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                />
              </Info>
              <Divider dashed />
              <Info title='订单信息' column={2} data={this.getApplInfo()} />
              <Divider dashed />
              <Info title='商品信息'>
                <Table
                  size='small'
                  bordered
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                />
              </Info>
              <Divider dashed />
              <Info title='物流信息' column={2} data={this.getApplInfo()} />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab='信息记录' key='2'>
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Alert(Main)