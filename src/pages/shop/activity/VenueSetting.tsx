import React from 'react'
import { Card, Tabs, Table } from 'antd'
import { Form, FormItem, ListPage } from '@/packages/common/components'
import { getVenueSettingConfig } from './config'
import UploadView from '@/components/upload'
import { ColumnProps } from 'antd/es/table'

const { TabPane } = Tabs

const tabConfig = [{
  label: '所有商品',
  value: ''
}, {
  label: '待审核',
  value: '1'
}, {
  label: '审核通过',
  value: '2'
}, {
  label: '审核拒绝',
  value: '3'
}]

class Main extends React.Component {
  public render () {
    return (
      <Card title='前端会场设置'>
        <Form config={getVenueSettingConfig()}>
          <FormItem name='name' type='text' />
          <FormItem
            label='会场图标'
            inner={(form) => {
              return (
                <UploadView
                  ossType='cos'
                  listType='picture-card'
                  listNum={1}
                  size={0.3}
                />
              )
            }}
          />
          <FormItem
            label='会场背景图'
            inner={(form) => {
              return (
                <UploadView
                  ossType='cos'
                  listType='picture-card'
                  listNum={1}
                  size={0.3}
                />
              )
            }}
          />
          <FormItem
            label='会场标签'
          >
            大牌 品牌直销 高性价比
          </FormItem>
          <FormItem
            label='会场介绍'
          >
            最好的货源最好的价格
          </FormItem>
          <Tabs>
            {tabConfig.map((item: any) => {
              return (
                <TabPane tab={item.label} key={item.value}>
                  <TabItem />
                </TabPane>
              )
            })}
          </Tabs>
        </Form>
      </Card>
    )
  }
}

class TabItem extends React.Component {
  public columns: ColumnProps<any>[] = [{
    title: '序号',
    dataIndex: 'id'
  }, {
    title: '商品id',
    dataIndex: 'productId'
  }, {
    title: '商品名称',
    dataIndex: 'productName'
  }, {
    title: '商品主图',
    dataIndex: 'coverImage'
  }, {
    title: '规格信息',
    dataIndex: 'skuInfo',
    render(data) {
      return (
        <Table
          columns={[{
            title: 'SKU名称',
            dataIndex: 'skuName'
          }, {
            title: '活动价',
            dataIndex: 'price'
          }, {
            title: '活动供货价',
            dataIndex: 'salePrice'
          }, {
            title: '活动库存',
            dataIndex: 'activityStock'
          }, {
            title: '剩余库存',
            dataIndex: 'remaindStock'
          }, {
            title: '状态',
            dataIndex: 'status'
          }, {
            title: '操作',
            render: () => {
              return (
                <span className='href'>通过</span>
              )
            }
          }]}
          dataSource={data}
        />
      )
    }
  }]
  public render() {
    return (
      <ListPage
        columns={this.columns}
        api={async () => {
          return {
            page: 1,
            pages: 10,
            records: [{
              id: 1,
              productId: 68452,
              productName: '美颜秘笈口红',
              coverImage: '',
              skuInfo: [{
                name: '1212',
                price: '212',
                salePrice: '122',
                stock: '221',
                activityStock: '1',
                remaindStock: '1'
              }]
            }]
          }
        }}
      />
    )
  }
}


export default Main