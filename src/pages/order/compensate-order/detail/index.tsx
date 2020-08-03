import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Card, Table, Tabs, Divider, Button } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Info from '../components/info'
import { getFieldsConfig, getApplInfo } from './config'
import { getCompensateDetail, getCompensateRecord } from '../api'

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

interface Props extends RouteComponentProps<{ compensateCode: string }>, AlertComponentProps {}

interface State {
  detail: object | null
  detailLoad: boolean
  record: any[]
  recordLoad: boolean
  tabKey: 'detail' | 'record'
}

class Main extends React.Component<Props, State> {
  compensateCode = this.props.match.params.compensateCode
  /* 补偿申请信息 */
  state: State = {
    detail: null,
    detailLoad: false,
    record: [],
    recordLoad: false,
    tabKey: 'detail'
  }

  componentDidMount () {
    this.fetchDetail()
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

  handleTabChange = (tabKey: any) => {
    this.setState({
      tabKey
    }, () => {
      if (!this.state.recordLoad && tabKey === 'record') {
        this.fetchRecord()
      }
    })
  }

  fetchDetail = () => {
    getCompensateDetail({
      compensateCode: this.compensateCode
    }).then(() => {
      this.setState({
        detailLoad: true
      })
    })
  }

  fetchRecord = () => {
    getCompensateRecord({}).then(() => {
      this.setState({
        recordLoad: true
      })
    })
  }
  render () {
    const { tabKey, detailLoad, recordLoad } = this.state
    console.log(APP.user.id, 111111)
    return (
      <Card bordered={false}>
        <Tabs activeKey={tabKey} onChange={this.handleTabChange}>
          <Tabs.TabPane tab='补偿详情' key='detail'>
            {
              detailLoad ? (
                <Card
                  title='补偿单编号：20190418131456778899 补偿状态：已完成'
                  extra={
                    <>
                      <Button type='primary' size='small' onClick={this.handleAduit} className='mr8'>取消请求</Button>
                      <Button type='primary' size='small' onClick={this.handleAduit}>审核</Button>
                    </>
                  }
                >
                  <Info title='申请补偿信息' column={2} data={getApplInfo()} />
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
                  <Info title='订单信息' column={2} data={getApplInfo()} />
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
                  <Info title='物流信息' column={2} data={getApplInfo()} />
                </Card>
              ) : (
                <Card loading={true}></Card>
              )
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab='信息记录' key='record'>
            {
              recordLoad ? (
                <Table
                  bordered
                  size='middle'
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                />
              ) : (
                <Card loading={true}></Card>
              )
            }
          </Tabs.TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Alert(Main)