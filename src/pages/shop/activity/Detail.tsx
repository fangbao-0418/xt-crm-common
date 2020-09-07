import React from 'react'
import { Card, Tabs, Table, Button, Upload, Icon } from 'antd'
import { Form, FormItem, ListPage, Alert } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { getDefaultConfig } from './config'
import UploadView from '@/components/upload'
import { ColumnProps } from 'antd/es/table'
import { statusEnum } from './config'

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
interface State {
  activeKey: string
}
class Main extends React.Component<{}, State> {
  public state = {
    activeKey: ''
  }
  public onTabChange = (key: string) => {
    this.setState({
      activeKey: key
    })
  }
  public render () {
    const { activeKey } = this.state
    return (
      <Card title='前端会场设置'>
        <Form config={getDefaultConfig()}>
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
          <Tabs
            activeKey={activeKey}
            onChange={this.onTabChange}
          >
            {tabConfig.map((item: any) => {
              return (
                <TabPane tab={item.label} key={item.value}>
                  <div>
                    已报名商品列表 （ 已报名
                    <span style={{ color: 'red' }}>24</span>
                    款 sku
                    <span style={{ color: 'red' }}>342</span>
                    款 审核通过sku
                    <span style={{ color: 'red' }}>20</span>
                    款 审核拒绝sku
                    <span style={{ color: 'red' }}>3</span>
                    款 可供总库存：
                    <span style={{ color: 'red' }}>384732</span>
                    个）
                  </div>
                  <AlertTabItem />
                </TabPane>
              )
            })}
          </Tabs>
        </Form>
      </Card>
    )
  }
}

interface TabItemState {
  fileList: any[]
  uploading: boolean
}
class TabItem extends React.Component<AlertComponentProps, TabItemState> {
  public state = {
    fileList: [],
    uploading: false
  }
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
            dataIndex: 'status',
            render: (text) => {
              return statusEnum['待审核'] === text ? <span style={{ color: 'red' }}>{statusEnum[text]}</span> : statusEnum[text]
            }
          }, {
            title: '操作',
            render: (record) => {
              switch(record.status) {
                case statusEnum['拒绝']:
                  return '-'
                case statusEnum['通过']:
                  return (<span className='href'>拒绝</span>)
                case statusEnum['待审核']:
                  return (
                    <>
                      <span className='href'>通过</span>
                      <span className='href'>拒绝</span>
                    </>
                  )
              }
            }
          }]}
          dataSource={data}
        />
      )
    }
  }]
  public render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: (file: any) => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file: any) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <ListPage
        formConfig={getDefaultConfig()}
        namespace='detailFormConfig'
        formItemLayout={(
          <>
            <FormItem name='productId' />
            <FormItem name='productName' />
            <FormItem name='status' />
          </>
        )}
        addonAfterSearch={(
          <>
            <Button
              type='primary'
              ghost
            >
              导出商品
            </Button>
            <Button
              type='primary'
              ghost
              className='ml10'
              onClick={() => {
                this.props.alert({
                  title: '导入商品',
                  content: (
                    <>
                      <div>
                        <span>上传表格：</span>
                        <Upload {...props}>
                          <span className='href'>+添加表格</span>
                        </Upload>
                      </div>
                      <div>请按下载的表格模板导入，否则可能导入不成功。</div>
                    </>
                  )
                })
              }}
            >
              导入商品
            </Button>
          </>
        )}
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
                status: 1,
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

const AlertTabItem = Alert(TabItem)


export default Main