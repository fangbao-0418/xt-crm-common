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
                <DescriptionsItem label='补偿原因'>Zhou Maomao</DescriptionsItem>
                <DescriptionsItem label='发起人'>1810000000</DescriptionsItem>
                <DescriptionsItem label='补偿类型'>Hangzhou, Zhejiang</DescriptionsItem>
                <DescriptionsItem label='补偿归属'>empty</DescriptionsItem>
                <DescriptionsItem span={2} label='补偿金额'>
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </DescriptionsItem>
                <DescriptionsItem span={2} label='转账方式'>
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </DescriptionsItem>
                <DescriptionsItem span={2} label='姓名'>
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </DescriptionsItem>
                <DescriptionsItem span={2} label='转账账号'>
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </DescriptionsItem>
                <DescriptionsItem span={2} label='补偿凭证'>
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </DescriptionsItem>
                <DescriptionsItem span={2} label='补偿说明'>
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </DescriptionsItem>
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
              <Descriptions column={1} title='订单信息'>
                <DescriptionsItem>
                  <DescriptionsItem label='补偿原因'>Zhou Maomao</DescriptionsItem>
                  <DescriptionsItem label='发起人'>1810000000</DescriptionsItem>
                  <DescriptionsItem label='补偿类型'>Hangzhou, Zhejiang</DescriptionsItem>
                  <DescriptionsItem label='补偿归属'>empty</DescriptionsItem>
                </DescriptionsItem>
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
              <Descriptions column={1} title='物流信息'>
                <DescriptionsItem>
                  <DescriptionsItem label='补偿原因'>Zhou Maomao</DescriptionsItem>
                  <DescriptionsItem label='发起人'>1810000000</DescriptionsItem>
                  <DescriptionsItem label='补偿类型'>Hangzhou, Zhejiang</DescriptionsItem>
                  <DescriptionsItem label='补偿归属'>empty</DescriptionsItem>
                </DescriptionsItem>
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