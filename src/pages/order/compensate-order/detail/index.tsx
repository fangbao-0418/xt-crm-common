import React from 'react'
import { Card, Table, Tabs, Descriptions, Divider } from 'antd'

const DescriptionsItem = Descriptions.Item

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

class Main extends React.Component {
  /* 补偿申请信息 */
  getApplInfo = () =>{
    return [
      {
        label: '补偿原因',
        value: 'Zhou Maomao',
        span: 1,
        text: 'text'
      },
      {
        label: '发起人',
        value: 'Zhou Maomao',
        span: 1,
        text: 'text'
      },
      {
        label: '补偿类型',
        value: 'Zhou Maomao',
        span: 1,
        text: 'text'
      },
      {
        label: '补偿归属',
        value: 'Zhou Maomao',
        span: 1,
        text: 'text'
      },
      {
        label: '补偿金额',
        value: 'Zhou Maomao',
        span: 2,
        text: 'text'
      },
      {
        label: '转账方式',
        value: 'Zhou Maomao',
        span: 2,
        text: 'text'
      },
      {
        label: '姓名',
        value: 'Zhou Maomao',
        span: 2,
        text: 'text'
      },
      {
        label: '转账账号',
        value: 'Zhou Maomao',
        span: 2,
        text: 'text'
      },
      {
        label: '补偿凭证',
        value: 'Zhou Maomao',
        span: 2,
        text: 'text'
      },
      {
        label: '补偿说明',
        value: 'Zhou Maomao',
        span: 2,
        text: 'text'
      }
    ]
  }

  render () {
    return (
      <Card bordered={false}>
        <Tabs>
          <Tabs.TabPane tab='补偿详情' key='1'>
            <Card
              title='补偿单编号：20190418131456778899 补偿状态：已完成'
              extra={<a href='#'>取消请求</a>}
            >
             <Descriptions column={2} title='补偿申请信息'>
               {
                 this.getApplInfo().map((item,  i) => (
                  <DescriptionsItem
                    key={i}
                    label={item.label}
                    span={item.span}
                  >
                    {item.value}
                  </DescriptionsItem>
                 ))
               }
              </Descriptions>
              <Divider dashed />
              <Descriptions column={1} title='审核信息'>
                <DescriptionsItem>
                  <Table
                    size='small'
                    bordered
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                  />
                </DescriptionsItem>
              </Descriptions>
              <Divider dashed />
              <Descriptions column={3} title='订单信息'>
              {
                 this.getApplInfo().map((item,  i) => (
                  <DescriptionsItem
                    key={i}
                    label={item.label}
                    span={item.span}
                  >
                    {item.value}
                  </DescriptionsItem>
                 ))
               }
              </Descriptions>
              <Divider dashed />
              <Descriptions column={1} title='商品信息'>
                <DescriptionsItem>
                  <Table
                    size='small'
                    bordered
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                  />
                </DescriptionsItem>
              </Descriptions>
              <Divider dashed />
              <Descriptions column={2} title='物流信息'>
              {
                 this.getApplInfo().map((item,  i) => (
                  <DescriptionsItem
                    key={i}
                    label={item.label}
                    span={item.span}
                  >
                    {item.value}
                  </DescriptionsItem>
                 ))
               }
              </Descriptions>
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

export default Main